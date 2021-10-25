const bootstrap = require('.');
const DHT = require('@hyperswarm/dht');

(async () => {
  const bootstraps = await bootstrap();
  // const bootstraps = await bootstrap([10001,11103]);

  console.log('private bootstraps', bootstraps);
  const keyPair = DHT.keyPair();

  //server
  const serverNode = new DHT({ bootstrap: bootstraps });
  const server = serverNode.createServer();
  server.on('connection', function (noiseSocket) {
    noiseSocket.write('greetings from server');
    noiseSocket.on('data', (data) => {
      console.log(data.toString());
    });
  });
  await server.listen(keyPair);

  //client
  const clientNode = new DHT({ bootstrap: bootstraps });
  const noiseSocket = clientNode.connect(keyPair.publicKey);

  noiseSocket.on('open', function () {
    noiseSocket.write('greetings from client');
    noiseSocket.on('data', (data) => {
      console.log(data.toString());
      process.exit();
    });
  });
})();
