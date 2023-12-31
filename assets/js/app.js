// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
import {LiveSocket} from "phoenix_live_view"
import { Socket } from "phoenix";

import topbar from "../vendor/topbar"
import {
  CHANNEL,
  setup as setupStores
} from "./state"
import {
  channelJoin
} from "./core/socket"
import {
  setup as setupChannelCallbacks
} from "./channel_callbacks"

import { go } from "./playground"
import "./dom_callbacks"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

setupStores(csrfToken, "room:lobby");
channelJoin(CHANNEL);
setupChannelCallbacks();
go();

liveSocket.connect();
