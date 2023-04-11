import { settingsStorage } from 'settings';
import * as messaging from 'messaging';
import { geolocation } from 'geolocation';

console.log( 'Companion JS running' );
let geo_position;

geolocation.watchPosition(
	( fresh_geo_position ) => {
		geo_position = fresh_geo_position;
	},
	( error ) => {
		console.log(
			'Error during watchPosition: ' + error.code + ': ' + error.message
		);
	},
	{
		enableHighAccuracy: true,
		maximumAge: 60000, // 1 hr cache
		timeout: 60000, // 1 hr timeout
	}
);

// Listen for the onopen event
messaging.peerSocket.onopen = function () {
	console.log( 'peerSocket onopen' );
	// Fetch and send hosted data response
	sendHostedData();
};

// Listen for the onmessage event
messaging.peerSocket.onmessage = function ( evt ) {
	// Output the message to the console
	console.log( 'peerSocket onmessage' );
	console.log( JSON.stringify( evt.data ) );
	if ( 'request' in evt.data ) {
		if ( evt.data.request === 'hosted_data' ) {
			sendHostedData();
		}
	}
};

function sendHostedData() {
	const server_url_json = settingsStorage.getItem( 'server_url' );
	const server_url_data = JSON.parse( server_url_json );
	let server_url =
		server_url_data && 'name' in server_url_data
			? server_url_data.name
			: false;
	if ( server_url ) {
		console.log( 'fetching from server_url: ' + server_url );
	} else {
		console.log( 'ERROR: Check settings - server url is empty' );
		return;
	}

	if ( server_url ) {
		// Add geo location to request data -  if we have it
		if ( 'coords' in geo_position ) {
			server_url += '&lng=' + geo_position.coords.longitude;
			server_url += '&lat=' + geo_position.coords.latitude;
		}

		fetch( server_url )
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				console.log( 'response from server: ' );
				console.log( data );
				if (
					messaging.peerSocket.readyState ===
					messaging.peerSocket.OPEN
				) {
					messaging.peerSocket.send( data );
				} else {
					console.log( 'ERROR: Messaging connection is not open' );
				}
			} )
			.catch( function ( e ) {
				console.log( 'ERROR:' );
				console.log( e );
			} );
	}
}
