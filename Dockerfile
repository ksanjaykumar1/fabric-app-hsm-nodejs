# FROM node:20-alpine3.16 as base
FROM sitespeedio/node:ubuntu-22.04-nodejs-18.14.2 as base
# From sitespeedio/node:ubuntu-20.04-nodejs-16.16.0 as base
WORKDIR /app

RUN apt-get update && apt-get install -y vim 
RUN apt install python3 -y 
RUN apt install build-essential g++ -y 

RUN apt install softhsm2 -y
RUN apt install libc6 -y
RUN dpkg -l | grep libc6
RUN npm install -g npm
# RUN apt install -y libc6 libc-bin

COPY ["package.json", "package-lock.json","./"]


FROM base as development

RUN npm install pkcs11js
RUN npm install
RUN npm list --depth

COPY ./ .

RUN export SOFTHSM2_CONF=$PWD/softhsm2.conf
RUN softhsm2-util --init-token --slot 0 --label "ForFabric" --pin 98765432 --so-pin 1234

CMD ["npm", "start" ]