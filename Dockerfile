FROM node:20-alpine

# Create a non-root user
RUN addgroup -S nodejs && adduser -S express -G nodejs

WORKDIR /usr/src/app

RUN chown -R express:nodejs /usr/src/app

# Set environment variables during build
ARG MONGODB_URI
ARG MAIL_USER
ARG MAIL_PASS
ARG MAIL_PROXY

ENV MONGODB_URI=$MONGODB_URI \
    MAIL_USER=$MAIL_USER \
    MAIL_PASS=$MAIL_PASS \
    MAIL_PROXY=$MAIL_PROXY

COPY . .

RUN npm install

EXPOSE 3000 465

# Switch to the non-root user before running the app
USER express

CMD ["npm", "run", "dev"]

