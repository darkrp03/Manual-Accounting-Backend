FROM node:18-alpine as build-stage
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm start

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]