import { me } from "companion";
import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { geolocation } from "geolocation";


console.log('Companion JS running');
let position;

let watchPositionId = geolocation.watchPosition(
    (fresh_position) => {
        position = fresh_position;
    },
    (error) => {
        console.log("Error " + error.code + ": " + error.message);
    },
    {timeout: 60000}
);

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

    const server_url_data = settingsStorage.getItem('server_url');
    console.log('fetching from server_url: ' + server_url);

    //TODO Add location to request data
    if (server_url) {
        fetch(server_url)
        .then(response => {
            console.log("response from server: ");
            console.log(response);
            messaging.peerSocket.send(response);
        })
        .catch(function (e) {
            console.log("ERROR:");
            console.log(e);
        });
    }
}
