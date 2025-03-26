import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from './config/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://guestwifi.ca.go.ke',
        'http://guestwifiadmin.ca.go.ke',
        'http://guestwifiapi.ca.go.ke',
        'http://guestwifiregister.ca.go.ke',
        'http://10.20.120.25',
        'http://10.20.120.25:5999',
        'http://localhost:4200',
        'http://localhost:3000',
        '*'
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With',
  });


  await app.listen(config.port);
}
bootstrap();