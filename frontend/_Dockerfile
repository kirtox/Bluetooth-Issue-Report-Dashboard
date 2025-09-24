FROM node:20 AS build
WORKDIR /app

# Copy package files to avoid copy node_modules folder
COPY package*.json ./

# Install dependencies (Be able to build correctly Linux node_modules)
RUN npm install

# Then, let's copy other codes
COPY . .

# Make sure tsc has execution permissions (safety check)
RUN chmod +x node_modules/.bin/tsc

# Build frontend
RUN npm run build

# Finally, use lighter image to serve (choose nginx) 
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
