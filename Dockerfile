# Etapa 1: Construcción del proyecto Angular
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Servir la app con Nginx
FROM nginx:alpine

# Copiar los archivos del build a Nginx
COPY --from=builder /app/dist/renta-facil-web-app/browser /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
