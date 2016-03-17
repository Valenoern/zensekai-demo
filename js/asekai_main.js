/**
 @module shues
 @submodule shues
*/

/**
 Namespace for shues format specific functions.
 shues will automatically load itself along with modules defined in shues_modules.js.

 @class shues
 @constructor
**/

// :folding=explicit:    <- this is for my text editor
// :collapseFolds=1,2:

'use strict';

var Asekai = function() {
	
	this.name = 'asekai'; // so we can identify ourself in the terminal lol
	
	this.sg = {
		circuitousness: 0
	};
	
	this.state = {}; // will be populated by Twine's state obj
		
	this.state = window.story.state;
	
	
	this.worldClock = {};
	this.allKai = [];
	this.activeKai = {};  // TODO: make this a reference to active kai
	
	
	this.kaitest();
};

Asekai.prototype = {
	
	test: function() {
		console.log('kai test');
	},
	
	/**
	 Check that a variable is set/element exists before running a function. 
	*/
	inoriCheck: function(shouldntBeNull, func) {
		if (shouldntBeNull === undefined || shouldntBeNull === null) {
			// attempt to retry the function...
			try {
				// if we have tried too many times we need to stop
				if (this.sg.circuitousness > 10) {
					throw 'circuitousness too high';
				}
				
				this.sg.circuitousness += 1;
				window.setTimeout(func, 100);
				
				console.warn('ShutUpInori error, var is ', shouldntBeNull , '. retrying.');
			}
			catch (e) {
				console.error(e);
			}
			
			throw 'ShutUpInori';
		}
		
		else {
			// note: this refers to shues even if you call it in another file
			this.sg.circuitousness = 0;
		}
	},
	
/* utility funcs */
	
	
	
/* */	
	
/* interface funcs */
	
	storyClass: function(className) {
		document.getElementById('story').className = className;
	},
	

/* */

	
	kaitest: function() {
		this.load();
	},



	save: function() {
		var data =  '[' + JSON.stringify(asekai.worldClock) + ',' + JSON.stringify(asekai.activeKai) + ']';
		
		console.debug('saving ', asekai.activeKai.data);
		
		// if saving to quicksave...
		window.localStorage.setItem('kai_quicksave', data);
	},
	
	load: function() {
		var data = '';
		
		// if loading from quicksave...
		data = window.localStorage.getItem('kai_quicksave');
		//data = null;
		//console.debug(data);
		
		if (data !== null) {
		
			console.debug('loading ', data);
			data = JSON.parse(data);
			
			this.worldClock = new WorldClock(data[0].seconds, data[0].timeInterval);
			this.activeKai = new Kai(data[1]);
		}
		
		else {
			this.worldClock = new WorldClock(0, 1000);
			this.activeKai = new Kai();
		}
		
		console.debug('werwerewr');
		
		this.worldClock.start();
	}
	
};

// tfw when you get so frustrated with this "not a function" bullshit
// you move the function outside of the class
function defVal(variable, value) {
		if (variable === undefined) {
			return value;
		}
		
		else {
			return variable;
		}
}



/* asekai clock class */

var WorldClock = function(seconds, interval) {
	this.seconds = defVal(seconds,0);
	this.shift = '';
	
	this.intervalTag = null;
	this.timeInterval = defVal(interval,1000);
};

WorldClock.prototype = {
	start: function() {
		this.intervalTag = window.setInterval(this.tick.bind(this), this.timeInterval);
	},
	
	stop: function() {
		window.clearInterval(this.intervalTag);
		this.intervalTag = null;
	},
	
	tick: function() {
		this.seconds += 1;
		
		var kai = asekai.activeKai;
		
		kai.metabStep();
		
		console.debug(this.seconds + ' ' + kai.data.energy);
		
		// quicksave data every 5 real seconds
		if ((this.seconds * this.timeInterval) % 5000 == 0) {
			asekai.save();
		}
	}
};


/** Monster class */

var Kai = function(dater) {
	var i;
	
	this.base = {};
	this.data = {};
	
	console.debug(dater);
	
	if (dater != undefined) {
		for (i in dater) {
			this.data[i] = dater[i];
		}
		
		//this.base = Object.create(asekai_globals[this.data.kaiType]);
	}
	
	else {
	this.data = {
	/* dynamic vital statistics */
	
	// age in seconds
	age: 0,
	
	// dimension measurement
	size: 0,
	
	// mass in kg?
	mass: 0,
	
	// energy in joules
	energy: 0,
	
	
	// circ degrees  360
	cDeg: 0,
	
	
	/* variable things and attunes */
	
	kaiType: 'Entity',
	
	
	shift: '',
	
	// start time for circ degrees in seconds
	dayStart: 0,
	
	// 100 J/s is the test value
	metabRate: 100
	};
	}
	
	
	
};

Kai.prototype = {
	initialise: function () {
	},
	
	metabStep: function() {
		if (this.data.metabRate != undefined) {
		this.data.energy -= this.data.metabRate;
		} else {
			console.debug('data:', this.data);
		}
	},
	
	toJSON: function() {
		console.debug('jsoning as: ',JSON.stringify(this.data));
		
		return this.data;
	}
	
};


/* Asekai globals */

var asekai_globals = {
	shifts: ['Dawn', 'Sunrise', 'Morning', 'Midday', 'Evening', 'Sunset', 'Dusk', 'Midnight'],
	
	monsters: {
		'entity': {
			name: 'Entity',
			metabRate: 100
		},
		
		'hokado': {
			name: 'Hokado',
			metabRate: 100
		},
		
		'catanid': {
			name: 'Catanid',
			metabRate: 100
		},
		
		'punk': {
			name: 'Punk',
			metabRate: 100
		}
	}
};




/* copied from shues file */

function startshues() {
	console.info('asekai is starting to load');
	$(window).unbind('shues_load'); // just in case the window might load shues twice
	
	var i = 0, lastone = false;
	window.asekai = new Asekai();
	
	// if we don't need to load modules we're done
	$.event.trigger('shues_loaded');
	
	console.info('asekai has attempted to load');
}

$(window).bind('shues_load', startshues);


