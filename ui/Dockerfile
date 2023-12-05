FROM node:18

EXPOSE 5173

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

CMD ["npm", "run", "dev"]