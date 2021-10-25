# hyp-bootstrap
> this for the new api `@hyperswarm/dht/@next`

# Usage
```bash
# atlest 2 ports
npm start -- --ports 10001 10002
```

This run the dht node to listen on `10001, 10002`. This is the default

> If you run it again it will close the previous node and then start the new node

## To change ports:

You can edit the `ports` in the generated `config.json` file and run `npm start` 

Or just re-run it with the ports
```bash
npm start -- --ports .... ....
```
> check the generated `config.json` file to see the ports, it's currently listening on
