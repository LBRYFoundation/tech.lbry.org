---
title: Reflector Protocol
description: The protocol used to upload blobs.
---

This protocol provides a way to actively push blobs to the network, instead of waiting for them to get pulled. The protocol uses JSON blocks. The end of a JSON block can be detected if the JSON is valid after receiving a `}`, thereby closing the root object. Another JSON block directly follows it, without any whitespace. At this moment, there will be no error block sent when an error occurs. Version `0` of the protocol supports blobs, version `1` of the protocol also supports SD blobs. Unknown properties are ignored and will not cause an error.

- **Port:** 5566/TCP

## Handshake

Before doing anything with blobs, the handshake should be sent. The `version` property is required and should be an integer valued `0` or `1`. If the server supports that version, it will send back an JSON block where the `version` property has the same value. If the `value` property contains an invalid protocol number or a protocol number that isn't supported, the server throws an error and closes the connection.

```json5
//REQUEST
{"version":0}
  //or
{"version":1}

//RESPONSE
{"version":0}
  //or
{"version":1}
```

## Blob Hash and Blob Size

After the handshake, blobs can be received. First, the server wants to know more about the blob itself, before it wants to receive the blob data itself. The clients needs to send a JSON block with the blob hash and the blob size. It is important to note that this request is different for normal blobs and SD (Stream Descriptor) blobs. The properties `blob_hash` and `blob_size` are required OR the properties `sd_blob_hash` and `sd_blob_size` are required. The hash cannot be empty and the size cannot be zero or exceed the maximum blob size.

Then, the server will check if it wants to receive the blob. It can do several checks, e.g. checking if it already has the blob or if the blob is blacklisted. If the server wants the blob, it will send a JSON block with the `send_blob` property for normal blobs and a JSON block with `send_sd_blob` for SD blobs. If the server notices that it has the SD blob, but misses some of the blobs defined in the SD blob, it will at those hashes to `needed_blobs`. If the server doesn't want the blob, the client can send information about another blob.

```json5
//REQUEST
{"blob_hash":"aabbcc","blob_size":123} // if version>=0
  //or
{"sd_blob_hash":"ddeeff","sd_blob_size":456} // if version>=1

//RESPONSE
{"send_blob":false} // if version>=0
  //or
{"send_blob":true} // if version>=0
  //or
{"send_sd_blob":false} // if version>=1
  //or
{"send_sd_blob":true} // if version>=1
  //or
{"send_sd_blob":false,"needed_blobs":[]} // if version>=1
  //or
{"send_sd_blob":true,"needed_blobs":[]} // if version>=1
  //or
{"send_sd_blob":false,"needed_blobs":["aabbcc","ddeeff"]} // if version>=1
  //or
{"send_sd_blob":true,"needed_blobs":["aabbcc","ddeeff"]} // if version>=1
```

## Blob Data

If the server wants the blob, it will read exactly the amount of bytes that were stated in the blob information. If there goes something wrong with sending the blob data (e.g. there was a socket timeout or the blob hash calculation didn't match the blob hash from the blob information), the server will send a message that it didn't receive the blob. This will be a JSON block with the `received_blob` property for normal blobs and a JSON block with `received_sd_blob` for SD blobs. After this message, the client can send information about another blob.

```json5
//REQUEST
  /*[Raw Blob Data]*/

//RESPONSE
{"received_blob":false} // if version>=0
  //or
{"received_blob":true} // if version>=0
  //or
{"received_sd_blob":false} // if version>=1
  //or
{"received_sd_blob":true} // if version>=1
```
