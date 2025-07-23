---
title: Setup LBRY blockchain with LBRYCRD
description: Learn how to setup the LBRY blockchain with LBRYCRD.
---

<Note/>

## Building

### With Docker

```shell
git clone https://github.com/lbryio/lbrycrd.git
cd lbrycrd
docker run -v "$(pwd):/lbrycrd" --rm -v "${HOME}/ccache:/ccache" -w /lbrycrd -e CCACHE_DIR=/ccache lbry/build_lbrycrd packaging/build_linux_64bit.sh

```

### Ubuntu

```shell
sudo apt install build-essential git libtool autotools-dev automake pkg-config bsdmainutils curl ca-certificates
git clone https://github.com/lbryio/lbrycrd.git
cd lbrycrd
./packaging/build_linux_64bit.sh
./src/test/test_lbrycrd
```

## Running

```shell
lbrycrdd -server -daemon
```
