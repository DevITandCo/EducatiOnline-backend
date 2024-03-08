FROM node:20-alpine

# Create a non-root user
RUN addgroup -S nodejs && adduser -S express -G nodejs

WORKDIR /usr/src/app

COPY . .

RUN --mount=type=secret,id=mongodb_uri \
    echo "MONGODB_URI=$(cat /run/secrets/mongodb_uri)" >> .env.production

RUN --mount=type=secret,id=mail_user \
    echo "MAIL_USER=$(cat /run/secrets/mail_user)" >> .env.production
    
RUN --mount=type=secret,id=mail_pass \
    echo "MAIL_PASS=$(cat /run/secrets/mail_pass)" >> .env.production
    
RUN --mount=type=secret,id=mail_proxy \
    echo "MAIL_PROXY=$(cat /run/secrets/mail_proxy)" >> .env.production


RUN chown -R express:nodejs /usr/src/app    



RUN npm install

EXPOSE 3000 465

#ENV MONGODB_URI=mongodb+srv://admin:HPvzCfgcWT1K0XuA@cluster.ukkr5pz.mongodb.net/?retryWrites=true&w=majority

# Switch to the non-root user before running the app
USER express

CMD ["npm", "run", "dev"]
