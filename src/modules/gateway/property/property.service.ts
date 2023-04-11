import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/share/common/base.service';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { CrawlerConfigService } from 'src/share/configs/config.service';
import { CreatePrimaryContactDTO, CreatePropertyDTO, GetListPropertyDTO, ownerDTO, UpdateOwnerDTO, UpdatePrimaryContactDTO, UpdatePropertyDTO } from './property.dto';
import { PROPERTY_STATUS, ROOM_TYPE } from './property.const';
import { order_by } from 'src/share/dto/page-option-swagger.dto';
import { USER_ROLES } from 'src/share/common/constants';
import { FileService, UtilService } from 'src/share/common/providers';
import { Payload } from '../auth';
import { throws } from 'assert';
import { ResponseUtils } from 'src/share/utils/response.utils';

@Injectable()
export class PropertyService extends BaseService {
  constructor(prismaService: PrismaService, configService: ConfigService,
    private crawlerConfigService: CrawlerConfigService,
    private readonly util: UtilService,
    private readonly fileService: FileService) {
    super(prismaService, 'property', 'Property', configService);
  }
  private FILE_URL: string = process.env['API_FILE_URL'] ? process.env['API_FILE_URL'] : 'http://172.16.1.224:8354';
  async createProperty(data: CreatePropertyDTO, adminId: number): Promise<any> {
    await this.validateOwners(data.owners);
    this.validatePercentage(data.owners);
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const property = await transaction.property.create({ data: { createdBy: adminId } });
        for (let owner of data.owners) {
          await this.createOwnerOfProperty(property.id, owner.userId, Number(owner.percentage), transaction);
        }
        return await this.getProperty(property.id, transaction);
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async validateOwners(owners: ownerDTO[]) {
    const ownerIdArr = owners.map((owner) => { return owner.userId });
    if (ownerIdArr.length !== ownerIdArr.filter((value, index, array) => array.indexOf(value) === index).length) {
      throw new BadRequestException("2 owners should not be duplicated");
    }

    for(const owner of owners) {
      const user = await this.prismaService.user.findFirst({ where: { id: owner.userId, role: USER_ROLES.USER } });
      if (!user) {
        throw new BadRequestException(`User id ${owner.userId} not exist!`);
      }
    }
  }

  validatePercentage(owners: ownerDTO[]) {
    let sumPercentage = 0;
    for(const owner of owners) {
      sumPercentage += Number(owner.percentage);
    }
    if (sumPercentage != 100) {
      throw new BadRequestException(`Total percentage must be 100`);
    }
  }

  async createOwnerOfProperty(propertyId: number, userId: number, percentage: number, transaction: any) {
    return await transaction.ownerOfProperty.create({
      data: {
        propertyId,
        userId,
        percentage
      }
    });
  }

  async updateProperty(data: UpdatePropertyDTO) {
    this.validateRoomInformation(data);
    const property = await this.prismaService.property.findFirst({ where: { id: data.id } });
    if (!property) {
      throw new BadRequestException(`Property with id: ${data.id} not found`);
    }
    try {
      await this.prismaService.$transaction(async (transaction) => {
        await this.updatePropertyProfile(data, transaction);
        await this.createRooms(data.id, data.room, transaction);
      });
      return await this.getProperty(data.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePropertyProfile(data: UpdatePropertyDTO, transaction: any) {
    const id = data.id;
    let clonedData = Object.assign({}, data);
    delete clonedData.id;
    delete clonedData.room;
    await transaction.property.update({
      where: { id: id },
      data: clonedData
    });
  }

  async createRooms(propertyId: number, rooms: any, transaction: any) {
    // Remove all old room
    await transaction.room.deleteMany({ where: { propertyId } });

    rooms.map((room) => {
      room.propertyId = propertyId;
      room.length = Number(room.length);
      room.width = Number(room.width);
      room.feature = JSON.stringify(room.feature);
    });
    await transaction.room.createMany({ data: rooms});
  }

  async getProperty(id: number, transaction: any = undefined) {
    let include = this.getPropertyIncludeQuery();
    let property: any;
    let query = {
      where: {
        id,
        NOT: {
          status: PROPERTY_STATUS.DELETED 
        }
      },
      include: include,
    };
    if (transaction !== undefined) {
      property = await transaction.property.findFirst(query);
    } else {
      property = await this.prismaService.property.findFirst(query);
    }
    if (property?.room !== undefined && property?.room.length) {
      property.room.map((room: any) => {
        room.feature = JSON.parse(room.feature)
      });
    }
    if (property) {
      return property;
    }
    throw new BadRequestException(`Property with id: ${id} not found`);
  }

  getPropertyIncludeQuery() {
    return {
      owner: {
        select: {
          userId: true,
          percentage: true,
          user: {
            select: {
              email: true,
              name: true,
              dateOfBirth: true
            }
          }
        }
      },
      room: true,
    };
  }

  validateRoomInformation(data: UpdatePropertyDTO) {
    if (data.bedroomCount &&
      data.bedroomCount !== data.room.filter((room) => { return room.type == ROOM_TYPE.BEDROOM }).length) {
      throw new BadRequestException(`Bedroom information need equal with bedroomCount`);
    }
    if (data.bathroomCount &&
      data.bathroomCount !== data.room.filter((room) => { return room.type == ROOM_TYPE.BATHROOM }).length) {
      throw new BadRequestException(`Bathroom information need equal with bedroomCount`);
    }
    const otherRooms = Object.keys(data)
      .filter(key => key.includes('has'))
      .reduce((obj, key) => {
        obj[key.replace("has", "").toUpperCase()] = Number(data[key]);
        return obj;
      }, {});
    for (const roomName in otherRooms) {
      if (otherRooms[roomName] != data.room.filter((room) => { return room.type == ROOM_TYPE[roomName] }).length) {
        throw new BadRequestException(`${roomName} information missing or redundancy`);
      }
    }
  }

  async getListProperty(params: GetListPropertyDTO) {
    let where = {
      NOT: {
        status: PROPERTY_STATUS.DELETED 
      }
    };
    let orderBy = {};
    if (params.filterStatus != undefined) {
      where['status'] = params.filterStatus;
    }
    if (params.search != undefined) {
      where['OR'] = [
        { name: { contains: params.search } },
        { description: { contains: params.search } },
        { owner: { some: { user: { name: { contains: params.search } } } } },
        { owner: { some: { user: { email: { contains: params.search } } } } },
      ];
    }
    if (params.order_by != undefined && params.sort_by != undefined) {
      orderBy[`${params.sort_by}`] = params.order_by;
    } else {
      orderBy['id'] = order_by.desc;
    }
    const take = params.size;
    const skip = Math.max(Math.max(params.page - 1, 0) * take, 0);
    let result = await this.prismaService.property.findMany({
      where,
      include: this.getPropertyIncludeQuery(),
      orderBy,
      skip,
      take,
    });
    result.map(property => {
      if (property?.room !== undefined && property?.room.length) {
        property.room.map((room: any) => {
          room.feature = JSON.parse(room.feature)
        });
      }
      return property;
    });
    const meta = await this.buildMetaData(take, where);
    return { meta, data: result };
  }

  async deleteProperty(id: number) {
    await this.getPropertyById(id);
    try {
      await this.prismaService.property.update({
        where: { id },
        data: { status: PROPERTY_STATUS.DELETED }
      });
      return { result: "Delete property success" };
    } catch (e) {
      console.log(e);
      throw new HttpException(`Property delete failure`, HttpStatus.BAD_REQUEST);
    }
  }

  async updateOwner(data: UpdateOwnerDTO): Promise<any> {
    await this.validateOwners(data.owners);
    this.validatePercentage(data.owners);
    const property = await this.prismaService.property.findFirst({ where: { id: data.id } });
    if (!property) {
      throw new BadRequestException(`Property with id ${data.id} not found`);
    }
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        await transaction.ownerOfProperty.deleteMany({ where: { propertyId: property.id } });
        for (let owner of data.owners) {
          await this.createOwnerOfProperty(property.id, owner.userId, Number(owner.percentage), transaction);
        }
        return await this.getProperty(property.id, transaction);
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getPropertyById(id: number): Promise<any> {
    const property = await this.prismaService.property.findFirst({ where: { id } });
    if (!property) {
      throw new BadRequestException(`Property with id: ${id} not found`);
    }
    return property;
  }

  async createPrimaryContact(data: CreatePrimaryContactDTO) {
    await this.validateCountryAndState(data.countryId, data.stateId);
    const property = await this.getPropertyById(data.propertyId);
    if (property.primaryContactId) {
      throw new BadRequestException(`Property already have primary contact`);
    }
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        delete data.propertyId;
        const primaryContact = await transaction.primaryContact.create({ data });
        await transaction.property.update({
          where: { id: property.id },
          data: { primaryContactId: primaryContact.id }
        });
        return primaryContact;
      });
    } catch (error) {
      console.log("Error in create primary contact:", error);
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async validateCountryAndState(countryId: number, stateId: number) {
    const country = await this.prismaService.country.findFirst({ where: { id: countryId } });
    if (!country) {
      throw new BadRequestException(`Country with id: ${countryId} does not exist`);
    }
    const state = await this.prismaService.state.findFirst({ where: { id: stateId } });
    if (!state) {
      throw new BadRequestException(`State with id: ${stateId} does not exist`);
    }
    if (state.countryId != countryId) {
      throw new BadRequestException(`State does not included in country`);
    }
  }

  async updatePrimaryContact(data: UpdatePrimaryContactDTO) {
    await this.validateCountryAndState(data.countryId, data.stateId);
    const primaryContactId = data.id;
    await this.getPrimaryContact(primaryContactId);
    delete data.id;
    await this.prismaService.primaryContact.update({
      where: { id: primaryContactId },
      data
    });
    return await this.getPrimaryContact(primaryContactId);
  }

  async getPrimaryContact(id: number) {
    const primaryContact = await this.prismaService.primaryContact.findFirst({ where: { id } });
    if (!primaryContact) {
      throw new BadRequestException(`Primary contact with id: ${id} not found`);
    }
    return primaryContact;
  }

   /* Upload list of document by formdata
  @Param:
  @Return: success
  */
  public async uploadDocument(
    files: Express.Multer.File[],
    folderNumber: string[],
    id: number,
    removeDocument: number[],
    folderName: Array<string>,
    user: string,
    descriptionFolder: string[],
    descriptionFile: Array<string>,
    removeForder: string[],
    documentIds: number[],
    descriptionFileUpdate: string[],
    isPublicDocument: number[],
  ):Promise<any> {
    console.log('abac', folderNumber, id, removeDocument, folderName);

    for (let i = 0; i < files.length; i++) {
      if (
        ![
          'png',
          'jpg',
          'jpeg',
          'docx',
          'doc',
          'xls',
          'excel',
          'pdf',
          'csv',
          'xlsx',
        ].includes(this.checkType(files[i].originalname.toLowerCase()))
      ) {
        throw new HttpException(
          this.util.buildCustomResponse(
            2,
            '',
            'You can upload only: pdf, word, excel, jpg, jpeg, png',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
      if (files[i].size > 25000194) {
        throw new HttpException(
          this.util.buildCustomResponse(2, '', 'File must smaller than 25MB!'),
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    console.log(isNaN(id),"ddddddd")
    if(isNaN(id) )
      throw new HttpException(
        this.util.buildCustomResponse(2, '', 'Id must be an integer number'),
        HttpStatus.BAD_REQUEST,
      );
    const property = await this.prismaService.property.findFirst({
      where: { id: Number(id) },
    });
    if (!property) {
      throw new HttpException(
        this.util.buildCustomResponse(2, '', 'Not found property'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const finalFolderName = String(folderName).split(',');
    console.log('finalFolderName',finalFolderName)
    
    const finalDescriptionFolder = String(descriptionFolder).split(',');
    const finalDescriptionFile = String(descriptionFile).split(',');
    const finalDocumentIds: number[] =
      documentIds && Array.isArray(documentIds)
        ? documentIds
        : [Number(documentIds)];
    const finalDescriptionFileUpdate = String(descriptionFileUpdate).split(',');

    const finalIsPublicDocument: number[] =
      isPublicDocument && Array.isArray(isPublicDocument)
        ? isPublicDocument
        : [];
    console.log('abcac-----', isPublicDocument);
    if (removeDocument && removeDocument.length > 0) {
      // await this.documentRepository.update(removeDocument, { is_active: false, deleted_at: new Date(Date.now()) });
      // assetProfile.updated_at = new Date(Date.now());
      // await this.assetProfileRepository.save(assetProfile);
      console.log(removeDocument);
      // await this.prismaService.$transaction(
      //   removeDocument.map((tagId) =>
      //     this.prismaService.document.update({
      //       where: { id: parseInt(tagId) },
      //       data: { is_active: false },
      //     }),
      //   ),
      // );
      await this.prismaService.$transaction(async (transaction) => {
        for (let id of removeDocument) {
          await this.prismaService.document.update({where: { id: Number(id) },data: { is_active: false }})
          console.log(id,"abbbbbbbbb")
        }
      });
    }
    // if (isPublicDocument && isPublicDocument.length > 0) {
    //   await this.documentRepository.update(isPublicDocument, { is_public: false});
    // }
    if (removeForder && removeForder.length > 0) {

      await this.prismaService.$transaction(async (transaction) => {
        for (let id of removeForder) {
          await this.prismaService.folder.update({where: { id: Number(id) },data: { is_active: false }})
          console.log(id,"abbbbbbbbb")
        }
      });

      // await this.prismaService.$transaction(
      //   removeForder.map((tagId) =>
      //     this.prismaService.document.updateMany({
      //       where: { folderId: Number(tagId) },
      //       data: {
      //         is_active: false,
      //       },
      //     }),
      //   ),
      // );

      await this.prismaService.$transaction(async (transaction) => {
        for (let id of removeForder) {
          await this.prismaService.document.updateMany({where: { folderId: Number(id) },data: { is_active: false }})
          console.log(id,"abbbbbbbbb")
        }
      });

     
    }
    const oldFolderAsset = await this.prismaService.folder.findMany({
      include: {
        property: true,
      },
      where: {
        propertyId: Number(id),
        is_active: true,
      },
      orderBy: { number: 'asc' },
    });

    if (
      finalFolderName &&
      Array.isArray(finalFolderName) &&
      finalFolderName.length > 0 &&
      folderName &&
      folderName.length > 0
    ) {
      for (let i = 0; i < finalFolderName.length; i++) {
        console.log('folder description -----------', descriptionFolder[i]);
        if (i < oldFolderAsset.length) {
          await this.prismaService.folder.update({where:{
            id: oldFolderAsset[i].id
          },
        data:{
          folderName: finalFolderName[i],
          number: i+1,
          description: finalDescriptionFolder[i],
        }})
        } else {
          // create new
          const newFolder: any = await this.prismaService.folder.create({
            data: {
              propertyId: Number(id),
              number: i + 1,
              folderName: finalFolderName[i],
              description: finalDescriptionFolder[i],
            },
          });
          oldFolderAsset.push(newFolder);
        }
      }
    }
    // if (oldFolderAsset.length > 0)
    //   await this.prismaService.folder.createMany({ data: oldFolderAsset });
    if (files && files.length > 0) {
      console.log('dđ-----', files, user);
      const documentsRaw = await this.fileService.uploadBufferFile(
        files,
        String(user),
      );
      // const filesDb = await this.fileRepository.findByIds(
      //   documentsRaw.map((p: any) => p.id),
      // );
      // const filesDb = documentsRaw.map((tagId) =>
      //   this.prismaService.folder.findMany({
      //     where: { id: parseInt(tagId) },
      //   }),
      // );
      const documents = [];
      for (let i = 0; i < documentsRaw.length; i += 1) {
        const document = {};

        document['propertyId'] = property.id;
        document['fileId'] = documentsRaw[i].id;
        document['folderId'] = oldFolderAsset[Number(folderNumber[i]) - 1 || 0].id;
        console.log(
          'fileeeeeeeeeeeee description -----------',
          descriptionFile[i],
        );
        document['description'] = finalDescriptionFile[i];
        console.log('finalIsPublicDocument[i]---', isPublicDocument[i], i);
        document['isPublic'] = Boolean(isPublicDocument[i]);
        documents.push(document);
      }
      await this.prismaService.document.createMany({ data: documents });
    }

    if (
      finalDocumentIds &&
      finalDocumentIds.length > 0 &&
      documentIds &&
      documentIds.length > 0
    ) {
      for (let i = 0; i < finalDocumentIds.length; i++) {
        // await this.documentRepository.update(finalDocumentIds[i], {
        //   description: finalDescriptionFileUpdate[i],
        //   is_public: Number(finalIsPublicDocument[i]),
        // });
        await this.prismaService.document.update({
          where: { id: finalDocumentIds[i] },
          data: {
            description: finalDescriptionFileUpdate[i],
            isPublic: Boolean(isPublicDocument[i]),
          },
        });
      }
    }

    console.log('Upload document done');
    // if (files && files.length > 0) {
    //   if (!types) {
    //     throw new HttpException(this.util.buildCustomResponse(1, '', 'Not valid type'), HttpStatus.BAD_REQUEST);
    //   }
    //   const documentsRaw = await this.fileService.uploadBufferFile(files, user);
    //   const filesDb = await this.fileRepository.findByIds(documentsRaw.map((p: any) => p.id));
    //   const documents: Array<Document> = [];
    //   for (let i = 0; i < documentsRaw.length; i += 1) {
    //     const document = new Document();
    //     document.id = v4();
    //     document.asset_profile = assetProfile;
    //     if (Array.isArray(types)) {
    //       document.document_type = documentType.find((documentTypeDb: DocumentType) => documentTypeDb.id === Number(types[i]));
    //     } else document.document_type = documentType.find((documentTypeDb: DocumentType) => documentTypeDb.id === Number(types));
    //     document.file = filesDb.find((fileDb: File) => fileDb.id === documentsRaw[i].id);
    //     documents.push(document);
    //   }
    //   assetProfile.updated_at = new Date(Date.now());
    //   await this.assetProfileRepository.save(assetProfile);
    //   await this.documentRepository.save(documents);
    // }
    // if (updateDocument && updateDocument.length > 0) {
    //   if (Array.isArray(updateDocument)) {
    //     if (!updateType || updateType.length !== updateDocument.length) {
    //       throw new HttpException(this.util.buildCustomResponse(1, '', 'Not valid type update'), HttpStatus.BAD_REQUEST);
    //     }
    //     const documents: Array<Document> = [];
    //     for (let i = 0; i < updateDocument.length; i += 1) {
    //       const document = await this.documentRepository.findOne({ id: updateDocument[i] });
    //       if (!document) throw new HttpException(this.util.buildCustomResponse(4, '', 'Not found document'), HttpStatus.BAD_REQUEST);
    //       document.document_type = documentType.find((documentTypeDb: DocumentType) => documentTypeDb.id === Number(updateType[i]));
    //       documents.push(document);
    //     }
    //     await this.documentRepository.save(documents);
    //   } else {
    //     if (!updateType) throw new HttpException(this.util.buildCustomResponse(7, '', 'Not valid type'), HttpStatus.BAD_REQUEST);
    //     const document = await this.documentRepository.findOne({ id: updateDocument });
    //     if (!document) throw new HttpException(this.util.buildCustomResponse(4, '', 'Not found document'), HttpStatus.BAD_REQUEST);
    //     document.document_type = documentType.find((documentTypeDb: DocumentType) => documentTypeDb.id === Number(updateType[0]));
    //     await this.documentRepository.save(document);
    //   }
    //   assetProfile.updated_at = new Date(Date.now());
    //   await this.assetProfileRepository.save(assetProfile);
    // }
    // if (removeDocument && removeDocument.length > 0) {
    //   await this.documentRepository.update(removeDocument, { is_active: false });
    //   assetProfile.updated_at = new Date(Date.now());
    //   await this.assetProfileRepository.save(assetProfile);
    // }
    return ResponseUtils.buildSuccessResponse(null);
  }

  public checkType(name: string): string {
    if (!name) return '';
    const arr = name.split('.');
    const type = arr[arr.length - 1];
    return type;
  }

  async getDocuments(id: number) {
    const folder = await this.prismaService.folder.findMany({
      where: { propertyId: id },
      include: {
        Document: {
          orderBy:{createdAt:'desc'},
          include: {
            File: true
          }
        }
      },
    });

    // const documentList = folder
    //   ? folder.?.map((document: Document) => ({
    //     id: document.id,
    //     mimeType: document.file?.mimetype,
    //     filename: document.file?.originalName,
    //     folderName: document.folder?.folderName ? document.folder?.folderName : 'Unknown',
    //     folderNumber: document.folder?.number ? document.folder?.number : 1,
    //     size: document.file?.size,
    //     createdAt: document.file?.created_at,
    //     url: `${this.FILE_URL}/${document.file?.filename}`,
    //     description: document.description,
    //     isPublic: document.is_public,
    //   }))
    //   : [];
    const data = folder.map((folder) => ({
      number: folder.number,
      folderName: folder.folderName,
      folderId: folder.id,
      folderDescription: folder.description,
      items: folder.Document?.map((obj)=>({
        id: obj.id,
        fileName: obj.File.filename,
        size: obj.File.size,
        isPublic: obj.isPublic,
        url: `${this.FILE_URL}/${obj.File?.filename}`,

      }))
    }));

    return data;
  }
}
