import document from "document";
import * as messaging from "messaging";
import { battery } from "power";
import { charger } from "power";

import * as simpleClock from "./simple/clock";

const VALID_ICONS=[
    'clear-day',
    'clear-night',
    'rain',
    'snow',
    'sleet',
    'wind',
    'fog',
    'cloudy',
    'partly-cloudy-day',
    'partly-cloudy-night'
];

let background = document.getElementById("background");
let txtBat = document.getElementById("txtBat");
let txtTime = document.getElementById("txtTime");
let txtDate = document.getElementById("txtDate");
let txtDay = document.getElementById("txtDay");
let txtBinaryBottom = document.getElementById("txtBinaryBottom");
let txtBinaryTop = document.getElementById("txtBinaryTop");

let txtInfo1 = document.getElementById("txtInfo1");
let txtInfo2 = document.getElementById("txtInfo2");
let txtInfo3 = document.getElementById("txtInfo3");
let txtInfo4 = document.getElementById("txtInfo4");

let imgWeatherIcon = document.getElementById("imgWeatherIcon");
let txtInfo5 = document.getElementById("txtInfo5");

/* --------- MESSAGING ---------- */
// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
    // Output the message to the console
    console.log('peerSocket message received - watch');
    console.log(JSON.stringify(evt.data));

    txtInfo1.text = evt.data.temperature;
    txtInfo2.text = evt.data.temperature_range;

    txtInfo3.text = evt.data.update_time;
    txtInfo4.text = evt.data.location;

    let icon = evt.data.weather_icon;
    if (VALID_ICONS.indexOf(icon) !== -1) {
        imgWeatherIcon.href="img/weather/"+icon+".png"
    }

    txtInfo5.text = evt.data.precipitation;
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
