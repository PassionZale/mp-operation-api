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

  // 全局路由前缀，暂时定义为 /v1
  // 若部分 api 需要升级，GlobalPrefix 应该被移除
  // 版本号应写在每个 Controller 注解中，例如：@Controller('v1/auth')
  app.setGlobalPrefix('v1');

  // avatar folder static serve
  app.use(
    '/media/avatar',
    serveStatic(path.join(__dirname, '../media/avatar/'), {
      maxAge: '1d',
    }),
  );

  // public folder static serve
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

  // Swagger Api Docs
  // Emmm... 注解还没时间写
  if (process.env.NODE_ENV === 'development') {
    const options = new DocumentBuilder()
      .setTitle(`${appConfig.name}`)
      .setDescription('The Operator API description')
      .setVersion('1.0')
      .addTag('operator')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/document', app, document);
  }

  app.enableCors({
    origin: /lovchun\.com$/,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  })

  // 非开发模式，固定端口为 3000
  // 此处的 3000 对应 Dockerfile 中 EXPOSE 的端口号，两者必须相同
  // 请不要随意修改
  await app.listen(
    process.env.NODE_ENV === 'development' ? appConfig.port : 3000,
  );
}

bootstrap();
