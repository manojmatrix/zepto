FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files (routes, controllers, etc.)
COPY . .

# Expose your specific port
EXPOSE 8000

# Start command
CMD ["node", "server.js"]