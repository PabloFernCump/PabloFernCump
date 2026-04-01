# Usamos Node.js versión 20
FROM node:20-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos archivos de configuración de npm
COPY package*.json ./

# Instalamos las librerías (incluyendo ics, nodemailer, stripe, etc.)
RUN npm install

# Copiamos el resto de tu código
COPY . .

# Exponemos el puerto 3000
EXPOSE 3000

# Comando para arrancar en modo desarrollo
CMD ["npm", "run", "dev"]