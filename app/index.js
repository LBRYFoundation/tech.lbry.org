import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createBunWebSocket } from 'hono/bun';
import { serveStatic } from "@hono/node-server/serve-static";
import { secureHeaders } from 'hono/secure-headers';
import { readFileSync } from 'fs';

import client from "./client.js";
import handleSocketMessages from "./sockets.js";

import dotenv from "dotenv";


if (!process.versions.bun) dotenv.config();


const { upgradeWebSocket, websocket } =
  createBunWebSocket()



const redirects = JSON.parse(readFileSync('./app/data/redirects.json', 'utf8'));

const app = new Hono({ strict: true });

// Own trimTrailingSlash function because hono's middleware doesn't work?
app.use(async (c, next)=>{
  if ((c.req.method === "GET" || c.req.method === "HEAD") && c.req.path !== "/" && c.req.path.at(-1) === "/") {
    const url = new URL(c.req.url);
    url.pathname = url.pathname.substring(0, url.pathname.length - 1);
    c.res = c.redirect(url.toString(), 301);
  }
  await next();
})

app.use(secureHeaders())

// Mount websocket
app.get(
  '/',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        return handleSocketMessages(ws, JSON.parse(event.data));
      },
      onClose: () => {
        // console.log('Connection closed')
      },
    }
  })
);

// Mount static files
app.get(
    "/assets/*",
    serveStatic({
      root: "./app/dist",
      rewriteRequestPath: (path) => {
        // return path
        return path.replace(/^\/assets/, "/");
      }
    })
)

// Mount redirects
app.use('*', async (c, next)=>{
    if (Object.keys(redirects).includes(c.req.path)) return c.redirect(redirects[c.req.path])
    await next();
})




app.route("/", client);


if (!process.versions.bun) {
  serve({
      fetch: app.fetch,
      port: process.env.PORT || 8080
  })
  process.stdout.write(`\n— ⚡ ${process.env.PORT || 8080}\n`);
}

export default {
  fetch: app.fetch,
  websocket,
  port: process.env.PORT || 8080
}