var TL = TL || {};

TL.Audioplayer = (function(window,document,undefined) {
	
	'use strict';
	
	// private variables
	var audioSupport = false,
		audioPlayer,
		audio,
		nowPlaying,
		selectedClass = 'audio-selected',
		playingClass = 'audio-playing',
		pausedClass = 'audio-paused';
	
	
	// bind click event on parent .audio-list and use event capturing
	function bindLinks() {
		
		$('.audio-list').click(function(e) {
			e.preventDefault();
			
			var $this = $(this),
				target = e.target || e.srcElement,
				$link = $(target).parent();
			
			// if the link isn't clicked directly, determine the parent row and find the correct link
			if (target.parentNode.nodeName !== 'A') {
				$link = $(target).closest('tr').find('a');
			}
			
			// if track is already playing/paused toggle it
			if ($link.hasClass(selectedClass)) {
				Self.toggleAudio($link);
			
			// otherwise load a new track
			} else {
				
				// if there is another track playing, unload it
				if (nowPlaying) {
					Self.clearAudio();
				}
				nowPlaying = $link.addClass(selectedClass);
				loadAudio(nowPlaying);
			}
		});
	};
	
	
	// load functions for HTML5 <audio> and Flash
	function loadAudio(link) {
		
		var $link = $(link).addClass(playingClass),
			srcMp3 = $link.attr('href'),
			srcOgg = $link.data('ogg');
		
		// if audio element exists
		if (audio) {
			audio.pause();
			$(audioPlayer).remove();
		}
		
		// if the browser supports the HTML5 <audio> element
		if (audioSupport) {
			audioPlayer = $('<div class="player"><audio><source src="' + srcMp3 + '" type="audio/mp3"><source src="' + srcOgg + '" type="audio/ogg"></audio></div>').appendTo('body');
			audio = $('.player audio').get(0);
			
			audio.play();
			Self.audioProgress();
			Self.audioEnd();
		
		// otherwise load the Flash fallback
		} else {
			TL.Audioplayer.vars.flashObj.fl_loadAudio(srcMp3);
		}
	};
	
	// function to load the Flash fallback via swfobject
	function loadFlash() {
		
		$('<div id="' + Self.vars.flashID + '" />').appendTo('body');
		swfobject.embedSWF('swf/fl_audioplayer.swf', Self.vars.flashID, '0', '0', '8.0.0');
	};
	
	
	// public functions
	var Self = {
		
		// public variables
		vars: {
			flashObj: '',
			flashID: 'tl-audioplayer'
		},
		
		
		// init
		'init': function() {
			
			//audioSupport = Self.audioSupport();
			audioSupport = false;
			
			// test for HTML5 audio support and load swfobject as fallback
			if (!audioSupport) {
				$LAB.script('js/libs/swfobject.js').wait(function() {
					
					// check for minimum Flash support
					if (swfobject.hasFlashPlayerVersion('8')) {
						loadFlash();
						bindLinks();
					}
				});
			} else {
				bindLinks();
			}
		},
		
		
		// play/pause audio
		'toggleAudio': function(link) {
			
			var $link = $(link);
			
			if ( $link.hasClass('audio-paused') ) {
				$link.removeClass(pausedClass).addClass(playingClass);
				Self.audioPlay();
			} else {
				$link.removeClass(playingClass).addClass(pausedClass);
				Self.audioPause();
			}
		},
		
		// play audio
		'audioPlay': function() {
			if (audioSupport) {
				audio.play();
			} else {
				Self.vars.flashObj.fl_playAudio();
			}
		},
		
		// pause audio
		'audioPause': function() {
			if (audioSupport) {
				audio.pause();
			} else {
				Self.vars.flashObj.fl_stopAudio();
			}
		},
		
		
		// binding on the progress and ended events
		'audioProgress': function() {
			$(audio).bind('timeupdate', function() {
				Self.displayProgress(audio.currentTime,audio.duration);
			});
		},
		
		// display progress based on events fired from the <audio> or Flash object
		'displayProgress': function(current,duration) {
			var rem = parseInt(duration - current, 10),
				pos = (current / duration) * 100,
				mins = Math.floor(rem/60,10),
				secs = rem - mins*60,
				perc = Math.floor((current / duration) * 100);
				
			log(perc + '%');
			
			// update the progress bar or do anything else with the progress and duration numbers
			nowPlaying.css({
				'background-position': perc + '%'
			});
		},
		
		// event fired at the end of the audio track
		'audioEnd': function() {
			$(audio).bind('ended', function() {
				Self.clearAudio();
				log('ended');
			});
		},
		
		// when an audio track is finished or when another track is started, clear the classes and styles of the current track
		'clearAudio': function() {
			nowPlaying.removeClass(playingClass).removeClass(pausedClass).removeClass(selectedClass).attr('style','');
		},
		
		
		// utility that detects Flash support
		'audioSupport': function() {
			var testAudio = document.createElement('audio'),
				audioSupport = (testAudio.play) ? true : false;
			
			return audioSupport;
		}
	
	};
	return Self;

})(this,this.document);


// Flash-specific functions
fl_ready = function() {
	if (navigator.appName.indexOf('Microsoft') != -1) {
		TL.Audioplayer.vars.flashObj = window[TL.Audioplayer.vars.flashID];
	} else {
		TL.Audioplayer.vars.flashObj = document[TL.Audioplayer.vars.flashID];
	}
};

fl_alert = function(txt) {
	log(txt);
};


// usage: log('inside coolFunc',this,arguments);
(function(){var b,d,c=this,a=c.console;c.log=b=function(){d.push(arguments);a&&a.log[a.firebug?"apply":"call"](a,Array.prototype.slice.call(arguments))};c.logargs=function(e){b(e,arguments.callee.caller.arguments)};b.history=d=[]})();