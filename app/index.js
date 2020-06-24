import document from "document";
import * as messaging from "messaging";
import { battery } from "power";
import { charger } from "power";
import * as fs from "fs";

import * as simpleClock from "./simple/clock";

const SCREEN_HEIGHT=250;
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

let txtInfo1 = document.getElementById("txtInfo1");
let txtInfo2 = document.getElementById("txtInfo2");
let txtInfo3 = document.getElementById("txtInfo3");
let txtInfo4 = document.getElementById("txtInfo4");

let imgWeatherIcon = document.getElementById("imgWeatherIcon");
let txtInfo5 = document.getElementById("txtInfo5");

let rectBinaryDigits = {
    top: [],
    bottom: []
}
for (let i=0;i<=32;i++) {
    rectBinaryDigits.top[i] = document.getElementById("binary-digit-top-"+i);
    rectBinaryDigits.bottom[i] = document.getElementById("binary-digit-bottom-"+i);
}

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

    let i = 0;
    let digit;
    while (digit = data.unixSecondsArray.pop())
    {
        if (rectBinaryDigits.top[i]) {
            if (digit == "1") {
                rectBinaryDigits.top[i].height = 4;
                rectBinaryDigits.bottom[i].height = 4;
                rectBinaryDigits.bottom[i].y = (SCREEN_HEIGHT-4);
            } else {
                rectBinaryDigits.top[i].height = 12;
                rectBinaryDigits.bottom[i].height = 12;
                 rectBinaryDigits.bottom[i].y = (SCREEN_HEIGHT-12);
            }
        }

        i++;
    }
}

/* --------- BATTERY ---------- */
function batteryUpdate() {
    txtBat.text = Math.floor(battery.chargeLevel) + "%";
}

simpleClock.initialize("seconds", clockCallback);

batteryUpdate();
battery.onchange = batteryUpdate;
