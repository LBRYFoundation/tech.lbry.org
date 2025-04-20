"use strict";



//  I M P O R T


//  U T I L

const queryUrl = process.env.NODE_ENV === "development" ?
  "http://localhost:5200/publish" :
  `https://${process.env.DAEMON_URL}/publish`;



//  E X P O R T

export default async(publishMetadata) => {
  const options = {
    method: 'PUT',
    body: {
      authorization: process.env.LBRY_DAEMON_ACCESS_TOKEN,
      metadata: publishMetadata
    },
    json: true
  };

  try {
    const response = await fetch(queryUrl, options);
    return response.body; // eslint-disable-line padding-line-between-statements
  } catch(error) {
    return error;
  }
};
