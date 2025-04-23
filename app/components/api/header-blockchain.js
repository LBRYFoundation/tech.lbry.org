"use strict";



//  I M P O R T

import { html } from 'hono/html'




//  E X P O R T

export default version => html`
  <div class="api-content__body">
    <h2>lbrycrd ${version}</h2>
    <p>Methods and signatures provided by the <a href="/glossary#lbrycrd">lbrycrd</a> blockchain daemon are documented below. To build, download, or run lbrycrd, see the project <a href="https://github.com/lbryio/lbrycrd/blob/master/README.md">README</a>.</p>
  </div>

  <div class="api-content__intro">
    <p>You can find the repo for this API on GitHub:</p>
    <pre><code>https://github.com/lbryio/lbrycrd</code></pre>
  </div>
`;
