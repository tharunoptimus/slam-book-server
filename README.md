# Slam Book Server

Slam Book Server is a Node.js project that provides authentication, single sign-on (SSO), and content updating functionality.

## Technologies Used

The following libraries and frameworks were used in this project:

- [Node.js](https://nodejs.org/): a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express](https://expressjs.com/): a fast, unopinionated, minimalist web framework for Node.js.
- [MongoDB](https://www.mongodb.com/): a document-oriented NoSQL database.
- [Mongoose](https://mongoosejs.com/): an Object Data Modeling (ODM) library for MongoDB and Node.js.
- [node-fetch](https://www.npmjs.com/package/node-fetch): a light-weight module that brings window.fetch to Node.js.
- [dotenv](https://www.npmjs.com/package/dotenv): a zero-dependency module that loads environment variables from a .env file.

## Installation

Before running the project, make sure to set the these environment variables and install the necessary dependencies:

```bash
MONGODB_URI
EMAILJS_SERVICE_ID
EMAILJS_PUBLIC_KEY
EMAILJS_PRIVATE_KEY
EMAILJS_TEMPLATE_ID
FRONT_END_URL
```

### Install the dependencies by running:

```bash
npm install
```

## Usage
To start the server, run:

```bash
npm start
```

## License
This project is licensed under the MIT License.