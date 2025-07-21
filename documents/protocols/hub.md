---
title: Hub Protocol
description: The protocol used to search and resolve claims, manage wallets, and quickly find blockchain information.
---

This protocol is used to search and resolve claims, manage wallets, and quickly find blockchain information. It is based on Bitcoin's BIP40, with some LBRY-specific additions, like Claimtrie methods.

- **Port:** 50001/TCP
- **Port:** 50002/TCP (SSL/TLS)

## Method: `blockchain.claimtrie.resolve`

This method resolves specific LBRY claims and returns more information.

## Method: `blockchain.claimtrie.search`

This method search for LBRY claims by a set of keywords and some filters.
