FROM node:12.13-alpine

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

USER node

RUN npm install --registry https://registry.npm.taobao.org

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run start:prod"]