/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const cmd = require('node-cmd');
const Client = require('ssh2-sftp-client');
const sftp = new Client();

// dotenv 注入环境变量
const result = require('dotenv').config({
  path: path.resolve(process.cwd(), '.env'),
});

if (result.error) throw result.error;

// 镜像名称
const imageName = process.env.DOTENV_IMAGE_NAME || 'mp-operation-api';
// 镜像归档后的文件名
const imageFileName = `${imageName}.tar`;

// 判断本地是否存在归档文件，如果存在则删除
if (fs.existsSync(path.resolve(process.cwd(), imageFileName))) {
  fs.unlinkSync(path.resolve(process.cwd(), imageFileName));
}

console.log('开始构建镜像...');

// 构建镜像
const dockerBuildImage = cmd.runSync(`docker build -t ${imageName} .`);

if (dockerBuildImage.error) throw dockerBuildImage.error;

console.log(dockerBuildImage.data);

console.log('开始归档镜像...');

// 归档镜像
const dockerArchiveImage = cmd.runSync(
  `docker save ${imageName} > ${imageFileName}`,
);

if (dockerArchiveImage.error) throw dockerArchiveImage.error;

console.log('开始上传镜像...');

// 上传镜像
sftp
  .connect({
    host: process.env.DOTENV_HOST,
    port: process.env.DOTENV_PORT,
    username: process.env.DOTENV_USERNAME,
    password: process.env.DOTENV_PASSWORD,
  })
  .then(() => {
    const data = fs.createReadStream(
      path.resolve(process.cwd(), imageFileName),
    );

    return sftp.put(data, process.env.DOTENV_REMOTE_PATH + imageFileName);
  })
  .then(() => {
    console.log('上传成功');

    return sftp.end();
  })
  .catch(error => {
    throw error;
  });
