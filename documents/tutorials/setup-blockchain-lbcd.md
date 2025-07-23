---
title: Setup LBRY blockchain with LBCD
description: Learn how to setup the LBRY blockchain with LBCD.
---

## Running

### With Docker

```shell
docker run -d lbryfoundation/lbcd
```

Or if you want to change some parameters:

```shell
docker run --entrypoint "lbcd --notls" -d lbryfoundation/lbcd
```

For all possible parameters, see [doc.go](https://github.com/lbryio/lbcd/blob/a0ff51b84acc553c9e9568e80c7873c03e24d679/doc.go). E.g., when changing the RPC credentials, use `--rpcuser` and `--rpcpass`.

### With Docker Compose

Create a `docker-compose.yml` file with this content:

```yml
version: "3"

volumes:
  lbcd:

services:
  lbcd:
    image: lbry/lbcd:latest
    restart: always
    network_mode: host
    command:
      - "--notls"
      - "--rpcuser=lbry"
      - "--rpcpass=lbry"
      - "--rpclisten=127.0.0.1"
    volumes:
      - "lbcd:/root/.lbcd"
    ports:
      - "127.0.0.1:9245:9245"
      - "9246:9246"  # p2p port
```

Then run:

```shell
docker-compose up -d
```
