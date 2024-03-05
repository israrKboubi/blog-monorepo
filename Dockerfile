FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

ENV BACKHOST=https://dockerhub-israr-blog.onrender.com

ENV ORIGIN=https://blog-israr-bo.netlify.app/

ENV EMAILPASS="wnzh wmnp ulif vguj"

ENV PASSBASE=""

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
