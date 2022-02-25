FROM node:16
WORKDIR /usr/src/clean-code-node-api
COPY ./package.json . 
RUN npm install --only=prod