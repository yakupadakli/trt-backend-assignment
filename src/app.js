const { createServer } = require('./server');
const config = require('./config');

const app = createServer();

const port = process.env.PORT || 5000;

// Load the config
config();

app.listen(port, async () => {
  console.log(`App listening on port ${port}!`);
});

module.exports = { app };
