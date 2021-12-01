const app = require('./index');
const mongoose = require('mongoose');

const port = 8020;
console.log(process.env.DATABASE.replace("<password>",process.env.DATABASE_PASSWORD));
const db = process.env.DATABASE.replace("<password>",process.env.DATABASE_PASSWORD);
mongoose.connect(db,{
  useNewUrlParser:"true",
  useCreateIndex: "true",
  useFindAndModify:"false"
}).then((con)=>{
  console.log(con.connections);
  console.log("Succesful");
});

app.listen(port, (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${port}`);
});
