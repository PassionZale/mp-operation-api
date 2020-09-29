# api

## 初始化

```bash
cp .env.sample .env
```

## 运行
```bash
npm install

npm run start:dev

# 初始化数据库迁移
npm run typeorm:migrate
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