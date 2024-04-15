FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY . .

RUN npm i -g npm@latest
RUN npm ci
RUN echo "Completed install step successfully" 

RUN npm run build
RUN echo "Completed build step successfully" 

EXPOSE 4000

CMD [ "npm", "run", "start" ]  
