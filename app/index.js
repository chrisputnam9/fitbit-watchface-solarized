import document from "document";

import * as simpleClock from "./simple/clock";

let background = document.getElementById("background");
let txtTime = document.getElementById("txtTime");
let txtDate = document.getElementById("txtDate");
let txtDay = document.getElementById("txtDay");
let txtBinary = document.getElementById("txtBinary");

/* --------- CLOCK ---------- */
function clockCallback(data) {
  txtTime.text = data.time;
  txtDate.text = data.date;
  txtDay.text = data.day;
  txtBinary.text = data.unix;
}

simpleClock.initialize("minutes", clockCallback);
