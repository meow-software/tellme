import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter, ResponseInterceptor } from '@tellme/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes properties not defined in the DTO
      forbidNonWhitelisted: true, // Rejects the request if non-whitelisted properties are present
      transform: true, // Transforms payloads into class instances
      transformOptions: {
        enableImplicitConversion: true, // Enables automatic type conversion
      },
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Tellme Backend listening on port ${port}.`);
}
bootstrap();
