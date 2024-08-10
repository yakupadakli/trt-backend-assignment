const { createServer } = require('./server');

const app = createServer();

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`App listening on port ${port}!`);
});

module.exports = { app };
