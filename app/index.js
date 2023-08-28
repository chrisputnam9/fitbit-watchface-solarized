import document from 'document';
import * as messaging from 'messaging';
import { battery } from 'power';
import * as fs from 'fs';

import * as simpleClock from './simple/clock';

const SCREEN_HEIGHT = 336;
const BINARY_DIGIT_ZERO = 20;
const BINARY_DIGIT_ONE = 28;
const VALID_ICONS = [
	'clear-day',
	'clear-night',
	'rain',
	'snow',
	'sleet',
	'wind',
	'fog',
	'cloudy',
	'partly-cloudy-day',
	'partly-cloudy-night',
];
const BINARY_Y_MAP = [ 40, 30, 20, 12, 6, 2 ];

const txtBat = document.getElementById( 'txtBat' );
const txtTime = document.getElementById( 'txtTime' );
const txtDate = document.getElementById( 'txtDate' );
const txtDay = document.getElementById( 'txtDay' );

const txtInfoMidLeft = document.getElementById( 'txtInfoMidLeft' );
const txtInfoMidLeft2 = document.getElementById( 'txtInfoMidLeft2' );

const txtInfoMidBottom = document.getElementById( 'txtInfoMidBottom' );
const txtInfoBottom = document.getElementById( 'txtInfoBottom' );

const txtInfoMidRight = document.getElementById( 'txtInfoMidRight' );
const txtInfoMidRight2 = document.getElementById( 'txtInfoMidRight2' );
const txtInfoMidRight3 = document.getElementById( 'txtInfoMidRight3' );

const imgWeatherIcon = document.getElementById( 'imgWeatherIcon' );

const rectBinaryDigits = {
	top: [],
	bottom: [],
};
for ( let i = 0; i <= 32; i++ ) {
	rectBinaryDigits.top[ i ] = document.getElementById(
		'binary-digit-top-' + i
	);
	rectBinaryDigits.bottom[ i ] = document.getElementById(
		'binary-digit-bottom-' + i
	);
}

// Set data from server to watchface
function showServerData( data ) {
	txtInfoMidLeft.text = data.temperature;

	txtInfoMidLeft2.text = data.temperature_range;

	txtInfoMidRight.text = data.update_time;
	txtInfoBottom.text = data.location;

	const icon = data.weather_icon;
	if ( VALID_ICONS.indexOf( icon ) !== -1 ) {
		imgWeatherIcon.href = 'img/weather/' + icon + '.png';
	}

	txtInfoMidBottom.text = data.precipitation;

	if ( 'status' in data && 'status' in data.status ) {
		txtInfoMidRight2.text = data.status.status;
		txtInfoMidRight3.text = '(' + data.status.last_swipe + ')';
	}
}

// Load from file cache
console.log( 'Checking local JSON cache' );
if ( fs.existsSync( 'server_response_json.txt' ) ) {
	console.log( ' - cache file exists' );
	const jsonCache = fs.readFileSync( 'server_response_json.txt', 'json' );
	showServerData( jsonCache );
} else {
	console.log( ' - cache file does not exist' );
}

/* --------- MESSAGING ---------- */
// Listen for the onmessage event
messaging.peerSocket.onmessage = function ( evt ) {
	// Output the message to the console
	console.log( 'peerSocket message received - watch' );

	if ( ! ( 'success' in evt.data ) || ! evt.data.success ) {
		console.log( 'ERROR: invlaid data' );
		return false;
	}

	fs.writeFileSync( 'server_response_json.txt', evt.data, 'json' );

	showServerData( evt.data );
};

/* --------- CLOCK ---------- */
function clockCallback( data ) {
	txtTime.text = data.time;
	txtDate.text = data.date;
	txtDay.text = data.day;

	let i = 0;
	let digit;
	while ( ( digit = data.unixSecondsArray.pop() ) ) {
		let bottom_y_adjustment = 0;
		const i_from_end = 32 - i;

		if ( i in BINARY_Y_MAP ) {
			bottom_y_adjustment = BINARY_Y_MAP[ i ];
		} else if ( i_from_end in BINARY_Y_MAP ) {
			bottom_y_adjustment = BINARY_Y_MAP[ i_from_end ];
		}

		if ( rectBinaryDigits.top[ i ] ) {
			if ( digit === '1' ) {
				rectBinaryDigits.top[ i ].height = BINARY_DIGIT_ONE;
				rectBinaryDigits.bottom[ i ].height = BINARY_DIGIT_ONE;
				rectBinaryDigits.bottom[ i ].y =
					SCREEN_HEIGHT - ( BINARY_DIGIT_ONE + bottom_y_adjustment );
			} else {
				rectBinaryDigits.top[ i ].height = BINARY_DIGIT_ZERO;
				rectBinaryDigits.bottom[ i ].height = BINARY_DIGIT_ZERO;
				rectBinaryDigits.bottom[ i ].y =
					SCREEN_HEIGHT - ( BINARY_DIGIT_ZERO + bottom_y_adjustment );
			}
		}

		i++;
	}
}

/* --------- BATTERY ---------- */
function batteryUpdate() {
	txtBat.text = Math.floor( battery.chargeLevel ) + '%';
}

simpleClock.initialize( 'minutes', clockCallback );

batteryUpdate();
battery.onchange = batteryUpdate;

/* --------- SERVER REFRESH ---------- */
function requestHostedData() {
	console.log( 'Requesting fresh server info...' );
	if ( messaging.peerSocket.readyState === messaging.peerSocket.OPEN ) {
		messaging.peerSocket.send( {
			request: 'hosted_data',
		} );
	} else {
		console.log( 'ERROR: Messaging connection is not open' );
	}
}
// Re-check for update every 30 minutes
setInterval( requestHostedData, 1000 * 60 * 30 );
// setInterval(requestHostedData, 1000); // for testing
