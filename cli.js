#!/usr/bin/env node

import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

// Use minimist to process one argument from the command line 
const argument = minimist(process.argv.slice(2));  

// When '-h' is passed in, console.log(argument) displays: { _: [], h: true } 
// This means that argument at h is a boolean...

if (argument.h == true) {
	console.log(
		'Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE \n',
			'-h            Show this help message and exit.\n',
			'-n, -s        Latitude: N positive; S negative.\n',
			'-e, -w        Longitude: E positive; W negative.\n',
			'-z            Time zone: uses tz.guess() from moment-timezone by default.\n',
			'-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n',
			'-j            Echo pretty JSON from open-meteo API and exit.'
	)
	process.exit(0);
}

// Keep track of the arguments to make API call...

const latitude = (() => {
	if (argument.n != null) {
		return argument.n;
	}
	else {
		return argument.s * -1;
	}
})();

const longitude = (() => {
	if (argument.e != null) {
		return argument.e;
	}
	else {
		return argument.w * -1;
	}
})();

const timezone = (() => {
	if (argument.z != null) {
		return argument.z;
	}
	else {
		return moment.tz.guess();
	}
})();

const past_days = (() => {
	if (argument.d != null) {
		return argument.d;
	}
	else {
		return 1;
	}
})();

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&timezone=' + timezone);

// Get the data from the request
const data = await response.json();

// Return the JSON if the user requests it
if (argument.j == true) {
	console.log(data);
	process.exit(0);
}

const days = argument.d 

const precipitation = data.daily.precipitation_hours[days]

if (precipitation == 0) {
	console.log("You will not need your galoshes ");
}
else {
	console.log("You might need your galoshes ");
}


if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}
