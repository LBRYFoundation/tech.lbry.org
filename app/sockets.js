"use strict";



//  I M P O R T S

import html from "choo/html";

//  U T I L S

import apiPage from "./views/api";
import fetchMetadata from "./helpers/fetch-metadata";
import lbrytvAPI from "./helpers/lbrytv-sdk";
import { generateGitHubFeed } from "./helpers/github";
import { URL } from "url";


//  P R O G R A M

export default async(socket, action) => {
  if (typeof socket !== "object" && typeof action !== "object")
    return;

  switch(true) {
    case action.message === "fetch metadata":
      fetchMetadata(action, socket);
      break;

    case action.message === "landed on homepage":
      generateGitHubFeed(result => {
        send(socket, {
          html: result,
          message: "updated html",
          selector: "#github-feed"
        });
      });
      break;

    case action.message === "landed on playground":
      generateContent(1, result => {
        send(socket, {
          html: result,
          message: "updated html",
          selector: "#playground-loader"
        });
      });
      break;

    case action.message === "request for playground, example 1":
      generateContent(1, result => {
        send(socket, {
          html: result,
          message: "updated html",
          selector: "#playground-loader"
        });
      });
      break;

    case action.message === "request for playground, example 2":
      generateMemeCreator(socket);
      break;

    case action.message === "request for playground, example 3":
      generateContent(3, result => {
        send(socket, {
          html: result,
          message: "updated html",
          selector: "#playground-loader"
        });
      });
      break;

    case action.message === "view different documentation version":
      send(socket, {
        element: "div",
        html: await apiPage({
          params: {
            wildcard: action.version.split("-")[0]
          },
          tag: action.version.split("-")[1]
        }),
        message: "replace html",
        parentElement: "main",
        selector: ".__slate"
      });
      break;

    default:
      break;
  }
};



//  H E L P E R S

function generateContent(exampleNumber, displayTrendingContent) {
  if (exampleNumber === 1) {
    return lbrytvAPI.getTrending()
      .then(response => {
        const renderedContentCollection = [];
        const urlsToResolve = [];

        response.forEach(r => {
          urlsToResolve.push(r.canonical_url);
        });
        lbrytvAPI.resolve(urlsToResolve)
          .then(resolveResponse => {
            if (resolveResponse !== null) {
              const responses = Object.values(resolveResponse);

              for (const r in responses) {
                const part = responses[r];

                if (part.value && part.value.thumbnail && part.value.thumbnail.url) {
                  renderedContentCollection.push(`
                  <section class="playground-content__trend">
                    <figure
                      class="media__thumb"
                      data-action="choose claim"
                      data-claim-id="${part.claim_id}"
                      data-name=${part.name}
                      style="background-image: url(${makeImageSourceSecure(part.value.thumbnail.url)})">
                    </figure>
      
                    <div class="media__title">
                      ${part.value.title || "Untitled"}
                    </div>
      
                    <div class="media__subtitle">
                      ${part.signing_channel ? part.signing_channel.name : "Anon"}
                    </div>
                  </section>
                `);
                }
              }
            }
            renderedContentCollection.push(`
            <script>
              document.getElementById("playground-example-description").innerHTML = document.querySelector("[data-action='playground, example 1']").dataset.description
            </script>
          `);
            displayTrendingContent(renderedContentCollection.join(""));
          })
          .catch(error => {
            console.error(error);
          });
      });
  }

  if (exampleNumber === 3) {
    const approvedUrls = [
      "LBRY#3db81c073f82fd1bb670c65f526faea3b8546720",
      "correlation-can-imply-causation#173412f5b1b7aa63a752e8832406aafd9f1ecb4e",
      "thanos-is-the-protagonist-how-infinity#2a7f5db2678177435b1dee6c9e38e035ead450b6",
      "epic-arcade-mode-duos-nickatnyte-molt#d81bac6d49b1f92e58c37a5f633a27a45b43405e",
      "political-correctness-a-force-for-good-a#b4668c0bd096317b44c40738c099b6618095e75f",
      "10-secrets-hidden-inside-famous-logos#007789cc45cbb4255cf02ba77cbf84ca8e3d7561",
      "ever-wonder-how-bitcoin-and-other#1ac47b8b3def40a25850dc726a09ce23d09e7009",
      "bankrupt-pan-am#784b3c215a6f06b663fc1aa292bcb19f29c489bb",
      "minecraft-in-real-life-iron-man#758dd6497cdfc401ae1f25984738d024d47b50af",
      "ethan-shows-kyle-warframe-skyvault#8a7401b88d5ed0376d98f16808194d4dcb05b284"
    ];
    const renderedContentCollection = [];

    lbrytvAPI.resolve(approvedUrls)
      .then(resolveResponse => {
        if (resolveResponse !== null) {
          const responses = Object.values(resolveResponse);

          for (const r in responses) {
            const part = responses[r];

            if (part.value && part.value.thumbnail.url) {
              renderedContentCollection.push(`
                  <section class="playground-content__trend">
                    <figure
                      class="media__thumb"
                      data-action="choose claim"
                      data-claim-id="${part.claim_id}"
                      data-name=${part.name}
                      style="background-image: url(${makeImageSourceSecure(part.value.thumbnail.url)})">
                    </figure>
      
                    <div class="media__title">
                      ${part.value.title || "Untitled"}
                    </div>
      
                    <div class="media__subtitle">
                      ${part.signing_channel ? part.signing_channel.name : "Anon"}
                    </div>
                  </section>
                `);
            }
          }
        }
        renderedContentCollection.push(`
            <script>
              document.getElementById("playground-example-description").innerHTML = document.querySelector("[data-action='playground, example 3']").dataset.description
            </script>
          `);
        displayTrendingContent(renderedContentCollection.join(""));
      })
      .catch(error => {
        console.error(error);
      });
  }
}

function generateMemeCreator(socket) {
  const images = [
    {
      alt: "Carl Sagan",
      // src: "https://spee.ch/4f6b953e605a602434246743fd246d3e1fd4f5fd/carlsagan2.jpg"
      src: "/assets/media/images/carlsagan2.jpg"
    },
    {
      alt: "Doge",
      // src: "https://spee.ch/2f90f2d91441a4d33d3d4eb82bdfc4c56ec742c7/doge-meme.jpg"
      src: "/assets/media/images/doge-meme.jpg"
    },
    {
      alt: "LBRY Logo With Green Background",
      // src: "https://spee.ch/40ac6818bbac87a208722bf4467653341d460908/lbry-green.png"
      src: "/assets/media/images/lbry-green.png"
    }
  ];

  const memePlaceholderData = {
    bottomLine: {
      placeholder: "Top line",
      value: "that I made"
    },
    description: {
      placeholder: "Description",
      value: "Check out this image I published to LBRY via lbry.tech"
    },
    topLine: {
      placeholder: "Top line",
      value: "This is an example meme"
    },
    title: {
      placeholder: "Title",
      value: "Dank Meme Supreme da Cheese"
    }
  };

  const renderedImages = [];

  for (const image of images)
    renderedImages.push(`<img alt="${image.alt}" class="playground-content__meme__canvas__thumbnail" src="${image.src}"/>`);

  const memeCreator = html`
    <div class="playground-content__meme__canvas">
      <img alt="Base image for LBRY meme creator" id="base-image" style="height: 0; position: absolute; visibility: hidden;"/>
      <canvas id="meme-canvas" height="600" width="800">Unfortunately, it looks like canvas is <strong>not supported</strong> in your browser</canvas>

      ${renderedImages}
    </div>

    <form class="playground-content__meme__editor">
      <fieldset>
        <legend>Image Text</legend>

        <fieldset-section>
          <label for="meme-top-line">Top line</label>
          <input id="meme-top-line" name="meme-top-line" placeholder="${memePlaceholderData.topLine.placeholder}" spellcheck="false" type="text" value="${memePlaceholderData.topLine.value}" required/>
        </fieldset-section>

        <fieldset-section>
          <label for="meme-bottom-line">Bottom line</label>
          <input id="meme-bottom-line" name="meme-bottom-line" placeholder="${memePlaceholderData.bottomLine.placeholder}" spellcheck="false" type="text" value="${memePlaceholderData.bottomLine.value}" required/>
        </fieldset-section>
      </fieldset>

      <fieldset>
        <legend>Metadata</legend>

        <fieldset-section>
          <label for="meme-title">Title</label>
          <input id="meme-title" name="meme-title" placeholder="${memePlaceholderData.title.placeholder}" spellcheck="false" type="text" value="${memePlaceholderData.title.value}" required/>
        </fieldset-section>

        <fieldset-section>
          <label for="meme-description">Description</label>
          <textarea id="meme-description" name="meme-description" placeholder="${memePlaceholderData.description.placeholder}" spellcheck="false" type="text" required>${memePlaceholderData.description.value}</textarea>
        </fieldset-section>

        <fieldset-section>
          <label for="meme-language">Language</label>
          <select id="meme-language" name="meme-language">
            <option value="ar">Arabic</option>
            <option value="zh">Chinese (Mandarin)</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="jp">Japanese</option>
            <option value="ru">Russian</option>
            <option value="es">Spanish</option>
            <option value="">Not specified</option>
          </select>
        </fieldset-section>

        <fieldset-section>
          <label for="meme-license">License</label>
          <select id="meme-license" name="meme-license" required>
            <option value="Public Domain">Public Domain</option>
            <option value="Creative Commons Attribution 4.0 International">Creative Commons Attribution 4.0 International</option>
            <option value="Creative Commons Attribution-ShareAlike 4.0 International">Creative Commons Attribution-ShareAlike 4.0 International</option>
            <option value="Creative Commons Attribution-NoDerivatives 4.0 International">Creative Commons Attribution-NoDerivatives 4.0 International</option>
            <option value="Creative Commons Attribution-NonCommercial 4.0 International">Creative Commons Attribution-NonCommercial 4.0 International</option>
            <option value="Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</option>
            <option value="Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International</option>
            <option value="None">None</option>
          </select>
        </fieldset-section>

        <fieldset-section>
          <checkbox-element>
            <input id="meme-nsfw-flag" name="nsfw" type="checkbox">
            <label for="meme-nsfw-flag">NSFW</label>
            <checkbox-toggle/>
          </checkbox-element>

          <button data-action="upload image" class="button" type="button">Submit</button>
        </fieldset-section>
      </fieldset>
    </form>
  `;

  return send(socket, {
    example: 2,
    html: memeCreator,
    message: "updated html",
    selector: "#playground-loader"
  });
}

function makeImageSourceSecure(url) {
  if (!url || !url.length)
    return url;

  const originalUrl = new URL(url);

  if (originalUrl.protocol !== "https")
    return `https://${originalUrl.host}${originalUrl.pathname}`;

  return originalUrl.href;
}

export function send(transport, data) {
  return transport.send(JSON.stringify(data));
}
