//  I M P O R T S

import fm from "front-matter";
import fs from "fs";
import { html, raw } from 'hono/html'

//  U T I L S

import markdown from "../components/markdown.js";
import page404 from "./404.js";



//  E X P O R T

export default (context) => {  
  
  const partialPath = /^\/resources\/.*/.test(context.req.path) ?
    context.req.path :
    context.req.path.slice(1);

  const path = `./documents/${partialPath}.md`;

  if (!fs.existsSync(path))
    return page404();

  const markdownFile = fs.readFileSync(path, "utf-8");
  const markdownFileDetails = fm(markdownFile);
  const title = markdownFileDetails.attributes.title;
  const description = markdownFileDetails.attributes.description || "";

  if (markdownFileDetails.attributes.meta) {
    const customMetadata = {};

    for (const key in markdownFileDetails.attributes.meta) {
      if (Object.prototype.hasOwnProperty.call(markdownFileDetails.attributes.meta, key)) {
        customMetadata[Object.keys(markdownFileDetails.attributes.meta[key])[0]] =
          markdownFileDetails.attributes.meta[key][Object.keys(markdownFileDetails.attributes.meta[key])[0]];
      }
    }

    context.var.lbry = customMetadata;
  }

  // below is evil, I just inherited it -- Jeremy
  context.var.lbry = {
    title: title,
    description: description
  };

  // below should be refactored into components
  let pageScript = "";

  switch(true) {
    case partialPath === "glossary":
      pageScript = renderClientScript("glossary-scripts");
      break;

    case partialPath === "overview":
      pageScript = renderClientScript("ecosystem-scripts");
      break;

    case partialPath === "playground":
      pageScript = renderClientScript("playground-scripts");
      break;

    default:
      break;
  }

  return html`
    <article class="page" itemtype="http://schema.org/BlogPosting">
      <header class="page__header">
        <div class="page__header-wrap">
          <div class="inner-wrap">
            <h1 class="page__header__title" itemprop="name headline">${title}</h1>
          </div>
        </div>
      </header>

      <section class="page__content" itemprop="articleBody">
        <div class="inner-wrap">
          ${markdown(path)}
          ${raw(pageScript)}
        </div>
      </section>
    </article>
  `;
};



//  H E L P E R

function renderClientScript(clientScriptFileName) {
  return `
    <script>
      ${fs.readFileSync((`${process.cwd()}/app/components/client/${clientScriptFileName}.js`), "utf-8")}
    </script>
  `;
}
