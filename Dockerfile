FROM --platform=linux/amd64 node as build

RUN mkdir /app
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY . /app
RUN npm install
RUN npx prisma generate
RUN npm run build
RUN rm -rf node_modules
RUN npm install --production

# Path: Dockerfile
FROM --platform=linux/amd64 ubuntu

RUN apt-get update && apt-get install -y
RUN apt-get install nodejs -y

RUN mkdir /app
WORKDIR /app

COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules

EXPOSE 3000

CMD ["node", "dist/main"]
