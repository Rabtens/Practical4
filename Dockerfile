# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Expose app port (change if needed)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]