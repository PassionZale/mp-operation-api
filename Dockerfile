FROM node:12.13-alpine

RUN \
mkdir -p /usr/src/app/node_modules && \
mkdir -p /usr/src/app/media

WORKDIR /usr/src/app

COPY package*.json ./

VOLUME ["/usr/src/app/media"]

RUN npm ci --registry https://registry.npm.taobao.org

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run start:prod"]