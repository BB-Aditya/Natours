const app = require('./index');

const port = 6000;

app.route('/').get(app.getHome).post(app.postHome);

app.listen(port, (req, res) => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${port}`);
});
