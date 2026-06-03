# Use Node base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy rest of code
COPY . .

# Create a data dir that the persistent volume will mount onto, and make it
# writable by the non-root "node" user.
RUN mkdir -p /data && chown -R node:node /data /app

# Run as the non-root "node" user that ships with the image
USER node

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
