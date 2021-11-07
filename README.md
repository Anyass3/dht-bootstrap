# dht-bootstrap

Host you own private hyperswarm DHT boostrap nodes as a nodejs daemon

> This for the new api `@hyperswarm/dht@next`

# Installation

```bash
npm install -g dht-bootstrap
```

# Usage

```bash
dht-bootstrap --help
```

```
Usage: dht-bootstrap [options]

Host you own private hyperswarm DHT boostrap nodes as a nodejs daemon

Options:
  -V, --version          output the version number
  -p, --ports [port...]  atleast 2 ports to listen on (default: [])
  -s, --status           displays status
  -h, --host <host>      IP(local|external) or (sub)domain of your device, to use in other devices(NOT "0.0.0.0" OR "127.0.0.1") (default: "0.0.0.0")
  -k, --kill             kills currently active bootstrap node
  --help                 display help for command

  Examples:
    $ dht-bootstrap  # for default(random) or ports in status.json
    $ dht-bootstrap --ports 49737 49738 --host example.com
    $ dht-bootstrap --ports 10001 10002 12234 --host 127.0.0.1

```

> For now, the daemon process only allows one instance.

> If you run another instance it will close the previous instance before starting the new instance.

## To change ports:

just re-run it with the ports

```bash
dht-bootstrap --ports .... ....
```

OR You can edit the `ports` in the generated `status.json` file and run `npm start`
