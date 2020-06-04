import { me } from "companion";
import { settingsStorage } from "settings";
import * as messaging from "messaging";

//TODO Add location to request data https://dev.fitbit.com/build/guides/geolocation/

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
    console.log('peerSocket onopen');
    // Fetch and send hosted data response
    sendHostedData();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
    // Output the message to the console
    console.log('peerSocket onmessage');
    console.log(JSON.stringify(evt.data));
}

function sendHostedData() {

    const server_url = settingsSorage.getItem('server_url');
    console.log('server_url: ' + server_url);

    if (server_url) {
        fetch(server_url)
        .then(response => {
            console.log(response);
            // messaging.peerSocket.send(departures);
        })
        .catch(function (e) {
            console.log("ERROR:");
            console.log(e);
        });
    }
}
