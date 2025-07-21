---
title: DHT Protocol
description: The protocol used to find other nodes.
---

The DHT protocol is used to discover and connect with other nodes. It follows the Kademlia specification, with some slight modiciations. In the Kademlia spec there are 4 message types: `PING`, `FIND_NODE`, `FIND_VALUE` and `STORE`. The protocol uses Bencoding, but is different from the BitTorrent specification (BEP 5).

- **Port:** 4444/UDP

The root dictionary can hold 5 properties: `0`, `1`, `2`, `3` and `4`. Note: Bencoding requires those keys to be strings, but some old software could send those as integers. This is wrong. The request must have all those properties, the response only requires `0`, `1`, `2` and `3`. The error, like the request, also requires all properties.

- The `0` property is the message type, where the value is an integer with `0` for request, `1` for response and `2` for error.
- The `1` property is the message ID, which contains a string of 20 bytes and is unique for every request-response or request-error pair.
- The `2` property is the node ID, which contains a string of 48 bytes and is unique for every node.
- The `3` property is the method (string; one of the 4) in case of a request message type, the response (mixed) in case of a response message type, and the error type (string) in case of a error message type.
- The `4` property is the arguments (list) in case of a request message type, absent in case of a response message type, and the response (string) in case of a error message type.

When a node wants to send an error back (it doesn't need to in every case), then the error message looks like the response message. However, the `3` property now contains the error type and optionally, `4` contains more information.

## Ping

The request has a property `3` with value `ping`.

In protocol version `0`, there are no request arguments.

In protocol version `1`, there is 1 request argument:
- A dictionary containing `protocolVersion` with integer value `1`.

In both versions, the response has a property `3` with value `pong`.

## Find Node

The request has a property `3` with value `findNode`.

In protocol version `0`, there is 1 request argument:
- A 48-byte string containing a key.

In protocol version `1`, there are 2 request arguments:
- A 48-byte string containing a key.
- A dictionary containing `protocolVersion` with integer value `1`.

In both versions, the response has a property `3` with a list as value. Every item in the list is a tuple (another list), containing the node ID as 48-byte string, the IP as string and the port as integer.

## Find Value

The request has a property `3` with value `findValue`.

In protocol version `0`, there is 1 request argument:
- A 48-byte string containing a key.

In protocol version `1`, there are 2 request arguments:
- A 48-byte string containing a key.
- A dictionary containing `p` (optionally) with an integer value to indicate the page, and `protocolVersion` with integer value `1`.

In both versions, the response has a property `3` with a dictionary as value:
- The directory at least contains a property `token`, which is needed when storing values on the connected node. If the node supports protocol version `1`, it should have `protocolVersion` set to integer `1`. If it only supports version `0`, `protocolVersion` can be integer `0` or absent.
- Based on if the node has the key, it will return the `contacts` property or the property where the name is the same as the key argument in the request. If the key is not known by the node, the `contacts` property is present. Like the `findNode` function response, the `contacts` property will contain a list of tuples, containing the node ID, IP address and DHT port number.
- If the key is known by the node, `contacts` isn't required, but allowed to be present. The response now at least has a property with the same 48 byte long name as the key in the request. This property is a list, where every item in the list is a compact address. This compact address contains information on where the blob can be downloaded.
- The optional `p` property is an integer with the amount of pages of download locations. If there are no download locations, the `p` value is integer `0`. If the `p` property is set in the request, the `contacts` property is absent.

### Compact Address

The compact address is a value of 54 bytes. The first 4 bytes are the binary format of the IPv4 address. The next 2 bytes are the TCP port where the blob can be downloaded. The remanining 48 bytes are the node id of the associated DHT peer.

## Store

The request has a property `3` with value `store`.

In protocol version `0`, there are 4 request arguments:
- A 48-byte string containing a key (e.g. blob hash).
- A value.
- An original publisher ID.
- An age.

The value is a dictory with the properties `token`, `lbryid` and `port`. The `token` property holds the token value of the connected node, where the token value is received from an earlier `findValue` request. The `lbryid` property holds the node ID of the sending node. The `port` property holds the port number of where the blob can be downloaded.

In protocol version `1`, there are 6 request arguments:
- A blob hash.
- A token.
- A port.
- An original publisher ID.
- An age.
- A dictionary containing `protocolVersion` with integer value `1`.

In both versions, the response has a property `3` with value `OK`.
