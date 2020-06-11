import document from "document";
import * as messaging from "messaging";
import { battery } from "power";
import { charger } from "power";

import * as simpleClock from "./simple/clock";

let background = document.getElementById("background");
let txtBat = document.getElementById("txtBat");
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

/* --------- BATTERY ---------- */
function batteryUpdate() {
  txtBat.text = Math.floor(battery.chargeLevel) + "%";
}

simpleClock.initialize("minutes", clockCallback);

batteryUpdate();
battery.onchange = batteryUpdate;
