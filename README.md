![Version](https://img.shields.io/badge/Version-1.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![runs with nodeJs](https://img.shields.io/badge/Runs%20with%20Node.Js-000.svg?style=flat-square&logo=nodedotjs&labelColor=f3f3f3&logoColor=#3C823B)](https://nodejs.org/ru)
[![runs with TS](https://img.shields.io/badge/Runs%20with%20Typescript-000.svg?style=flat-square&logo=typescript&labelColor=f3f3f3&logoColor=#3178C6)](https://www.typescriptlang.org/)
[![runs with NestJS](https://img.shields.io/badge/Runs%20with%20NestJs-000.svg?style=flat-square&logo=nestjs&labelColor=f3f3f3&logoColor=red)](https://nestjs.com/)
[![runs with swagger](https://img.shields.io/badge/Runs%20with%20Swagger-000.svg?style=flat-square&logo=swagger&labelColor=f3f3f3&logoColor=#85EA2D)](https://swagger.io/)
[![runs with PassportJs](https://img.shields.io/badge/Runs%20with%20PassportJs-000.svg?style=flat-square&logo=Passport&labelColor=f3f3f3&logoColor=35DF79)](https://www.passportjs.org/)
[![runs with OpenAI](https://img.shields.io/badge/Runs%20with%20OpenAI-000.svg?style=flat-square&logo=OpenAI&labelColor=f3f3f3&logoColor=412991)](https://openai.com/index/openai-api/)
[![runs with NewsAPI](https://img.shields.io/badge/Runs%20with%20NewsAPI-000.svg?style=flat-square&logo=linear&labelColor=f3f3f3&logoColor=242424)](https://newsapi.org/)
[![runs with Prisma](https://img.shields.io/badge/Runs%20with%20Prisma-000.svg?style=flat-square&logo=prisma&labelColor=f3f3f3&logoColor=2D3748)](https://www.prisma.io/)
[![runs with Docker](https://img.shields.io/badge/Runs%20with%20Docker-000.svg?style=flat-square&logo=docker&labelColor=f3f3f3&logoColor=2496ED)](https://www.docker.com/)

# Trend Blend Genius REST API

**Project Description:**

This project is a server application designed for creating news content and publishing it to various social media platforms, such as Facebook, LinkedIn, and Twitter. The server leverages OpenAI for generating news articles and News API for retrieving current news and information..

![Trend Blend Genius](/media/about.jpg)

**Main Technologies:**

-   Nest.js: Nest.js is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It simplifies the development process by offering a comprehensive set of tools and features to handle routing, middleware, and HTTP requests. Nest.js leverages TypeScript to bring strong typing and enhanced developer experience, while also providing architectural patterns such as dependency injection for building maintainable and testable codebases.
-   TypeScript: TypeScript brings strong typing and enhanced developer experience to Nest.js. It helps in building maintainable and testable codebases, offering benefits such as improved code navigation, refactoring support, and type checking during development.
-   Swagger-ui-express: Swagger UI Express is used to generate interactive API documentation. It provides a user-friendly interface for developers to understand and test the available API endpoints.
-   OpenAI: OpenAI provides advanced AI capabilities for generating high-quality news content. By leveraging OpenAI's natural language processing, the server can create engaging and relevant news articles based on current events and trends, customized for different audiences and social media platforms.
-   NewsAPI: NewsAPI is integrated to fetch the latest news from various sources. It allows the server to retrieve and filter news content based on keywords, categories, and regions, ensuring that the generated news articles are up-to-date and relevant.
-   Prisma: Prisma is used as an ORM (Object-Relational Mapping) tool for interacting with the PostgreSQL database. It simplifies database access by providing type-safe queries and migrations, making it easier to manage and manipulate data within the application.
-   PassportStrategy (@nestjs/passport): PassportStrategy is used for implementing authentication strategies in the Nest.js application. It provides a flexible and modular way to handle user authentication, supporting various strategies such as JWT (JSON Web Tokens) to secure the API endpoints and manage user sessions effectively.
-   Docker: Docker is used to containerize the application, ensuring consistent environments across development, testing, and production. It simplifies the deployment process by packaging the application and its dependencies into a single container, which can be easily deployed and scaled across different platforms and cloud providers.

<!-- ![Trend Blend Genius](/media/rest-api.gif) -->

## Technologies Used

    typescript
    nestJS
    swagger
    openAI
    newsAPI
    prisma
    nestjs/passport

## Project structure


```sh
.
├── dist
│   ├── libs
│   │   └── common
│   │       └── src
│   │           ├── decorators
│   │           │   ├── cookies.decorator.d.ts
│   │           │   ├── cookies.decorator.js
│   │           │   ├── cookies.decorator.js.map
│   │           │   ├── current-user.decorator.d.ts
│   │           │   ├── current-user.decorator.js
│   │           │   ├── current-user.decorator.js.map
│   │           │   ├── index.d.ts
│   │           │   ├── index.js
│   │           │   ├── index.js.map
│   │           │   ├── isPasswordsMatchingConstraint.d.ts
│   │           │   ├── isPasswordsMatchingConstraint.js
│   │           │   ├── isPasswordsMatchingConstraint.js.map
│   │           │   ├── isPublic.decorator.d.ts
│   │           │   ├── isPublic.decorator.js
│   │           │   ├── isPublic.decorator.js.map
│   │           │   ├── roles.decorator.d.ts
│   │           │   ├── roles.decorator.js
│   │           │   ├── roles.decorator.js.map
│   │           │   ├── user-agent.decorator.js
│   │           │   └── user-agent.decorator.js.map
│   │           ├── services
│   │           │   ├── newsService
│   │           │   │   ├── newsService.module.d.ts
│   │           │   │   ├── newsService.module.js
│   │           │   │   ├── newsService.module.js.map
│   │           │   │   ├── newsService.service.d.ts
│   │           │   │   ├── newsService.service.js
│   │           │   │   └── newsService.service.js.map
│   │           │   └── openaiService
│   │           │       ├── openaiService.module.d.ts
│   │           │       ├── openaiService.module.js
│   │           │       ├── openaiService.module.js.map
│   │           │       ├── openaiService.service.d.ts
│   │           │       ├── openaiService.service.js
│   │           │       └── openaiService.service.js.map
│   │           ├── utils
│   │           │   ├── convert-to-seconds.d.ts
│   │           │   ├── convert-to-seconds.js
│   │           │   ├── convert-to-seconds.js.map
│   │           │   ├── index.d.ts
│   │           │   ├── index.js
│   │           │   ├── index.js.map
│   │           │   ├── transform-user.d.ts
│   │           │   ├── transform-user.js
│   │           │   └── transform-user.js.map
│   │           ├── constants.d.ts
│   │           ├── constants.js
│   │           └── constants.js.map          
│   ├── src
│   │   ├── entities
│   │   │   ├── articles
│   │   │   │   ├── dto
│   │   │   │   │   ├── articleConfig.dto.d.ts
│   │   │   │   │   ├── articleConfig.dto.js
│   │   │   │   │   ├── articleConfig.dto.js.map1
│   │   │   │   │   ├── createAtrticle.dto.d.ts
│   │   │   │   │   ├── createAtrticle.dto.js
│   │   │   │   │   ├── createAtrticle.dto.js.map
│   │   │   │   │   ├── index.d.ts
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── index.js.map
│   │   │   │   │   ├── newsapiArticle.dto.d.ts
│   │   │   │   │   ├── newsapiArticle.dto.js
│   │   │   │   │   └── newsapiArticle.dto.js.map
│   │   │   │   ├── entities
│   │   │   │   │   ├── articles.entity.d.ts
│   │   │   │   │   ├── articles.entity.js
│   │   │   │   │   └── articles.entity.js.map
│   │   │   │   ├── articles.controller.d.ts
│   │   │   │   ├── articles.controller.js
│   │   │   │   ├── articles.controller.js.map
│   │   │   │   ├── articles.module.d.ts
│   │   │   │   ├── articles.module.js
│   │   │   │   ├── articles.module.js.map
│   │   │   │   ├── articles.service.d.ts
│   │   │   │   ├── articles.service.js
│   │   │   │   └── articles.service.js.map
│   │   │   ├── auth
│   │   │   │    ├── config
│   │   │   │    │   ├── index.d.ts
│   │   │   │    │   ├── index.js
│   │   │   │    │   ├── index.js.map
│   │   │   │    │   ├── wt-module-async-options.d.ts
│   │   │   │    │   ├── jwt-module-async-options.js
│   │   │   │    │   └── jwt-module-async-options.js.map
│   │   │   │    ├── dto
│   │   │   │    │   ├── index.d.ts
│   │   │   │    │   ├── index.js
│   │   │   │    │   ├── index.js.map
│   │   │   │    │   ├── login.dto.d.ts
│   │   │   │    │   ├── login.dto.js
│   │   │   │    │   ├── login.dto.js.map
│   │   │   │    │   ├── register.dto.d.ts
│   │   │   │    │   ├── register.dto.js
│   │   │   │    │   └── register.dto.js.map
│   │   │   │    ├── entities
│   │   │   │    │   ├── auth.entity.d.ts
│   │   │   │    │   ├── auth.entity.js
│   │   │   │    │   └── auth.entity.js.map
│   │   │   │    ├── auth.controller.d.ts
│   │   │   │    ├── auth.controller.js
│   │   │   │    ├── auth.controller.js.map
│   │   │   │    ├── auth.module.d.ts
│   │   │   │    ├── auth.service.js
│   │   │   │    ├── auth.module.js.map
│   │   │   │    ├── auth.service.d.ts
│   │   │   │    ├── articles.service.js
│   │   │   │    ├── auth.service.js
│   │   │   │    ├── articles.service.js
│   │   │   │    ├── auth.service.js.map
│   │   │   │    ├── interfaces.d.ts
│   │   │   │    ├── interfaces.js
│   │   │   │    └── interfaces.js.map
│   │   │   └── users
│   │   │       ├── responses
│   │   │       │   ├── index.d.ts
│   │   │       │   ├── index.js
│   │   │       │   ├── index.js.map
│   │   │       │   ├── user.response.d.ts
│   │   │       │   ├── user.response.js
│   │   │       │   └── user.response.js.map
│   │   │       ├── users.controller.d.ts
│   │   │       ├── users.controller.js
│   │   │       ├── users.controller.js.map
│   │   │       ├── users.module.d.ts
│   │   │       ├── users.module.js
│   │   │       ├── users.module.js.map
│   │   │       ├── users.service.d.ts
│   │   │       ├── users.service.js
│   │   │       └── users.service.js.map
│   │   ├── guards
│   │   │   ├── index.d.ts
│   │   │   ├── index.js
│   │   │   ├── index.js.map
│   │   │   ├── jwt-auth.guard.d.ts
│   │   │   ├── jwt-auth.guard.js
│   │   │   ├── jwt-auth.guard.js.map
│   │   │   ├── role.guard.d.ts
│   │   │   ├── role.guard.js
│   │   │   └── role.guard.js.map
│   │   ├── middleware
│   │   │   ├── system
│   │   │   │   ├── corsMiddleware.middleware.d.ts
│   │   │   │   ├── corsMiddleware.middleware.js
│   │   │   │   ├── corsMiddleware.middleware.js.map
│   │   │   │   ├── index.d.ts
│   │   │   │   ├── index.js
│   │   │   │   ├── index.js.map
│   │   │   │   ├── logger.middleware.d.ts
│   │   │   │   ├── logger.middleware.js
│   │   │   │   └── logger.middleware.js.map
│   │   │   ├── index.d.ts
│   │   │   ├── index.js
│   │   │   └── index.js.map
│   │   ├── prisma
│   │   │   ├── prisma.module.d.ts
│   │   │   ├── prisma.module.js
│   │   │   ├── prisma.module.js.map
│   │   │   ├── prisma.service.d.ts
│   │   │   ├── prisma.service.js
│   │   │   └── prisma.service.js.map
│   │   ├── strategies
│   │   │   ├── index.d.ts
│   │   │   ├── index.js
│   │   │   ├── index.js.map
│   │   │   ├── jwt.strategy.d.ts
│   │   │   ├── jwt.strategy.js
│   │   │   └── jwt.strategy.js.map
│   │   ├── app.module.d.ts
│   │   ├── app.module.js
│   │   ├── app.module.js.map
│   │   ├── main.d.ts
│   │   ├── main.js
│   │   └── main.js.map
│   ├── package.json
│   └── tsconfig.build.tsbuildinfo
│   
├── docker
│   └── postgres
│       ├── pgadmin
│       │   └── Dockerfile
│       ├── postgres
│       │   ├── Dockerfile
│       │   └── install-uuid.sql
│       ├── .env
│       ├── .env.example
│       ├── docker-compose_short.yml
│       └── docker-compose.yml
│   
├── libs
│   └── common
│       ├── src
│       │   ├── decorators
│       │   │   ├── cookies.decorator.ts
│       │   │   ├── current-user.decorator.ts
│       │   │   ├── index.ts
│       │   │   ├── isPasswordsMatchingConstraint.ts
│       │   │   ├── isPublic.decorator.ts
│       │   │   ├── roles.decorator.ts
│       │   │   └── user-agent.decorator.ts
│       │   ├── services
│       │   │   ├── newsService
│       │   │   │   ├── newsService.module.ts
│       │   │   │   └── newsService.service.ts
│       │   │   └── openaiService
│       │   │       ├── openaiService.module.ts
│       │   │       └── openaiService.service.ts
│       │   ├── utils
│       │   │   ├── convert-to-seconds.ts
│       │   │   ├── index.ts
│       │   │   └── transform-user.ts
│       │   └── constants.ts
│       └── tsconfig.lib.json
│   
├── media
│   └── about.jpg
│   
├── prisma
│   ├── migrations
│   └── schema.prisma
│ 
├── secrets
│   ├── cert.pem
│   ├── create-ca-key.pem
│   ├── create-ca.pem
│   ├── create-cert-key.pem
│   ├── create-cert.pem
│   └── key.pem
│  
├── src
│   ├── entities
│   │   ├── articles
│   │   │   ├── dto
│   │   │   │   ├── articleConfig.dto.ts
│   │   │   │   ├── createAtrticle.dto.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── newsapiArticle.dto.ts
│   │   │   ├── entities
│   │   │   │   └── articles.entity.ts
│   │   │   ├── articles.controller.ts
│   │   │   ├── articles.module.ts
│   │   │   └── articles.service.ts
│   │   ├── auth
│   │   │   ├── config
│   │   │   │   ├── index.ts
│   │   │   │   └── jwt-module-async-options.ts
│   │   │   ├── dto
│   │   │   │   ├── index.ts
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── entities
│   │   │   │   └── auth.entity.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   └── interfaces.ts
│   │   └── users
│   │       ├── responses
│   │       │   ├── index.ts
│   │       │   └── user.response.ts
│   │       ├── users.controller.ts
│   │       ├── users.module.ts
│   │       └── users.service.ts
│   ├── guards
│   │   ├── index.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── role.guard.ts
│   ├── middleware
│   │   ├── system
│   │   │   ├── corsMiddleware.middleware.ts
│   │   │   ├── index.ts
│   │   │   └── logger.middleware.ts
│   │   └── index.ts
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── strategies
│   │   ├── index.ts
│   │   └── jwt.strategy.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts
│   └── main.ts
│  
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│  
├── .env
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json

```

<!--
```sh
.
├── src
│   ├── authorization
│   │   ├── api-key.strategy.ts
│   │   └── authorization.module.ts
│   ├── instagram
│   │   ├── dto
│   |   |   └── videoUrlResponse.dto.ts
│   │   ├── entities
│   |   |   └── instagram.entity.ts
│   │   ├── instagram.controller.spec.ts
│   │   ├── instagram.controller.ts
│   │   ├── instagram.module.ts
│   │   ├── instagram.service.spec.ts
│   │   └── instagram.service.ts
│   ├── middleware
│   |   └── system
│   |       ├── corsMiddleware.middleware.ts
│   |       └── logger.middleware.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .eslintrc.js
├── .prettierrc
├── package.json
├── package-lock.json
├── tsconfig.build.json
├── tsconfig.json
├── nest-cli.json
├── .env
├── .env.example
└── README.md

``` -->

## How to install

### Using Git (recommended)

1.  Clone the project from github. Change "myproject" to your project name.

```bash
git clone https://github.com/Solod-S/trendBlendGenius-backend ./myproject
```

### Using manual download ZIP

1.  Download repository
2.  Uncompress to your desired directory

### Install npm dependencies after installing (Git or manual download)

```bash
cd myproject
npm install
```

### Setting up environments

1.  You will find a file named `.env.example` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
    ```bash
    cp .env.example .env
    ```
3.  The file `.env` is already ignored, so you never commit your credentials.
4.  Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## How to build your own..

1. Set Up Docker: Configure Docker settings or leave them as they are. The configurations are done in docker-compose.yml and .env files.

2. Initialize Prisma: Set up Prisma for your database.

```javascript
  npx prisma init
  npx prisma migrate dev --name init
```

3. First install all dependencies with npm or yarn:

```javascript
npm install
```

or

```javascript
yarn;
```

4. Exemple of `.env` file. Replace values with yours!!

```javascript
PORT=YOUR_PORT;
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/trendBlendGenius_db?schema=public"
JWT_EX=11d
JWT_SECRET=YOUR_SECRET
```

5. Start the server

```javascript
npm run docker:up
npm run start:dev
```

6. Enjoy!!

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please create a pull request. For major changes, please open an issue first to discuss the changes.

**_NOTE: PLEASE LET ME KNOW IF YOU DISCOVERED ANY BUG OR YOU HAVE ANY SUGGESTIONS_**
