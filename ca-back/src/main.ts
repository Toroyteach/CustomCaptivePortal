import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from './config/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [
      'guestwifi.ca.go.ke',
      'guestwifiadmin.ca.go.ke',
      'guestwifiapi.ca.go.ke',
      'guestwifiregister.ca.go.ke',
      '10.20.120.25',
      '10.20.120.25:5999',
      'http://localhost:4200',
      'http://localhost:3000',
      '*',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await app.listen(config.port);
}
bootstrap();