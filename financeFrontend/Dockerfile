# ----- Stage 1: The "Builder" Stage ----

# Start with a Node.js image to build our React app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app


# This is for the Arg part in the docker-compose
ARG VITE_API_BASE_URL

# Create an environment variable inside the container from that argument
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# Copy the package.json and package-lock.json files
COPY package*.json ./


# Install the dependencies
RUN npm install


# Copy the rest of the application source code
COPY . .

# Run the build script to create the optimized static files
# This creates a 'dist' folder with our index.html, JS, and CSS Files
RUN npm run build

# ---- Stage 2: The "Server" Stage ---
# Start fresh with a small, official Nginx image

FROM nginx:stable-alpine

# Copy the Nginx configuration file we created 
# This tells Nginx how to serve our app
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the "builder" stage.
# We copy the contents for the 'dist' folder into Nginx's default web root
COPY --from=builder /app/dist /usr/share/nginx/html


# Expose port 80, which is what Nginx listens on by default
EXPOSE 80

# The default Nginx command will start the server automatically, so we don't need a CMD.