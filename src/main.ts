import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { ValidationExceptionFilter } from './share/common/filters/exceptions.filter';
import { modifyException } from './share/utils/error.ultis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      return new BadRequestException(modifyException(errors));
    },
  }));
  app.useGlobalFilters(new ValidationExceptionFilter())

  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const config = new DocumentBuilder()
    .setTitle('Husmate API')
    .setDescription('Husmate API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, document);
  const PORT = parseInt(
    process.env.PORT || '4156',
    10,
  );
  console.log('listen at port: ', PORT);
  await app.listen(PORT);
}
bootstrap();
