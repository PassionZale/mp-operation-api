# api

## 初始化

```bash
cp .env.sample .env
```

## 运行
```bash
npm run start:dev
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
npm install --save multer mkdirp
npm install --save-dev @types/multer @types/mkdirp
```

### VALIDATE
```bash
npm install --save class-transformer class-validator
```

### HELP
```bash
npm install --save moment-timezone
```