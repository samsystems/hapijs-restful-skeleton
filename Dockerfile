FROM node:alpine
RUN apk add --no-cache curl
RUN npm install -g pm2
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD . .
RUN npm i && npm cache clear --force
EXPOSE 8080
CMD ["npm", "run", "prod"]
