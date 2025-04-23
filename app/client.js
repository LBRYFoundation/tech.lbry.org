import { Hono } from "hono";

import head from "./components/head.js";
import wrapper from "./components/wrapper.js";

import home from "./views/home.js";
import api from "./views/api.js";
import spec from "./views/spec.js";
import redirect from "./views/redirect.js";

const app = new Hono();

app.get("/", page(home));

app.get("/api/:wildcard", page(api));
app.get("/spec", page(spec));
app.get("*", page(redirect));

function page(view) {
    return async (c, emit) => {
      return c.html(`
        <!DOCTYPE html>
        <html lang="en">
          ${head(c)}
          ${await wrapper(view)(c)}
        </html>
      `);
    };
  }
  


export default app;