FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose your specific port
EXPOSE 5000

# Start command
CMD ["npm", "run", "start"]