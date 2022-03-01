# Clean code Node API

This API is part of the "NodeJs Rest API using TDD, Clean Architecture and Typescript" training.

## Feature
- Create user: `{{host}}/api/signup`

    ``` json
   //Payload
    {
        "name": "john foo bar",
        "email": "john@bar.com",
        "password": "123",
        "passwordConfirmation": "123"
    }
    ```
- Sign in user: `{{host}}/api/login`

    ``` json
    //Payload
    {
        "email": "john@bar.com",
        "password": "123"
    }
    ```

## API Docs
(In progress...)

## Stack
- Node.js + Typescript
- Express
- Nodemon
- Bcrypt
- JWT(Json Web Token)
- MongoDB

## Docker Local Development

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
npm run start:dev
```
<b>Notice: This command is configured with debug in vsCode</b>

## Stopping the Application
```bash
npm run stop:dev
```

## Ports is running 
- REST: `{{host}}:3003`
- Debug: `{{host}}:9222`

## Running Test
```bash
# Running test With no coverage
npm run test

# Unit test
npm run test:unit

# Integration test
npm run test:Integration

# Running all test
npm run test:ci

```
