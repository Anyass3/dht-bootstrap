#!/usr/bin/env node

const DHT = require('@hyperswarm/dht');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const configJsonPath = path.resolve(path.join(process.argv[1], '../', './config.json'));
if (!fs.existsSync(configJsonPath)) {
  fs.writeFileSync(configJsonPath, JSON.stringify({ ports: [10001, 10002], env: {} }));
}
const config = JSON.parse(fs.readFileSync(configJsonPath, { encoding: 'utf-8' }));
const getBootstrap = ({ address, port }) => ({ host: address, port });
(async () => {
  //bootstrap should be empty in order have a fully private dht
  const bootstrapper1 = DHT.bootstrapper(config.ports[0], { ephemeral: true, bootstrap: [] });

  await bootstrapper1.ready();

  const bootstraps = [getBootstrap(bootstrapper1.address())];

  for (const port of config.ports) {
    if (config.ports[0] === port) continue;
    const bootstrapper = DHT.bootstrapper(port, {
      bootstrap: bootstraps,
      ephemeral: false,
    });
    await bootstrapper.ready();
    bootstraps.push(getBootstrap(bootstrapper.address()));
  }
  config.ports = bootstraps.map((bootstrap) => bootstrap.port);
  fs.writeFileSync(configJsonPath, JSON.stringify(config));
})();

const child = (exe, args, env) => {
  var child = child_process.spawn(exe, args, {
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore'],
    env,
  });
  child.unref();
  return child;
};

const daemon = () => {
  console.log('starting bootstrap nodes as a daemon');
  if (process.env.__daemon) {
    return process.pid;
  }
  process.env.__daemon = true;

  if (config.env.PID) {
    child('kill', ['-9', config.env.PID], process.env);
  }
  const args = [].concat(process.argv);
  const node = args.shift();
  const env = process.env;
  const { pid } = child(node, args, env);
  config.env.PID = pid;
  fs.writeFileSync(configJsonPath, JSON.stringify(config));
  return process.exit();
};

daemon();
