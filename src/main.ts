import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Start a Redis microservice
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
  },
});

   // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('My API') // API title
    .setDescription('API documentation for My NestJS App') // description
    .setVersion('1.0') // version
    .addBearerAuth() // optional: adds Bearer token authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // /api path serves Swagger UI

  
  app.useGlobalPipes(new ValidationPipe({whitelist: true}))
  app.setGlobalPrefix('api/v1')
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
