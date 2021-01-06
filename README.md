# MP-OPERATION-API

小程序运营 API Server

## 本地运行
```bash
# 1. 制作本地环境配置文件
cp .env.sample .env

# 2. 安装依赖
npm ci

# 3. 运行项目
npm run start:dev

# 4. 迁移数据库
npm run typeorm:migrate
```

## 容器运行
```bash
# 1. 进入跟目录
cd mp-operation-api/

# 2. 制作镜像
docker build -t api .

# 3. 运行容器
docker run -itd --name api -p 3000:3000 api

# 4. 执行迁移
docker exec -it api npm run typeorm:migrate
```

## 生产部署
```bash
docker run 
  -itd \
  --name api \
  -p 3000:3000 \
  -v ${YOUR_VOLUME_DIR_PATH}:/usr/src/app/media \
  --env-file ${YOUR_PRODUCTION_ENV_FILE_PATH} \
  --link mysql:mysql \ # 如果依赖 database container
  api
```
## 依赖说明

### CONFIG
```bash
npm install --save @nestjs/config @hapi/joi
npm install --save-dev @types/hapi__joi
```

### DATABASE
```bash
npm install --save @nestjs/typeorm typeorm mysql
```

### AUTH
```bash
npm install --save @nestjs/passport @nestjs/jwt passport passport-jwt bcryptjs
npm install --save-dev @types/passport-jwt @types/jsonwebtoken @types/bcryptjs
```

### UPLOAD
```bash
npm install --save multer mkdirp uuid
npm install --save-dev @types/multer @types/mkdirp @types/uuid
```

### VALIDATE
```bash
npm install --save class-transformer class-validator
```

### HELP
```bash
npm install --save moment-timezone
```

### API DOCUMENT
```bash
npm install --save @nestjs/swagger swagger-ui-express
```