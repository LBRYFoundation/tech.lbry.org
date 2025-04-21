"use strict";

const addSupport = function () { };

const publish = function () { };

const resolve = function (urls) {
  return new Promise(async (resolve, reject) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        method: "resolve",
        params: { urls: urls }
      })
    };

    const response = await fetch("https://api.na-backend.odysee.com/api/v1/proxy", options);
    let json;
    if (!response.ok) return reject(new Error("DAEMON ERROR: resolve"));

    try {
      json = await response.json();
    } catch (err) {
      return reject(new Error("DAEMON ERROR: resolve"));
    }

    return resolve(json.result);
  });
};

const getTrending = function () {
  return new Promise(async (resolve, reject) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        method: "claim_search",
        params: {
          page_size: 20,
          page: 1,
          no_totals: true,
          any_tags:
            ["art",
              "automotive",
              "blockchain",
              "comedy",
              "economics",
              "education",
              "gaming",
              "music",
              "news",
              "science",
              "sports",
              "technology"],
          channel_ids: [],
          not_channel_ids: [],
          not_tags: ["porn", "porno", "nsfw", "mature", "xxx", "sex", "creampie", "blowjob", "handjob", "vagina", "boobs", "big boobs", "big dick", "pussy", "cumshot", "anal", "hard fucking", "ass", "fuck", "hentai"],
          order_by: ["trending_group", "trending_mixed"]
        }
      })
    };

    const response = await fetch("https://api.na-backend.odysee.com/api/v1/proxy", options);
    let json;
    if (!response.ok) return reject(new Error("DAEMON ERROR: resolve"));

    try {
      json = await response.json();
    } catch (err) {
      return reject(new Error("DAEMON ERROR: resolve"));
    }

    return resolve(json.result.items);
  });
};

export default {
  addSupport,
  publish,
  resolve,
  getTrending
};
