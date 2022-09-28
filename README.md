[![Build Status](https://app.travis-ci.com/renatops1991/clean-code-api.svg?token=ZnWiximpccuhiNf9ij9f&branch=production)](https://app.travis-ci.com/renatops1991/clean-code-api)

# Clean Code Node API

This is an API developed during the course "**Rest API NodeJs using TDD, Clean Architecture and Typescript**" by [Rodrigo Manguinho](https://github.com/rmanguinho/), focusing on the development of a decoupled API using the best practices of TDD, Clean Architecture, DDD and Solid.
Outside the course, I used some references like [Clean Code TypeScript](https://github.com/vitorfreitas/clean-code-typescript) for better enjoyment and personal development.

## Routes

### Login API

- [POST] - Create user: `{{host}}/api/signup`
- [POST] - Sign in user: `{{host}}/api/signin`

### Survey API

- [POST] - Create Survey `{{host}}/api/survey`
- [GET] - Search All Surveys `{{host}}/api/surveys`

### Survey Result API

- [PUT] - Save Survey Result `{{host}}/api/surveys/{{survey-id}}/results`
- [GET] - Load Survey Result `{{host}}/api/surveys/{{survey-id}}/results`

## API Docs

Swagger: `{{host}}/api-docs`

## Stack

- Node.js + Typescript
- Express
- Nodemon
- Bcrypt
- JWT(Json Web Token)
- MongoDB
- Design Pattern (Composite, Adapter, Builder and Factory)
- Clean Architecture
- SOLID
- DDD
- TDD


## Docker Local Development
 - npm run start:dev

### Installation

```bash
cp example.env .env
npm install
```

## Watching the application

```bash
tsc -w
```

## Running the Application

```bash
npm run start:dev // using docker

or

npm run build
npm run start // using node
```

<b>Notice: This command is configured with debug in vsCode</b>

## Stopping the Application

```bash
npm run stop:dev //stop docker
```

## Ports is running

- REST: `{{host}}:3003`
- Debug: `{{host}}:9222`

## Running Test

```bash
# Running test without coverage
npm run test

# Unit test
npm run test:unit

# Integration test
npm run test:Integration

# Running all test with coverage
npm run test:ci

# Running all test and show errors
npm run test:verbose

```
