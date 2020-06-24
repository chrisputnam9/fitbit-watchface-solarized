/*
  A simple clock which renders the current time and date in a digital format.
  Callback should be used to update your UI.
*/
import clock from "clock";
import { preferences } from "user-settings";

import { days } from "./locales/en.js";
import * as util from "./utils";

let clockCallback;

export function initialize(granularity, callback) {
    clock.granularity = granularity;
    clockCallback = callback;
    clock.addEventListener("tick", tickHandler);
}

function tickHandler(evt) {
    let now = evt.date;

    // Date
    let yearFull = now.getFullYear();
    let monthPadded = util.zeroPad(now.getMonth() + 1);
    let dayNumber = now.getDate();
    let dayNumberPadded = util.zeroPad(dayNumber);
    let dateString = `${yearFull}-${monthPadded}-${dayNumberPadded}`

    // Day of the week
    let dayName = days[now.getDay()];
    let dayNth = Math.ceil(dayNumber / 7);
    let dayString = `${dayName} (${dayNth})`

    // Time
    let hours = now.getHours();
    if (preferences.clockDisplay === "12h") {
        // 12h format
        hours = hours % 12 || 12;
    } else {
        // 24h format
        hours = util.zeroPad(hours);
    }
    let mins = util.zeroPad(now.getMinutes());
    let timeString = `${hours}:${mins}`;

    // Binary Unix Time Display
    let unixSeconds = Math.floor(now.getTime() / 1000);
    let unixSecondsBinary = unixSeconds.toString(2);
    let unixSecondsArray = unixSecondsBinary.split("");

    clockCallback({
        date: dateString,
        day: dayString,
        time: timeString,
        unixSecondsArray: unixSecondsArray
    });
}
