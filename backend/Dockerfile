FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Create media directories
RUN mkdir -p media/articles media/marketplace

# Expose port
EXPOSE 8000

# Start application
CMD ["npm", "start"]
