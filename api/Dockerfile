FROM node:17-alpine

RUN npm install -g nodemon

RUN apk add texlive

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000
# required for docker desktop port mapping

CMD ["npm", "run", "dev"]
