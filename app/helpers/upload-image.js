"use strict";



//  I M P O R T


//  U T I L

const queryUrl = process.env.NODE_ENV === "development" ?
  "http://localhost:5200/image" :
  `https://${process.env.DAEMON_URL}/image`;



//  E X P O R T

export default async(imageSource) => {
  const options = {
    method: 'POST',
    body: {
      authorization: process.env.LBRY_DAEMON_ACCESS_TOKEN,
      image: imageSource
    },
    json: true
  };

  try {
    const response = await fetch(queryUrl, options);
    return response.body;  
  } catch(error) {
    return error;
  }
};
