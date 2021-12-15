const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tourModel');

dotenv.config({ path: '../config.env' });
const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Db connection succesful');
  })
  .catch((err) => {
    console.log(err);
  });

const tours = fs.readFileSync(`./data/tours-simple.json`, 'utf-8');

const importData = async () => {
  try {
    await Tour.create(JSON.parse(tours));
    console.log('Data inserted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data succesfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] == '-import') {
  importData();
}

else if (process.argv[2] == '-delete') {
  deleteAllData();
}
