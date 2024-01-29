# Usa una imagen base de Node.js
FROM node:20-alpine


# Create a non-root user
RUN addgroup -S nodejs && adduser -S express -G nodejs


# Establece el directorio de trabajo en la aplicación
WORKDIR /usr/src/app

# Give ownership of the working directory to the non-root user
RUN chown -R express:nodejs /usr/src/app

# Copia los archivos de la aplicación al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Expón el puerto en el que la aplicación ejecuta
EXPOSE 3000

# Switch to the non-root user before running the app
USER express

# Ejecuta la aplicación al iniciar el contenedor
CMD ["npm", "run", "dev"]

