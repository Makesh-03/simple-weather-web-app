# -----------------------------
# Stage 1: Build React App
# -----------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the production app
RUN npm run build


# -----------------------------
# Stage 2: Serve with Nginx
# -----------------------------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config as a TEMPLATE so the nginx image's entrypoint
# will run envsubst on it (substituting ${BACKEND_HOST}) and write the
# result into /etc/nginx/conf.d/default.conf at container start.
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Only substitute this one variable; leave all other $vars (like $host,
# $remote_addr) alone so nginx itself can interpolate them.
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
ENV NGINX_ENVSUBST_FILTER='^BACKEND_HOST$'
ENV BACKEND_HOST=localhost

# Copy build output to nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
