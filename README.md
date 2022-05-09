# Sing Me a Song

A song anonym recommendation app in which the most well rated songs have a greater chance to be shown.

## About

This app includes:

- The option to add a song recommendation
- Upvote and downvote of recommendations
- A service that picks a random recommendation based on rating
- A service that lists the last recommendations
- A service that lists the top rated recommendations

## Technologies

The following libraries were used in the construction of back-end of the project:

<div>
  <img style='margin: 3px;' src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img style='margin: 3px;' src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img style='margin: 3px;' src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img style='margin: 3px;' src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img style='margin: 3px;' src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
</div>

The following libraries were used in the construction of front-end of the project:

<div>
  <img style='margin: 3px;' src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img style='margin: 3px;' src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" />
  <img style='margin: 5px;' src='https://img.shields.io/badge/axios%20-%2320232a.svg?&style=for-the-badge&color=informational'>
  <img style='margin: 3px;' src="https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" />
  <img style='margin: 3px;' src="https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white" />
</div>

## How to run

To run this app, you start cloning this repository. Then, do the following steps to run the back-end:

1. Change to the `back-end` repository
2. Install dependencies

```bash
npm install
```

3. Set up the database using Prisma ORM

```bash
npm run migrate-dev
```

4. Run the app in development mode

```bash
npm run dev
```

Alternatively, you can set up the test database and run with this test database:

```bash
npm run migrate-test
npm run dev-test
```

To run the app front-end you need to have its back-end already running. Do the following steps:

1. Change to the `front-end` repository
2. Install dependencies

```bash
npm install
```

3. Run the app in development mode

```bash
npm run start
```

## How to test

To test this app, you start cloning this repository. Then, do the following steps to test the back-end.

1. Change to the `back-end` repository
2. Install dependencies

```bash
npm install
```

3. Set up the test database using Prisma ORM

```bash
npm run migrate-test
```

4. Populate the test database

```bash
npm run seed-db
```

5. Run the test

```bash
npm run test
```

To test the app front-end, you to have its back-end and front-end already running.

1. Change to the `front-end` repository
2. Install dependencies

```
npm install
```

3. Open Cypress

```
npx cypress open
```
