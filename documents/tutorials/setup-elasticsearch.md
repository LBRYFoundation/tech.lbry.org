---
title: Setup Elasticsearch
description: Learn how to setup Elasticsearch.
---

## Running

### With Docker Compose

Create a `docker-compose.yml` file with this content:

```yml
version: "3"

volumes:
  es01:

services:
  es01:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.16.0
    container_name: es01
    environment:
      - node.name=es01
      - discovery.type=single-node
      - indices.query.bool.max_clause_count=8192
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Dlog4j2.formatMsgNoLookups=true -Xms8g -Xmx8g"  # no more than 32, remember to disable swap
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - "es01:/usr/share/elasticsearch/data"
    ports:
      - "127.0.0.1:9200:9200"
```

Then run:

```shell
docker-compose up -d
```
