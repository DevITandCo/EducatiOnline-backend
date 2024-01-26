# Utiliza la imagen oficial de Node.js con la versión que necesitas
FROM node:14-alpine

# Crea un usuario no root
RUN addgroup -S nodejs && adduser -S express -G nodejs

# Establece el directorio de trabajo en /usr/src/app
WORKDIR /usr/src/app

# Copia los archivos necesarios para instalar dependencias
COPY package*.json tsconfig*.json ./

# Instala TypeScript y las dependencias
RUN npm install -g npm@latest typescript && npm install

# Copia el resto del código fuente
COPY . .

# Compila el código TypeScript
RUN tsc

# Cambia al usuario no root antes de ejecutar la aplicación
USER express

# Ejecuta la aplicación
CMD ["node", "dist/app.js"]
