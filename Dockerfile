# FROM node:alpine
# COPY . /app
# COPY package*.json /app
# RUN npm install
# EXPOSE 3000
# CMD node app/dist/server.js



# importing the environment
FROM node:15.10.0-alpine3.10




# making working directory inside docker
RUN mkdir /app

# seting the working directory
WORKDIR /app

# copy packahe.json to working diectory
COPY package.json .

# installing all production dependencies in docker
RUN npm install --only=production

# copying all files in current directory to docker working directory
COPY . .

EXPOSE 3000

CMD ["npm","start"]