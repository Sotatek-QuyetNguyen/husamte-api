import { Body, Controller, Delete, Get, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReqUser } from "src/share/common/decorators";
import { Payload } from "../auth";
import { AdminGuard } from "../auth/guards/admin.guard";
import { CreatePrimaryContactDTO, CreatePropertyDTO, DeleteOnePeropertyDTO, GetListPropertyDTO, GetOnePropertyDTO, GetPrimaryContactDTO, UpdateOwnerDTO, UpdatePrimaryContactDTO, UpdatePropertyDTO } from "./property.dto";
import { PropertyService } from "./property.service";
import { ResponseUtils } from "src/share/utils/response.utils";

@Controller('property')
@ApiTags('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }

  @Post()
  @ApiOperation({ summary: `Create property` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async create(
    @ReqUser() user: Payload,
    @Body() body: CreatePropertyDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.createProperty(body, Number(user.userId)));
  }

  @Put()
  @ApiOperation({ summary: `Update property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async update(
    @Body() body: UpdatePropertyDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.updateProperty(body));
  }

  @Get()
  @ApiOperation({ summary: `Get property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async get(
    @Query() params: GetOnePropertyDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.getProperty(params.id));
  }

  @Get('/all')
  @ApiOperation({ summary: `Get list property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async getList(
    @Query() params: GetListPropertyDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.getListProperty(params));
  }

  @Delete()
  @ApiOperation({ summary: `Delete property profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async delete(
    @Query() params: DeleteOnePeropertyDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.deleteProperty(params.id));
  }

  @Put('owner')
  @ApiOperation({ summary: `Update owner profile` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async updateOwner(
    @Body() body: UpdateOwnerDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.updateOwner(body));
  }

  @Get('primary-contact')
  @ApiOperation({ summary: `Get primary contact` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async getPrimaryContact(
    @Query() params: GetPrimaryContactDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.getPrimaryContact(params.id));
  }

  @Post('primary-contact')
  @ApiOperation({ summary: `Create primary contact for SPV` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async createPrimaryContact(
    @Body() body: CreatePrimaryContactDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.createPrimaryContact(body));
  }

  @Put('primary-contact')
  @ApiOperation({ summary: `Update primary contact` })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async updatePrimaryContact(
    @Body() body: UpdatePrimaryContactDTO
  ): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.updatePrimaryContact(body));
  }

  /* Create document
  @Param: folder_number, id, remove_document, folder_name, description_folder, description_file, remove_forder, description_file_update
  @Return: success
  */
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('document')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folderNumber: {
          type: 'array',
          items: { type: 'number', format: 'number' },
        },
        id: { type: 'number' },
        removeDocument: {
          type: 'array',
          items: { type: 'number', format: 'number' },
        },
        folderName: {
          type: 'array',
          items: { type: 'string', format: 'string' },
        },
        descriptionFolder: {
          type: 'array',
          items: { type: 'string', format: 'string' },
        },
        descriptionFile: {
          type: 'array',
          items: { type: 'string', format: 'string' },
        },
        removeForder: {
          type: 'array',
          items: { type: 'string', format: 'string' },
        },
        documentIds: {
          type: 'array',
          items: { type: 'number', format: 'number' },
        },
        descriptionFileUpdate: {
          type: 'array',
          items: { type: 'string', format: 'string' },
        },
        isPublicDocument: {
          type: 'array',
          items: { type: 'number', format: 'number' },
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  public async uploadDocument(
    @UploadedFiles() files,
    @Body('folderNumber') folderNumber,
    @Body('id') id,
    @Body('removeDocument') removeDocument,
    @Body('folderName') folderName,
    @Body('descriptionFolder') descriptionFolder,
    @Body('descriptionFile') descriptionFile,
    @Body('removeForder') removeForder,
    @Body('documentIds') documentIds,
    @Body('descriptionFileUpdate') descriptionFileUpdate,
    @Body('isPublicDocument') isPublicDocument,

    //@Body() updateFile: UpdateDocumentDTO,
    @ReqUser() user: Payload,
  ) :Promise<any>{
    console.log('abbbb', files);

    return this.propertyService.uploadDocument(
      files,
      folderNumber,
      id,
      removeDocument,
      folderName,
      user.userId,
      descriptionFolder,
      descriptionFile,
      removeForder,
      documentIds,
      descriptionFileUpdate,
      isPublicDocument,
    );
  }

    /* Get list document of asset
  @Param: id
  @Return: list document
  */
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('documents/:id')
  public async getDocuments( @Query() params: GetOnePropertyDTO): Promise<any> {
    return ResponseUtils.buildSuccessResponse(await this.propertyService.getDocuments(params.id));
  }
}