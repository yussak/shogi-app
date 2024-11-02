FROM node:22

WORKDIR /app

COPY package.json yarn.lock ./
RUN npm install

COPY . .

EXPOSE 5000

# サーバーの起動
CMD ["npx", "ts-node", "src/index.ts"]
