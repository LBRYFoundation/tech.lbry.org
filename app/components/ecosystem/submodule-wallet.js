"use strict";



//  U T I L

import markdown from "../../components/markdown.js";



//  E X P O R T

export default async () => `
  <div class="ecosystem__submodule wallet">
    <h3 class="ecosystem__submodule__title" data-action="openSubmodule" data-target="wallet">wallet server</h3>

    <div class="ecosystem__submodule__description">
      <div class="ecosystem__submodule__markdown">
        ${await markdown("./documents/partials/overview/wallet-server.md")}
      </div>

      <ul class="__parents">
        <li class="__parent green" data-action="open" data-target="applications">Applications</li>
        <li class="__parent red" data-action="open" data-target="lbrycrd">Blockchain</li>
        <li class="__parent blue" data-action="open" data-target="lbry">Data Network</li>
        <li class="__close" data-action="close">&times;</li>
      </ul>
    </div>
  </div>
`;
