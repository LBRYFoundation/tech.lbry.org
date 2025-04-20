FROM node:22

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --force
 
COPY . .

EXPOSE 8080

CMD [ "npm", "start", "--force" ]