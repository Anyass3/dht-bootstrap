const DHT = require('@hyperswarm/dht');

const getBootstrap = ({ address, port }) => ({ host: address, port });

module.exports = async (ports) => {
  if (!ports?.length) {
    ports = [null, null, null];
  }
  let [ephemeralPort, ...nonEphemeralPorts] = ports;
  // bootstrap should be empty in order to have a fully private dht
  const bootstrapper1 = DHT.bootstrapper(ephemeralPort, { ephemeral: true, bootstrap: [] });

  await bootstrapper1.ready();

  const bootstraps = [getBootstrap(bootstrapper1.address())];

  for (const port of nonEphemeralPorts) {
    const bootstrapper = DHT.bootstrapper(port, {
      bootstrap: bootstraps,
      ephemeral: false,
    });
    await bootstrapper.ready();
    bootstraps.push(getBootstrap(bootstrapper.address()));
  }

  return bootstraps;
};
