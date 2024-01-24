# EDUconline Backend

![Beta](https://img.shields.io/badge/Status-Beta-red)
![node](https://img.shields.io/badge/node-20.x-blue)
![npm](https://img.shields.io/badge/npm-9.8.1-blue)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Mocha](https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)

## General Architecture
![Architecture](/docs/generalArchitecture.png)



## Folder structure

- `app.ts`: Entry point of our application and where we will set up our server.
- `public`: This directory contains the files needed for generating the API documentation through a deployment in a website.
- `lib`: This directory contains the files needed for configure the conexion to the database and other utils.
- `test`: This directory test to check the correct operation of the application.
- `api_server/controllers`: This directory contains the application's controllers, which are responsible for handling user input and updating the model and view accordingly.
- `api_server/middleware`: This folder stores intermediate functionalities that act as middelwares for filtering certain requests.
- `api_server/models`: This directory contains the application's data models, which are responsible for handling data and business logic.
- `api_server/routes`: This directory contains the application's routing files, which map URLs to specific controllers and actions.

## Configuration Files
- `.env.example`: Provides an example configuration of environment variables, guiding developers to set up their local environment by copying this file as .env with specific variable values.
- `mocharc.json `: Configuration file for Mocha, a JavaScript testing framework, specifying options for test execution.
- `.prettierrc.json`: Configuration for Prettier, a code formatting tool, ensuring a consistent and readable code style across the project.
- `env.example`: Configuration of enviroment variables


## Getting Started

### Run for a development environment

First you neeed to install de dependencies

```bash
npm install
```

And then run 

```bash
npm run ci
npm run dev
```

### Run for a production environment

#### Command Line

> **Note**
> this version requires to have port `3000` open on the router.

```bash
npm run ci
npm run build
npm run start
```

#### Docker

Build Docker image:

```bash
docker build -t eduOnlineAPI:latest .
```

Run the container:

```bash
docker run -p 3000:3000 --env-file .env eduOnlineAPI:latest
```
