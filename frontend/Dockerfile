# Use Node.js to build React app
FROM node:18-alpine AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
