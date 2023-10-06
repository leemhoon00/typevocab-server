FROM --platform=linux/amd64 node

# Create app directory

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app
RUN npm install

# Expose port
EXPOSE 3000

RUN npx prisma generate
RUN npm run build

# Run app
CMD ["npm", "run" ,"start:dev"]
