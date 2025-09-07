import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PING, PONG } from '@tellme/core';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(PING) 
  console.log(PONG)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
