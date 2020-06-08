import document from "document";
import * as messaging from "messaging";

import * as simpleClock from "./simple/clock";

let background = document.getElementById("background");
let txtTime = document.getElementById("txtTime");
let txtDate = document.getElementById("txtDate");
let txtDay = document.getElementById("txtDay");
let txtBinary = document.getElementById("txtBinary");

let txtServer = document.getElementById("txtServer");

/* --------- MESSAGING ---------- */
// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
    // Output the message to the console
    console.log('peerSocket message received - watch');
    console.log(JSON.stringify(evt.data));
    txtServer.text = evt.data.text;
}

/* --------- CLOCK ---------- */
function clockCallback(data) {
  txtTime.text = data.time;
  txtDate.text = data.date;
  txtDay.text = data.day;
  txtBinary.text = data.unix;
}

simpleClock.initialize("minutes", clockCallback);
