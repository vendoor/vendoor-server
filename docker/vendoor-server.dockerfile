FROM node:12-alpine3.10

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "serve"]
