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
let txtBinaryBottom = document.getElementById("txtBinaryBottom");
let txtBinaryTop = document.getElementById("txtBinaryTop");

let txtServer1 = document.getElementById("txtServer1");
let txtServer2 = document.getElementById("txtServer2");
let txtServer3 = document.getElementById("txtServer3");
let txtServer4 = document.getElementById("txtServer4");

/* --------- MESSAGING ---------- */
// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
    // Output the message to the console
    console.log('peerSocket message received - watch');
    console.log(JSON.stringify(evt.data));
    txtServer1.text = evt.data.text1;
    txtServer2.text = evt.data.text2;
    txtServer3.text = evt.data.text3;
    txtServer4.text = evt.data.text4;
}

/* --------- CLOCK ---------- */
function clockCallback(data) {
  txtTime.text = data.time;
  txtDate.text = data.date;
  txtDay.text = data.day;
  txtBinaryBottom.text = data.unixBottom;
  txtBinaryTop.text = data.unixTop;
}

/* --------- BATTERY ---------- */
function batteryUpdate() {
  txtBat.text = Math.floor(battery.chargeLevel) + "%";
}

simpleClock.initialize("seconds", clockCallback);

batteryUpdate();
battery.onchange = batteryUpdate;
