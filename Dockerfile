FROM node:14
WORKDIR /usr/src/clean-code-node-api
COPY ./package.json . 
RUN npm install --only=prod