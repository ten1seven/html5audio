// init external interface
import flash.external.*;

// initially stop preload and progress loops
loopsStop();

// set up JavaScript > ActionScript functions
var methodName:String = "fl_loadAudio";
var instance:Object = null;
var method:Function = getSound;
var wasSuccessful:Boolean = ExternalInterface.addCallback(methodName, instance, method);

var methodName:String = "fl_playAudio";
var instance:Object = null;
var method:Function = audioPlay;
var wasSuccessful:Boolean = ExternalInterface.addCallback(methodName, instance, method);

var methodName:String = "fl_stopAudio";
var instance:Object = null;
var method:Function = audioStop;
var wasSuccessful:Boolean = ExternalInterface.addCallback(methodName, instance, method);

// announce that Flash is ready
ExternalInterface.call('fl_alert','[MP3 Player]: Flash ready');
ExternalInterface.call('fl_ready');

// set an empty variable for the sound duration and position
var dur:Number, pos:Number, sound:Sound = new Sound();

// get sound
function getSound(url:String) {
	
	// reset variable to 0 on a new sound
	dur = 0;
	
	// destroy current sound object
	sound.stop();
	delete sound;
	
	// create new sound object
	sound = new Sound();
	
	// bind to load event
	sound.onLoad = function(success:Boolean) {
		if (success) {
			ExternalInterface.call('fl_alert','[MP3 Player]: File loaded');
			
			// when audio finishes loading we finally know the actual duration
			dur = sound.duration;
		} else {
			ExternalInterface.call('fl_alert','[MP3 Player]: Could not load Sound Data from file, please try again');
		}
	};
	
	// bind to complete event
	sound.onSoundComplete = function() {
		ExternalInterface.call('fl_alert','[MP3 Player]: Playback complete');
		ExternalInterface.call('TL.Audioplayer.clearAudio()');
		loopsStop();
	};
	
	// load sound and start streaming immediately
	sound.loadSound(url,true);
	loopsStart();
};

// play sound
function audioPlay() {
	ExternalInterface.call('fl_alert','[MP3 Player]: Playback position ' + (pos / 1000));
	if (pos < dur) {
		sound.start(pos / 1000);
	} else {
		sound.start();
	}
	loopsStart();
};

// stop sound
function audioStop() {
	pos = sound.position;
	
	sound.stop();
	loopsStop();
};

// display file preload progress
function displayLoad() {
	ExternalInterface.call('TL.Audioplayer.displayLoad(' + sound.getBytesLoaded() + ',' + sound.getBytesTotal() + ')');
};

// display play progress and duration
function displayProgress() {
	var timeTotal;
	
	// check if dur has been set
	if (dur > 0) {
		timeTotal = dur;
	
	// otherwise estimate manually
	} else {
		var loaded = sound.getBytesLoaded(),
			duration = sound.duration,
			kbps = ((loaded/1000)/(duration/1000)),
			total = sound.getBytesTotal()/1000;
		
		timeTotal = (total/kbps)*1000;
	}
	
	ExternalInterface.call('TL.Audioplayer.displayProgress(' + (pos/1000) + ',' + (timeTotal/1000) + ')');
};

// start the preload and progress loops
function loopsStart() {
	_root.preload.play();
	_root.progress.play();
};

// stop the preload and progress loops
function loopsStop() {
	_root.preload.stop();
	_root.progress.stop();
};