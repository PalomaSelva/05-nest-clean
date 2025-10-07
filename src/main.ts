import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API NestJS - Sistema de Contas')
    .setDescription('Documentação da API para criação e gerenciamento de contas de usuários')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.use(
    '/reference',
    apiReference({
      content: document,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT ?? 3000}`);
  console.log(`📚 Swagger UI disponível em: http://localhost:${process.env.PORT ?? 3000}/api`);
  console.log(`✨ Scalar disponível em: http://localhost:${process.env.PORT ?? 3000}/reference`);
}
bootstrap();
