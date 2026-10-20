FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install --include=dev

COPY server ./

ENV PORT=5001
ENV HOST=0.0.0.0

EXPOSE 5001

CMD ["npm", "run", "start"]
