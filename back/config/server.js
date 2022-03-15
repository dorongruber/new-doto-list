const app = require('../../app');
const http = require('http');

const server = http.createServer(app);

require('./mongodb');

const PORT = process.env.$PORT || 3000;
server.listen(PORT, () => {
  console.log('listening at port ' + PORT);
});
