FROM node:20-alpine

# Create a non-root user
RUN addgroup -S nodejs && adduser -S express -G nodejs

WORKDIR /usr/src/app

RUN chown -R express:nodejs /usr/src/app

COPY . .

RUN npm install

EXPOSE 8080

ENV MONGODB_URI=mongodb+srv://admin:HPvzCfgcWT1K0XuA@cluster.ukkr5pz.mongodb.net/?retryWrites=true&w=majority

# Switch to the non-root user before running the app
USER express

CMD ["npm", "run", "dev"]

