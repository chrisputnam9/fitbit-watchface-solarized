/*
  A simple clock which renders the current time and date in a digital format.
  Callback should be used to update your UI.
*/
import clock from 'clock';
import { preferences } from 'user-settings';

import { days } from './locales/en.js';
import * as util from './utils';

let clockCallback;

export function initialize( granularity, callback ) {
	clock.granularity = granularity;
	clockCallback = callback;
	clock.addEventListener( 'tick', tickHandler );
}

function tickHandler( evt ) {
	const now = evt.date;

	// Date
	const yearFull = now.getFullYear();
	const monthPadded = util.zeroPad( now.getMonth() + 1 );
	const dayNumber = now.getDate();
	const dayNumberPadded = util.zeroPad( dayNumber );
	const dateString = `${ yearFull }-${ monthPadded }-${ dayNumberPadded }`;

	// Day of the week
	const dayName = days[ now.getDay() ];
	const dayNth = Math.ceil( dayNumber / 7 );

	// Time
	let hours = now.getHours();
	if ( preferences.clockDisplay === '12h' ) {
		// 12h format
		hours = hours % 12 || 12;
	} else {
		// 24h format
		hours = util.zeroPad( hours );
	}
	const mins = util.zeroPad( now.getMinutes() );
	const timeString = `${ hours }:${ mins }`;

	// Binary Unix Time Display
	const unixSeconds = Math.floor( now.getTime() / 1000 );
	const unixSecondsBinary = unixSeconds.toString( 2 );
	const unixSecondsArray = unixSecondsBinary.split( '' );

	clockCallback( {
		date: dateString,
		day: dayName,
		daynth: `(${ dayNth })`,
		time: timeString,
		unixSecondsArray: unixSecondsArray,
	} );
}
