import { NestFactory } from '@nestjs/core';
import { ValidationError } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as moment from 'moment-timezone';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { ApiValidationPipe } from './pipe/api-validation.pipe';
import { ApiException } from './filter/api-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { AnyExceptionFilter } from './filter/any-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';

/**
 * 设置默认时区为东八区
 * 所有涉及时间获取及输出，统一使用 moment-timezone
 */
moment.tz.setDefault('Asia/Shanghai');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局路由前缀
  app.setGlobalPrefix('api');

  // 全局管道验证
  app.useGlobalPipes(
    new ApiValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      validationError: { target: false },
      exceptionFactory: (errors: ValidationError[]) =>
        new ApiException(Object.values(errors[0].constraints)[0]),
    }),
  );

  // 全局响应拦截
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局异常拦截
  app.useGlobalFilters(new AnyExceptionFilter(), new HttpExceptionFilter());

  // 读取 appConfig 端口配置项
  const appConfig: AppConfigService = app.get(AppConfigService);

  if(appConfig.env === 'development') {
    const options = new DocumentBuilder()
    .setTitle('Operator API')
    .setDescription('The Operator API description')
    .setVersion('1.0')
    .addTag('operator')
    .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/document', app, document);
  }

  await app.listen(appConfig.port);
}

bootstrap();

