"use strict";



//  I M P O R T

import { html } from 'hono/html'




//  E X P O R T

export default (text) => html`
  <div class="component--note">
    <strong class="component--note__title">Note</strong>
    <span>${text}</span>
  </div>
`;
