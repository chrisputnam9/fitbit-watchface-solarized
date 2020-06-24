import document from "document";
import * as messaging from "messaging";
import { battery } from "power";
import { charger } from "power";
import * as fs from "fs";

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

// Set data from server to watchface
function showServerData(data) {
    txtInfo1.text = data.temperature;

    txtInfo2.text = data.temperature_range;

    txtInfo3.text = data.update_time;
    txtInfo4.text = data.location;

    let icon = data.weather_icon;
    if (VALID_ICONS.indexOf(icon) !== -1) {
        imgWeatherIcon.href="img/weather/"+icon+".png"
    }

    txtInfo5.text = data.precipitation;
}

// Load from file cache
console.log("Checking local JSON cache");
if (fs.existsSync("server_response_json.txt")) {
    console.log(" - cache file exists");
    let jsonCache = fs.readFileSync("server_response_json.txt", "json");
    showServerData(jsonCache);
} else {
    console.log(" - cache file does not exist");
}

/* --------- MESSAGING ---------- */
// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
    // Output the message to the console
    console.log('peerSocket message received - watch');

    if ( ! "success" in evt.data || ! evt.data.success ) {
        console.log("ERROR: invlaid data");
        return false;
    }

    fs.writeFileSync("server_response_json.txt", evt.data, "json");

    showServerData(evt.data);
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

/* --------- SERVER REFRESH ---------- */
function requestHostedData() {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send({
            request: 'hosted_data'
        });
    } else {
        console.log("ERROR: Messaging connection is not open");
    }
}
// Re-check for update every 30 minutes
setInterval(requestHostedData, 1000 * 60 * 30);
// setInterval(requestHostedData, 1000); // for testing
