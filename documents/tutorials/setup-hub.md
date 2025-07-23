---
title: Setup LBRY Hub
description: Learn how to setup the LBRY Hub.
---

## Running

The Hub needs a running Elasticsearch instance. [Learn how to set up Elasticsearch.](/tutorials/setup-elasticsearch)

### With Docker Compose

Create a `docker-compose.yml` file with this content:

```shell
version: "3"

volumes:
  lbry_rocksdb:

services:
  scribe:
    depends_on:
      - scribe_elastic_sync
    image: lbry/hub:${SCRIBE_TAG:-master}
    restart: always
    network_mode: host
    volumes:
      - "lbry_rocksdb:/database"
    environment:
      - HUB_COMMAND=scribe
      - SNAPSHOT_URL=https://snapshots.lbry.com/hub/lbry-rocksdb.zip
    command:
      - "--daemon_url=http://lbry:lbry@127.0.0.1:9245"
      - "--max_query_workers=2"
      - "--cache_all_tx_hashes"
      - "--index_address_statuses"
  scribe_elastic_sync:
    image: lbry/hub:${SCRIBE_TAG:-master}
    restart: always
    network_mode: host
    ports:
      - "127.0.0.1:19080:19080"  # elastic notifier port
    volumes:
      - "lbry_rocksdb:/database"
    environment:
      - HUB_COMMAND=scribe-elastic-sync
      - FILTERING_CHANNEL_IDS=770bd7ecba84fd2f7607fb15aedd2b172c2e153f 95e5db68a3101df19763f3a5182e4b12ba393ee8
      - BLOCKING_CHANNEL_IDS=dd687b357950f6f271999971f43c785e8067c3a9 06871aa438032244202840ec59a469b303257cad b4a2528f436eca1bf3bf3e10ff3f98c57bd6c4c6
    command:
      - "--elastic_host=127.0.0.1"
      - "--elastic_port=9200"
      - "--max_query_workers=2"
  herald:
    depends_on:
      - scribe_elastic_sync
      - scribe
    image: lbry/hub:${SCRIBE_TAG:-master}
    restart: always
    network_mode: host
    ports:
      - "50001:50001" # electrum rpc port and udp ping port
      - "2112:2112"   # comment out to disable prometheus metrics
    volumes:
      - "lbry_rocksdb:/database"
    environment:
      - HUB_COMMAND=herald
      - FILTERING_CHANNEL_IDS=770bd7ecba84fd2f7607fb15aedd2b172c2e153f 95e5db68a3101df19763f3a5182e4b12ba393ee8
      - BLOCKING_CHANNEL_IDS=dd687b357950f6f271999971f43c785e8067c3a9 06871aa438032244202840ec59a469b303257cad b4a2528f436eca1bf3bf3e10ff3f98c57bd6c4c6
    command:
      - "--index_address_statuses"
      - "--daemon_url=http://lbry:lbry@127.0.0.1:9245"
      - "--elastic_host=127.0.0.1"
      - "--elastic_port=9200"
      - "--max_query_workers=4"
      - "--host=0.0.0.0"
      - "--max_sessions=100000"
      - "--prometheus_port=2112"                # comment out to disable prometheus metrics
```

Then run:

```shell
docker-compose up -d
```
