#!/usr/bin/env node

const DHT = require('@hyperswarm/dht');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const DEFAULT_PORTS = [10001, 10002];
const ports = [];

if (process.argv.includes('--ports'))
  for (let i = 3; i < process.argv.length; i++) ports.push(parseInt(process.argv[i]));

const configJsonPath = path.resolve(path.join(process.argv[1], '../', './config.json'));

let config = { ports: ports.length >= 2 ? ports : DEFAULT_PORTS, env: {} };

if (!fs.existsSync(configJsonPath)) {
  fs.writeFileSync(configJsonPath, JSON.stringify(config, undefined, 2));
} else if (ports.length >= 2) {
  config = JSON.parse(fs.readFileSync(configJsonPath, { encoding: 'utf-8' }));
  config.ports = ports;
  fs.writeFileSync(configJsonPath, JSON.stringify(config, undefined, 2));
} else config = JSON.parse(fs.readFileSync(configJsonPath, { encoding: 'utf-8' }));

const child = (exe, args, env) => {
  const child = child_process.spawn(exe, args, {
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore'],
    env,
  });
  child.unref();
  return child;
};

const daemon = () => {
  if (process.env.__daemon) {
    return process.pid;
  }

  if (config.env.PID) {
    // kill previous daemon before starting a new one
    child('kill', ['-9', config.env.PID], process.env);
  }
  const args = [].concat(process.argv);
  const node = args.shift();
  const env = { __daemon: true, ...process.env };
  const { pid } = child(node, args, env);
  config.env.PID = pid;
  fs.writeFileSync(configJsonPath, JSON.stringify(config, undefined, 2));
};

daemon(); //starts the daemon

const getBootstrap = ({ address, port }) => ({ host: address, port });
(async () => {
  // bootstrap should be empty in order to have a fully private dht
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
  fs.writeFileSync(configJsonPath, JSON.stringify(config, undefined, 2));

  console.log('\nBootstrap nodes listening on:\n');
  for (const bootstrap of bootstraps) {
    console.log('\t', bootstrap);
  }
  console.log('\n');
  // if we are in daemon mode don't kill process
  if (!process.env.__daemon) process.exit();
})();
