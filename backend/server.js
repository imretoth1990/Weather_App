/* function sayHi(user) {
  alert(`Hello, ${user}!`);
} 

function sayBye(user) {
  alert(`Bye, ${user}!`);
}

export {sayHi, sayBye}*/

// Server 

const http = require("http");
// const fs = require("fs").promises;
const ip = "127.0.0.1";
const port = 3000; 

// Define functions

// Get data from API with fetch(), async

const fetchWeatherData = async () => {};

// Request, response

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("My first server!");

  // fetchWeatherData()
};

// Return with export

// Console log if server started

const server = http.createServer(requestListener);

server.listen(port, ip, () => {
  const addr = server.address();
  console.log(`http://${addr.address}:${addr.port}`);
});
