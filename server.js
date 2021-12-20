// process.on('uncaughtException', (err) => {
//   console.log(`${err.name}: ${err.message} \n AT: ${err.stack}`);
//   console.log('Uncaught Exception occured! Shutting down the app');
//   process.exit(1);
// });
const mongoose = require('mongoose');
const app = require('./index');

const port = 8999 - (Math.random() * 10).toFixed(0);
console.log(
  process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
);
const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db, {
    useNewUrlParser: 'true',
    useCreateIndex: 'true',
    useFindAndModify: 'false',
    useUnifiedTopology: true,
  })
  .then(() => {
    ls;
    console.log('DB connection Succesful');
  });

const server = app.listen(port, (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${port}`);
});

// process.on('unhandledRejection', (err) => {
//   console.log(`${err.name} : ${err.message}`);
//   console.log('shutting down the app');
//   server.close(() => {
//     process.exit(1);
//   });
// });
