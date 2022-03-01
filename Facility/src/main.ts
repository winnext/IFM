import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/exceptionFilters/exception.filter';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';


async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule,{abortOnError:false});
    const config = new DocumentBuilder()
    .setTitle('Facility Microservice Endpoints')
    .setDescription('Facility Transactions')
    .setVersion('1.0')
    .addTag('facility')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
     app.useGlobalPipes(
       new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted:true
       }),
       
     );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.enableCors();
    await app.listen(3001);
  } catch (error) {
    console.log(error)
  }
 
 
}
bootstrap();
