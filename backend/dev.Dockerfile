FROM node:18-slim

WORKDIR /usr/src/app

COPY . ./

RUN npm cache clean --force
RUN npm install
RUN npm run build

CMD ["npm", "run", "local-prod-start"]