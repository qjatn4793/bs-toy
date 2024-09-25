FROM openjdk:17 AS backend
COPY backend/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8888
CMD ["java", "-jar", "app.jar"]

FROM node:16 AS frontend
WORKDIR /app
COPY front/package*.json ./
RUN npm install
COPY front/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=frontend /app/build /usr/share/nginx/html
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=backend /app.jar /usr/src/app/app.jar
CMD ["nginx", "-g", "daemon off;"]