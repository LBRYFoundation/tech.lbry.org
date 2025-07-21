---
title: Content Protocol
description: The protocol used to download blobs.
---

This protocol provides a way to pull a blob from a specific node. The protocol uses JSON blocks. The end of a JSON block can be detected if the JSON is valid after receiving a `}`, thereby closing the root object. Another JSON block directly follows it, without any whitespace. This protocol supports composite requests, so multiple requests can be merged into one, as also for the response. For example, one request can both contain `requested_blobs` and `blob_data_payment_rate`, and the server will answer with one response containing both `available_blobs` and `blob_data_payment_rate`.

- **Port:** 3333/TCP (distributed peer, previously)
- **Port:** 4444/TCP (distributed peer)
- **Port:** 5567/TCP (fixed peer)

## Availability

This request will check what blobs are available on the peer. It takes the sent list of blob hashes from `requested_blobs`, checks everyone of them, and returns a list of available blobs in `available_blobs`. Also, the request contains `lbrycrd_address`, which is a boolean property. In the response the `lbrycrd_address` property is a string containing an address. However, the use of `lbrycrd_address` for paying for blob data is not implemented yet.

```json5
//REQUEST
{"lbrycrd_address":false,"requested_blobs":["aabbcc","ddeeff"]}
  //or
{"lbrycrd_address":true,"requested_blobs":["aabbcc","ddeeff"]}

//RESPONSE
{"lbrycrd_address":"bJxKvpD96kaJLriqVajZ7SaQTsWWyrGQct","requested_blobs":["aabbcc","ddeeff"]}
  //or
{"lbrycrd_address":"bJxKvpD96kaJLriqVajZ7SaQTsWWyrGQct","requested_blobs":["aabbcc"]}
  //or
{"lbrycrd_address":"bJxKvpD96kaJLriqVajZ7SaQTsWWyrGQct","requested_blobs":["ddeeff"]}
  //or
{"lbrycrd_address":"bJxKvpD96kaJLriqVajZ7SaQTsWWyrGQct","requested_blobs":[]}
```

## Payment Rate

The reason behind this request is unknown at this moment. The request contains the `blob_data_payment_rate` property with a float. The result is always `RATE_ACCEPTED`, unless the float is below zero. Then the server will respond with `RATE_TOO_LOW`. At this moment, `RATE_UNSET` is not used.

```json5
//REQUEST
{"blob_data_payment_rate":123.456}

//RESPONSE
{"blob_data_payment_rate":"RATE_ACCEPTED"}
  //or
{"blob_data_payment_rate":"RATE_TOO_LOW"}
  //or
{"blob_data_payment_rate":"RATE_UNSET"}
```

## Blob

This request will get the blob itself. The hash will be sent using `requested_blob`. The server then reacts with an `incoming_blob`. If everything is correct, the `incoming_blob` contains a `blob_hash` property and a `length` property. The blob data directly follows after the JSON block response. If an error occurs, the `incoming_blob` contains an `error` property (and `blob_hash` is empty and `length` is zero).

```json5
//REQUEST
{"requested_blob":"aabbcc"}

//RESPONSE
{"incoming_blob":{"blob_hash":"aabbcc","length":123}}/*[Raw Blob Data]*/
  //or
{"incoming_blob":{"blob_hash":"","length":0,"error":"Blob not found"}}
```
