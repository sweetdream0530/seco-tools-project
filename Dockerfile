FROM node:18.12.1 as builder

RUN apt-get update && apt-get install bash

WORKDIR /usr/src/app/client

COPY . .

RUN npm i && npm run build


# Nginx setup

FROM nginx:1.22-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /usr/src/app/client/public .

COPY ./default.conf /etc/nginx/conf.d/

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
