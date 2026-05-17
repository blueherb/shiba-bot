  FROM node:20-alpine

  RUN apk add --no-cache tzdata && \
      ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
      echo "Asia/Seoul" > /etc/timezone

  WORKDIR /app

  COPY package*.json ./
  RUN npm ci --omit=dev

  COPY . .

  CMD ["node", "index.js"]