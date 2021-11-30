FROM node

WORKDIR /usr/src/vueblog-server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8700
CMD [ "node", "app.js" ]