FROM node:5

WORKDIR /src

ADD package.json package.json

RUN npm install --silent

ADD . .

EXPOSE 8080

CMD ["npm", "run", "start"]
