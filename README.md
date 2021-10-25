# dht-bootstrap

Host you own private hyperswarm DHT boostrap nodes as a nodejs daemon

> This for the new api `@hyperswarm/dht@next`

# Installation

```bash
npm install -g dht-bootstrap
```

# Usage

> Atleast 2 ports

```bash
dht-bootstrap --ports 10001 10002
```

> For now, the daemon process only allows one instance.

> If you run another instance it will close the previous instance before starting the new instance.

## To change ports:

Just re-run with the new ports

```bash
dht-bootstrap --ports .... ....
```

## To check status

```bash
dht-bootstrap --status
```

## Help

```bash
dht-bootstrap --help
```
