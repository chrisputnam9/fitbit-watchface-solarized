import { settingsStorage } from 'settings';
import * as messaging from 'messaging';
import { geolocation } from 'geolocation';
import { localStorage } from 'local-storage';

console.log( 'Companion JS running' );

// Listen for the onopen event
messaging.peerSocket.onopen = function () {
	console.log( 'peerSocket.onopen - will send hosted data to watch' );
	// Kick off - fetch and send hosted data response
	tryUpdateGeoPosition();
};

// Listen for the onmessage event
messaging.peerSocket.onmessage = function ( evt ) {
	// Output the message to the console
	console.log( 'peerSocket.onmessage: ', JSON.stringify( evt.data ) );
	if ( 'request' in evt.data ) {
		if ( evt.data.request === 'hosted_data' ) {
			console.log(
				' - hosted_data requested - will send hosted data to watch'
			);
			tryUpdateGeoPosition();
		}
	}
};

function tryUpdateGeoPosition() {
	geolocation.getCurrentPosition(
		( geo_position ) => {
			if (
				geo_position &&
				typeof geo_position === 'object' &&
				'coords' in geo_position &&
				'latitude' in geo_position.coords
			) {
				const geo_position_json = JSON.stringify( {
					lat: geo_position.coords.latitude,
					lng: geo_position.coords.longitude,
				} );
				console.log(
					'tryUpdateGeoPosition succeeded.  Storing: ' +
						geo_position_json
				);
				localStorage.setItem( 'fbs-last-position', geo_position_json );
				maybeSendHostedData();
			}
		},
		( error ) => {
			console.log(
				' - ERROR during geolocation.getCurrentPosition: ' +
					error.code +
					': ' +
					error.message
			);
			maybeSendHostedData();
		},
		{
			enableHighAccuracy: true,
			maximumAge: Infinity,
			timeout: 60000, // 60 second timeout = 60 * 1000 ms
		}
	);
}

function maybeSendHostedData() {
	console.log( 'maybeSendHostedData:' );
	const server_url_json = settingsStorage.getItem( 'server_url' );
	const server_url_data = JSON.parse( server_url_json );
	const server_url =
		server_url_data && 'name' in server_url_data
			? server_url_data.name
			: false;
	if ( ! server_url ) {
		console.log( ' - ERROR: Check settings - server url is empty' );
		return;
	}

	addGeoPosition( server_url );
}

/**
 * Try and add geolocated position to server URL
 * - Either way, continue on to send hosted data
 */
function addGeoPosition( server_url ) {
	console.log( 'addGeoPosition(' + server_url + ')' );

	// Get location data from storage as fallback
	const geo_position_json = localStorage.getItem( 'fbs-last-position' );
	console.log( 'Position from storage: ', geo_position_json );
	const geo_position = geo_position_json
		? JSON.parse( geo_position_json )
		: false;

	if (
		geo_position &&
		typeof geo_position === 'object' &&
		'lat' in geo_position
	) {
		server_url += '&lat=' + geo_position.lat;
		server_url += '&lng=' + geo_position.lng;
	}

	sendHostedData( server_url );
}

function sendHostedData( server_url ) {
	console.log( 'sendHostedData(' + server_url + ')' );
	fetch( server_url )
		.then( ( response ) => response.json() )
		.then( ( data ) => {
			console.log( ' - Response from server: ', JSON.stringify( data ) );
			if (
				messaging.peerSocket.readyState === messaging.peerSocket.OPEN
			) {
				messaging.peerSocket.send( data );
			} else {
				console.log(
					' - ERROR sending to device: Messaging connection is not open'
				);
			}
		} )
		.catch( function ( e ) {
			console.log(
				' - ERROR fetching from server:',
				JSON.stringify( e )
			);
		} );
}
