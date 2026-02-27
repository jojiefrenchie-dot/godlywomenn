FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production && npm install -g npm@latest

# Copy backend source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8000

# Start application
CMD ["npm", "start"]
