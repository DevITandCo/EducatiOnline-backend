FROM node:20-alpine

# Create a non-root user
RUN addgroup -S nodejs && adduser -S express -G nodejs

# Set the working directory for the app
WORKDIR /usr/src/app

# Give ownership of the working directory to the non-root user
RUN chown -R express:nodejs /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install --omit=dev --ignore-scripts

# Copy the entire source code
COPY . .

# Expose the required ports
EXPOSE 3000

# Switch to the non-root user before running the app
USER express

# Run the Node.js app
CMD ["node", "app.ts"]
#test
