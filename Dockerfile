FROM oven/bun:1.2.10-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN bun install
 
COPY . .

EXPOSE 8080

CMD [ "bun", "run", "start" ]