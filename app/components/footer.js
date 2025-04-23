"use strict";



//  I M P O R T

import { html } from "hono/html"

//  U T I L S

import editLink from "./edit-link.js";



//  E X P O R T

export default context => {
  if (context.hideFooter)
    return "";

  return html`
    <footer class="footer">
      <div class="inner-wrap">
        <ul>
          <li>
            <a href="//lbry.org" title="Rediscover content freedom">← LBRY.org</a> |
            ${editLink(context.req.url)}
          </li>

          <li><a href="/overview" title="LBRY overview">Overview</a></li>
          <li><a href="/playground" title="Play with LBRY">Playground</a></li>
          <li><a href="/resources" title="View LBRY resources">Resources</a></li>
          <li><a href="/community" title="Hang with LBRY">Community</a></li>
        </ul>
      </div>
    </footer>

  `;
};
