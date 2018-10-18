FROM node:8.9.0

# RUN MKDIR -P /usr/src/musicroom
RUN echo "deb http://deb.debian.org/debian stretch main" >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y vim htop net-tools build-essential libsodium-dev
WORKDIR /usr/src/musicroom
RUN npm install nodemon -g

COPY package*.json ./
# If you are building your code for production
# RUN npm install --only=production

# COPY . .
ADD . .
EXPOSE 4242
CMD [ "nodemon", "-L" ]