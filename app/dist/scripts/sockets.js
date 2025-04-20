"use strict"; /* global document, initializeSmoothScroll, location, runScriptsInDynamicallyInsertedHTML, WebSocket, window */



document.addEventListener("DOMContentLoaded", () => {
  initializeWebSocketConnection();
  setInterval(checkWebSocketConnection, 5000);
});



let ws = null;

function checkWebSocketConnection() {
  if (!ws || ws.readyState === 3)
    initializeWebSocketConnection();
}

function initializeWebSocketConnection() {
  ws = new WebSocket(location.origin.replace(/^http/, "ws"));

  // ws.onopen = () => console.log("WebSocket connection established"); // eslint-disable-line no-console

  ws.onmessage = socket => {
    let data = JSON.parse(socket.data);

    switch(true) {
      case data.message === "notification": // TODO: Make work with appending so multiple notifications can be sent
        document.getElementById("flash-container").innerHTML =
          `<div class="flash active${data.type ? " " + data.type : ""}">${data.details}</div>`;

        setTimeout(() => {
          document.getElementById("flash-container").innerHTML = "";
        }, 2100);

        break;

      case data.message === "redirect":
        window.location.href = data.url;
        break;

      case data.message === "replace html":
        // create placeholder
        var placeholder = document.createElement("div");
        placeholder.setAttribute("id", "__placeholder"); // eslint-disable-line padding-line-between-statements
        document.querySelector(data.selector).insertAdjacentElement("afterend", placeholder);

        // remove original element
        document.querySelector(data.selector).remove();

        // add new element and remove placeholder
        document.getElementById("__placeholder").insertAdjacentHTML("afterend", data.html);
        document.getElementById("__placeholder").remove();

        // make our scripts work
        runScriptsInDynamicallyInsertedHTML(document.querySelector(data.selector), document.querySelector(data.selector).innerHTML);

        // make smooth scroll work on our new content
        initializeSmoothScroll();
        break;

      case data.message === "show result":
        if (!data.example)
          return;

        document.querySelector(data.selector).innerHTML = data.html;

        if (!document.querySelector(`[data-example="${data.example}"`).classList.contains("completed"))
          document.getElementById("playground-example-description").classList.remove("success");

        document.querySelector(`[data-example="${data.example}"`).classList.add("completed");
        document.getElementById("playground-example-description").classList.add("success");

        document.getElementById("playground-example-description").innerHTML =
          document.querySelector(`[data-example="${data.example}"`).dataset.success;

        if (document.getElementById("temp-loader"))
          document.getElementById("temp-loader").style.display = "none";

        if (document.querySelector(".playground"))
          document.querySelector(".playground").classList.remove("waiting");

        break;

      case data.message === "updated html":
        document.querySelector(data.selector).innerHTML = data.html;

        if (data.class)
          document.querySelector(data.selector).classList.add(data.class);

        if (data.example === 2) {
          detectLanguageAndUpdate(); // eslint-disable-line no-undef
          initCanvas(); // eslint-disable-line no-undef

          setTimeout(() => {
            document.querySelector(".playground-content__meme__canvas__thumbnail").click();
          }, 500);
        }

        if (document.getElementById("playground-example-description")) {
          document.getElementById("playground-example-description").classList.remove("success");

          document.getElementById("playground-example-description").innerHTML =
            document.querySelector(".playground-navigation__example.active").dataset.description;
        }

        if (document.getElementById("temp-loader"))
          document.getElementById("temp-loader").style.display = "none";

        if (document.querySelector(".playground"))
          document.querySelector(".playground").classList.remove("waiting");

        break;

      default:
        console.log(data); // eslint-disable-line no-console
        break;
    }
  };

  ws.onclose = () => checkWebSocketConnection(); // reconnect now
}

function send(msg) { // eslint-disable-line no-unused-vars
  socketReady(ws, () => ws.send(JSON.stringify(msg)));
}

function socketReady(socket, callback) {
  setTimeout(() => {
    if (socket && socket.readyState === 1) {
      if (callback !== undefined)
        callback();
      return;
    }

    return socketReady(socket, callback);
  }, 5);
}
