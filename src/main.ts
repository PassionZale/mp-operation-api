import { NestFactory } from '@nestjs/core';
import { ValidationError } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as serveStatic from 'serve-static';
import * as path from 'path';
import * as moment from 'moment-timezone';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { ApiValidationPipe } from './pipe/api-validation.pipe';
import { ApiException } from './filter/api-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { AnyExceptionFilter } from './filter/any-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { updateOrmConfigFileSync } from './common/helper/typeorm.hepler';
import { TypeormConfigService } from './config/typeorm/config.service';

/**
 * 设置默认时区为东八区
 * 所有涉及时间获取及输出，统一使用 moment-timezone
 */
moment.tz.setDefault('Asia/Shanghai');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局路由前缀
  app.setGlobalPrefix('api');

  // avatar static serve
  app.use(
    '/media/avatar',
    serveStatic(path.join(__dirname, '../media/avatar/'), {
      maxAge: '1d',
    }),
  );

  // public static serve
  app.use(
    '/media/public',
    serveStatic(path.join(__dirname, '../media/public/'), {
      maxAge: '1d',
    }),
  );

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

  // TypeormConfig
  const typeormConfig: TypeormConfigService = app.get(TypeormConfigService);
  // AppConfig
  const appConfig: AppConfigService = app.get(AppConfigService);

  // 初始化 ormconfig.json
  updateOrmConfigFileSync(typeormConfig.configs);

  // swagger
  // TODO swagger 注解
  if (appConfig.env === 'development') {
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
