FROM node:12.13-alpine

RUN \
mkdir -p /usr/src/app/node_modules && \
mkdir -p /usr/src/app/media/{avatar,pipeline,public} && \
chown -R node:node /usr/src/app

USER node

WORKDIR /usr/src/app

COPY package*.json ./

VOLUME ["/usr/src/app/media"]

RUN npm install --registry https://registry.npm.taobao.org

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run start:prod"]