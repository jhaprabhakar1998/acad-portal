FROM node:18-slim

WORKDIR /usr/src/app

COPY . ./

## Check node and npm versions before building the image 
RUN node --version
RUN npm --version

RUN npm cache clean --force
RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]
