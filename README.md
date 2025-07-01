# SEA Catering Backend
Try the website [here](https://seacatering.vercel.app)

For frontend repo go to [Repo](https://github.com/rajariandhana/seacatering)

## About The Stack
The backend uses [expressjs](https://expressjs.com) and [Node.js](https://nodejs.org) which connects the frontend with the [MongoDB](https://www.mongodb.com) database. 

## Project Structure
- `/src/controllers` - does the logic such as validating requests, interacting with database, and sending appropriate response to frontend
- `/src/middleware` - validates token to ensure only authenticated user can use logged features
- `/src/models` - defines backend and database schema for tables
- `/src/routes` - define API routes with their controller method as well as which roles can access certain routes
- `/src/seeders` - seeds the table with dummy data using faker
- `/src/utils` - utility methods