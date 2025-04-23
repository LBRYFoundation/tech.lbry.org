//  I M P O R T

import { html } from "hono/html"


//  U T I L S

import config from "../../config.js";
import footer from "./footer.js";
import navigation from "./navigation.js";



//  E X P O R T

export default children => async (context) => {
  return html`
    <main>
      <noscript>
        <p>LBRY is quite fancy and relies on a bit of JavaScript to do these fancy things.</p>
        <p>Please enable it, if you can.</p>
      </noscript>

      ${navigation(context.req.url)}
      <aside class="flashes" id="flash-container"></aside>
      ${await children(context)}
      ${footer(context)}
    </main>
  `;
};
