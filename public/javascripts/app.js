(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("scripts/album", function(exports, require, module) {
// unused. Built on jquery

// Example album
var albumDouble = {
 name: 'Double Sextet / 2x5',
   artist: 'Steve Reich',
   label: 'Nonesuch',
   year: '2010',
   albumArtUrl: '/images/double_sextet_600.jpg',
   songs: [
      {name: 'Double Sextet I. Fast', length: '8:39'},
      {name: 'Double Sextet II. Slow', length: '6:43'},
      {name: 'Double Sextet III. Fast', length: '6:56'},
      {name: '2x5 I. Fast', length: '10:12'},
      {name: '2x5 II. Slow', length: '3:12'},
      {name: '2x5 III. Fast', length: '7:08'}
   ]
};
// Another Example Album
var albumWorks = {
name: 'Works 1965-1995',
artist: 'Steve Reich',
label: 'Nonesuch',
year: '2005',
albumArtUrl: '/images/works_1965-1995_600.jpg',
songs: [
    {name: 'Come Out (1966)', length: '12:58'},
    {name: 'Piano Phase (1967)', length: '20:36'},
    {name: 'It\'s Gonna Rain, Part I (1965)', length: '7:59'},
    {name: 'It\'s Gonna Rain, Part II (1965)', length: '7:53'},
    {name: 'Four Organs / 1970', length: '15:52'},
    {name: 'Drumming: Part I', length: '17:30'},
    {name: 'Drumming: Part II', length: '18:10'},
    {name: 'Drumming: Part III', length: '11:12'},
    {name: 'Drumming: Part IV', length: '9:50'},
    {name: 'Music for Mallet Instruments, Voices and Organ', length: '16:58'},
    {name: 'Clapping Music (1972)', length: '4:48'},
    {name: 'Six Marimbas', length: '16:19'}
  ]
};
var albumMusic18 = {
 name: 'Music for 18 Musicians',
   artist: 'Steve Reich',
   label: 'Nonesuch',
   year: '1998',
   albumArtUrl: '/images/music_for_18_musicians_600.jpg',
   songs: [
      {name: 'Music for 18 Musicians: Pulses', length: '5:26'},
      {name: 'Music for 18 Musicians: Section I', length: '3:58'},
      {name: 'Music for 18 Musicians: Section II', length: '5:13'},
      {name: 'Music for 18 Musicians: Section IIIA', length: '3:55'},
      {name: 'Music for 18 Musicians: Section IIIB', length: '3:45'},
      {name: 'Music for 18 Musicians: Section IV', length: '6:36'},
      {name: 'Music for 18 Musicians: Section V', length: '6:48'},
      {name: 'Music for 18 Musicians: Section VI', length: '4:54'},
      {name: 'Music for 18 Musicians: Section VII', length: '4:19'},
      {name: 'Music for 18 Musicians: Section VIII', length: '3:34'},
      {name: 'Music for 18 Musicians: Section IX', length: '5:23'},
      {name: 'Music for 18 Musicians: Section X', length: '1:50'},
      {name: 'Music for 18 Musicians: Section XI', length: '5:44'},
      {name: 'Music for 18 Musicians: Pulses', length: '6:10'}
   ]
};

var currentlyPlayingSong = null;
var songNumberCell, currentlyPlayingCell;

function createSongRow(songNumber, songName, songLength) {
'use strict';
   var template =
      '<tr>'
   + '  <td class="song-number col-md-1" data-song-number="' + songNumber + '">' + songNumber + '</td>'
   + '  <td class="col-md-9">' + songName + '</td>'
   + '  <td class="col-md-2">' + songLength + '</td>'
   + '</tr>'
   ;
   /* return $(template); */
   // Instead of returning the row immediately, we'll attach hover
   // functionality to it first.
   var $row = $(template);

   // Change from a song number to play button when the song isn't playing and we hover over the row.
   function onHover(event) {
      songNumberCell = $(this).find('.song-number');
      songNumber = songNumberCell.data('song-number');
      if (songNumber !== currentlyPlayingSong) {
         songNumberCell.html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
      }
   }
   // Change from a play button to song number when the song isn't playing and we hover off the row.
   function offHover(event) {
      songNumberCell = $(this).find('.song-number');
      songNumber = songNumberCell.data('song-number');
      if (songNumber !== currentlyPlayingSong) {
         songNumberCell.html(songNumber);
      }
   }

   // Toggle the play, pause, and song number based on the button clicked.
   function clickHandler(event) {
      songNumber = $(this).data('song-number');
      if (currentlyPlayingSong !== null) {
         // Revert to song number for currently playing song because user started playing new song.
         currentlyPlayingCell = $('.song-number[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingCell.html(currentlyPlayingSong);
      }
      if (currentlyPlayingSong !== songNumber) {
         // Switch from Play -> Pause button to indicate new song is playing.
         $(this).html('<a class="album-song-button"><i class="fa fa-pause"></i></a>');
         currentlyPlayingSong = songNumber;
      } else if (currentlyPlayingSong === songNumber) {
         // Switch from Pause -> Play button to pause currently playing song.
         $(this).html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
         currentlyPlayingSong = null;
      }
   }

   $row.find('.song-number').click(clickHandler);
   $row.hover(onHover, offHover);
   return $row;
}  // createSongRow

function changeAlbumView(album) {
'use strict';
   // update the album title
   var $albumTitle = $('.album-title');
   $albumTitle.text(album.name);
   // update the album artist
   var $albumArtist = $('.album-artist');
   $albumArtist.text(album.artist);
   // update the album information
   var $albumMeta = $('.album-meta-info');
   $albumMeta.text(album.year + ' on ' + album.label);
   // update the album image
   var $albumImage = $('.album-image img');
   $albumImage.attr('src', album.albumArtUrl);
   // update the song list
   var $songList = $('.album-song-listing');
   $songList.empty();
   var songs = album.songs;
   for (var i = 0; i < songs.length; i++) {
      var songData = songs[i];
      var $newRow = createSongRow(i + 1, songData.name, songData.length);
      $songList.append($newRow);
   }
}

function updateSeekPercentage($seekBar, event) {
'use strict';
   var barWidth = $seekBar.width();
   var offsetX = event.pageX - $seekBar.offset().left;  // get mouse x offset here
   // console.log(offsetX);
   var offsetXPercent = (offsetX  / $seekBar.width()) * 100;
   offsetXPercent = Math.max(0, offsetXPercent);
   offsetXPercent = Math.min(100, offsetXPercent);

   var percentageString = offsetXPercent + '%';
   $seekBar.find('.fill').width(percentageString);
   $seekBar.find('.thumb').css({left: percentageString});
}

   function setupSeekBars() {
   'use strict';
   var $seekBars = $('.player-bar .seek-bar');
   $seekBars.click(function(event) {
      updateSeekPercentage($(this), event);
   });

   $seekBars.find('.thumb').mousedown(function thumbMouseDown(event) {
      var $seekBar = $(this).parent();
      $seekBar.addClass('no-animate');
      $(document).bind('mousemove.thumb', function mousemoveThumbBind(event) {
//      $('.player-bar').bind('mousemove.thumb', function mousemoveThumbBind(event) {
//      $(document).bind('mousemove', function mousemoveThumbBind(event) {
         updateSeekPercentage($seekBar, event);
      });

      // cleanup
       $(document).bind('mouseup.thumb', function cleanupR() {
         $seekBar.removeClass('no-animate');
         $(document).unbind('mousemove.thumb');
         $(document).unbind('mouseup.thumb');
//     $('.player-bar').bind('mouseup.thumb', function cleanupR() {
//         $seekBar.removeClass('no-animate');
//         $('.player-bar').unbind('mousemove.thumb');
 //        $('.player-bar').unbind('mouseup.thumb');
//      $(document).bind('mouseup', function cleanupR() {
//         $seekBar.removeClass('no-animate');
//         $(document).unbind('mousemove');
//         $(document).unbind('mouseup');
     });
   });
}

// This 'if' condition is used to prevent the jQuery modifications
// from happening on non-Album view pages.
//  - Use a regex to validate that the url has "/album" in its path.
if (document.URL.match(/\/album.html/)) {
// Wait until the HTML is fully processed.
$(document).ready(function documentReadyR() {
   //   console.log('album.js');
   $( '.player-bar' ).bind( 'click', function mouseWhere( event ) {
    alert( 'The mouse cursor is at (' +
      event.pageX + ', ' + event.pageY +
      ')' );
  });
   var theAlbum = albumDouble;
   changeAlbumView(theAlbum);
   setupSeekBars();
});
}

});

;require.register("scripts/app", function(exports, require, module) {
var albumDouble = {
 name: 'Double Sextet / 2x5',
   artist: 'Steve Reich',
   label: 'Nonesuch',
   year: '2010',
   albumArtUrl: '/images/double_sextet_600.jpg',
   songs: [
        {name: 'Double Sextet I. Fast', length: 163.38, audioUrl: '/music/placeholders/blue'},
        {name: 'Double Sextet II. Slow', length: 105.66, audioUrl: '/music/placeholders/green'},
        {name: 'Double Sextet III. Fast', length: 270.14, audioUrl: '/music/placeholders/red'},
        {name: '2x5 I. Fast', length: 154.81, audioUrl: '/music/placeholders/pink'},
        {name: '2x5 II. Slow', length: 375.92, audioUrl: '/music/placeholders/magenta'},
        {name: '2x5 III. Fast', length: 105.66, audioUrl: '/music/placeholders/green'}
   ]
};

var muted = false;

var ccJukebox = angular.module('ccJukebox', ['ui.router']);
ccJukebox.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
   $locationProvider.html5Mode(true);

   $stateProvider.state('landing', {
     url: '/',
     controller: 'Landing.controller',
     templateUrl: '/templates/landing.html'
   });

   $stateProvider.state('song', {
      url:'/song',
      templateUrl: '/templates/song.html'
   });

   $stateProvider.state('collection', {
      url: '/collection',
      controller: 'Collection.controller',
      templateUrl: '/templates/collection.html'
   });

   $stateProvider.state('album', {
      url: '/album',
      controller: 'Album.controller',
      templateUrl: '/templates/album.html'
   });
 }]);
// ccJukebox.config(['$stateProvider', '$locationProvider'

//
 // This is a cleaner way to call the controller than crowding it on the module definition.
ccJukebox.controller('Landing.controller', ['$scope', function($scope) {

    $scope.titleText = 'CC Jukebox';
    $scope.subText = 'Free your music!';
    $scope.subTextClicked = function subTextClicked() {
        $scope.subText += '!';
    };
    // shuffle()
    var shuffle = function shuffle(o) {
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {
        return o;
        }
    }; //- shuffle()

       var albumsArray = [
        '/images/album-placeholders/album-1.jpg',
        '/images/album-placeholders/album-2.jpg',
        '/images/album-placeholders/album-3.jpg',
        '/images/album-placeholders/album-4.jpg',
        '/images/album-placeholders/album-5.jpg',
        '/images/album-placeholders/album-6.jpg',
        '/images/album-placeholders/album-7.jpg',
        '/images/album-placeholders/album-8.jpg',
        '/images/album-placeholders/album-9.jpg'
   ];
$scope.albumURLs = albumsArray;
$scope.titleTextClicked = shuffle(albumsArray);

}]);
// ccJukebox.controller('Landing.controller'

//
ccJukebox.controller('Collection.controller', ['$scope','SongPlayer', function($scope, SongPlayer) {
    $scope.albums = [];
    for (var i = 0; i < 33; i++) {
        $scope.albums.push(angular.copy(albumDouble));
    }

    $scope.playAlbum = function playAlbum(album) {
        SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
    };
}]);
// ccJukebox.controller('Collection.controller'

//
ccJukebox.controller('Album.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger) {
    $scope.album = angular.copy(albumDouble);
//   ConsoleLogger.logIt();
    var hoveredSong = null;
//    var playingSong = null;

    $scope.onHoverSong = function onHoverSong(song) {
        hoveredSong = song;
    };
    $scope.offHoverSong = function offHoverSong(song) {
        hoveredSong = null;
    };

    $scope.getSongState = function getSongState(song) {
        if (song === SongPlayer.currentSong && SongPlayer.playing) {
            return 'playing';
        } else if (song === hoveredSong) {
            return 'hovered';
        }
        return 'default';
    };

    $scope.playSong = function playSong(song) {
        SongPlayer.setSong($scope.album, song);
//        SongPlayer.play();  // info in chkpt 42 ambiguous about this change
    };

    $scope.pauseSong = function pauseSong(song) {
      SongPlayer.pause();
    };
}]);
// ccJukebox.controller('Album.controller'

//
ccJukebox.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.songPlayer = SongPlayer;

    $scope.volumeClass = function volumeClass() {
        return {
            'fa-volume-off': SongPlayer.volume === 0 || muted === true,
            'fa-volume-down': SongPlayer.volume <= 70 && SongPlayer.volume > 0 && muted === false,
            'fa-volume-up': SongPlayer.volume > 70 && muted === false
        };
    };
    SongPlayer.onTimeUpdate(function onTimeUpdate(event, time) {
        $scope.$apply(function playTime() {
            $scope.playTime = time;
        });
    });
}]);
//ccJukebox.controller('PlayerBar.controller'

//
ccJukebox.service('SongPlayer', ['$rootScope', function($rootScope) {
    var currentSoundFile = null;
    var trackIndex = function trackIndex(album, song) {
        return album.songs.indexOf(song);
    };
    return {
        currentSong: null,
        currentAlbum: null,
        playing: false,
        volume: 90,

        iconMute: function iconMute() {
            muted = !muted;
            currentSoundFile.toggleMute();
        },
        play: function play() {
            this.playing = true;
            currentSoundFile.play();
        },
        pause: function parse() {
            this.playing = false;
            currentSoundFile.pause();
        },
        next: function next() {
            var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
            currentTrackIndex++;
            if (currentTrackIndex >= this.currentAlbum.songs.length) {
                currentTrackIndex = 0;
             }
             var song = this.currentAlbum.songs[currentTrackIndex];
             this.setSong(this.currentAlbum, song);
        },
        previous: function previous() {
            var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
            currentTrackIndex--;
            if (currentTrackIndex < 0) {
                currentTrackIndex = this.currentAlbum.songs.length - 1;
            }
            var song = this.currentAlbum.songs[currentTrackIndex];
            this.setSong(this.currentAlbum, song);
        },
        seek: function seek(time) {
            // Checks to make sure that a sound file is playing before seeking
            if (currentSoundFile) {
                // Uses a Buzz method to set the time of the song
                currentSoundFile.setTime(time);
            }
        },
        onTimeUpdate: function(callback) {
            return $rootScope.$on('sound:timeupdate', callback);
        },
        setVolume: function setVolume(volume) {
            if (currentSoundFile) {
                currentSoundFile.setVolume(volume);   // this is a buzz method
            }
            this.volume = volume;
        },
        setSong: function setSong(album, song) {
            if (currentSoundFile) {
                currentSoundFile.stop();
            }
            this.currentAlbum = album;
            this.currentSong = song;

            currentSoundFile = new buzz.sound(song.audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });
            currentSoundFile.setVolume(this.volume);

            currentSoundFile.bind('timeupdate', function(e) {
                $rootScope.$broadcast('sound:timeupdate', this.getTime());
            });

            this.play();
        }  //setSong
    };
}]);
//ccJukebox.service('SongPlayer')

//
ccJukebox.service('ConsoleLogger', function() {
    return {
        logIt: function() {
            console.log('Hello, World!');
        }
};
});
//ccJukebox.service('ConsoleLogger'

//
ccJukebox.directive('slider', ['$document', function slider() {
    // Returns a number between 0 and 1 to determine where the mouse event happened along the slider bar
    // calculateSliderPercentFromMouseEvent()
    var calculateSliderPercentFromMouseEvent = function calculateSliderPercentFromMouseEvent($slider, event) {
        var offsetX =  event.pageX - $slider.offset().left; // Distance from left
        var sliderWidth = $slider.width(); // Width of slider
        var offsetXPercent = (offsetX  / sliderWidth);
        offsetXPercent = Math.max(0, offsetXPercent);
        offsetXPercent = Math.min(1, offsetXPercent);
        return offsetXPercent;
    }; //- calculateSliderPercentFromMouseEvent()

    // numberFromValue()
    var numberFromValue = function numberFromValue(value, defaultValue) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'undefined') {
            return defaultValue;
        }
        if (typeof value === 'string') {
            return Number(value);
        }
    }; //- numberFromValue()

    return {
        templateUrl: '/templates/directives/slider.html',
        replace: true,
        restrict: 'E',
        scope: {
            onChange: '&'
        },                 // Creates a scope that exists only in this directive.
        link: function(scope, element, attributes) {
            // These values represent the progress into the song/volume bar, and its max value.
            // For now, we're supplying arbitrary initial and max values.
            scope.value = 0;
            scope.max = 100;
            var $seekBar = $(element);

            attributes.$observe('value', function valueObserve(newValue) {
                scope.value = numberFromValue(newValue, 0);
            });
            attributes.$observe('max', function maxObserve(newValue) {
                scope.max = numberFromValue(newValue, 100) || 100;
            });

            // notifyCallback()
            var notifyCallback = function notifyCallback(newValue) {
                if (typeof scope.onChange === 'function') {
                    scope.onChange({value: newValue});
                }
            }; //- notifyCallback()

            scope.onClickSlider = function onClickSlider(event) {
                var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
                scope.value = percent * scope.max;
                notifyCallback(scope.value);
            };

            // percentString()
            var percentString = function percentString() {
                // var percent = Number(scope.value) / Number(scope.max)  * 100;
                var value = scope.value || 0;
                var max = scope.max || 100;
                var percent = value / max * 100;
                return percent + '%';
            }; //- percentString()

            scope.fillStyle = function fillStyle() {
                return {width: percentString()};
            };

            scope.thumbStyle = function thumbStyle() {
                return {left: percentString()};
            };

            scope.trackThumb = function trackThumb() {
                $document.bind('mousemove.thumb', function(event) {
                    var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
                    scope.$apply(function() {
                        scope.value = percent * scope.max;
                        notifyCallback(scope.value);
                    });
                });

                // cleanup
                $document.bind('mouseup.thumb', function() {
                    $document.unbind('mousemove.thumb');
                    $document.unbind('mouseup.thumb');
                });
            };

        }  // link: function
    };  // return (within slider)
}]);
//   ccJukebox.directive('slider'...

//
ccJukebox.filter('timecode', function() {
    return function(seconds) {
        seconds = Number.parseFloat(seconds);

        // Returned when no time is provided
        if (Number.isNaN(seconds)) {
            return '-:--';
        }

        // make it a whole number
        var wholeSeconds = Math.floor(seconds);
        var minutes = Math.floor(wholeSeconds / 60);
        var leftoverSeconds = wholeSeconds % 60;
        var output = minutes + ':';

        // zero pad seconds, so 9 seconds should be :09
        if (leftoverSeconds < 10) {
            output += '0';
        }
        output += leftoverSeconds;
        return output;
    };
});
// ccJukebox.filter('timecode'

});

;require.register("scripts/collection", function(exports, require, module) {
//now unused.  Built on jquery

function buildAlbumThumbnail() {
   'use strict';
    var template =
        '<div class="collection-album-container col-md-2">'
      + '  <div class="collection-album-image-container">'
      + '    <img src="/images/album-placeholder.png"/>'
      + '  </div>'
      + '  <div class="caption album-collection-info">'
      + '    <p>'
      + '      <a class="album-name" href="/album.html"> Album Name </a>'
      + '      <br/>'
      + '      <a href="/album.html"> Artist name </a>'
      + '      <br/>'
      + '      X songs'
      + '      <br/>'
      + '      X.XX total length'
      + '      <br/>'
      + '    </p>'
      + '  </div>'
      + '</div>';

   return $(template);
 }

function buildAlbumOverlay(albumURL) {
   'use strict';
   var template =
         '<div class="collection-album-image-overlay">'
      + '  <div class="collection-overlay-content">'
      + '    <a class="collection-overlay-button" href= "' + albumURL + '">'
      + '      <i class="fa fa-play"></i>'
      + '    </a>'
      + '    &nbsp;'
      + '    <a class="collection-overlay-button">'
      + '      <i class="fa fa-plus"></i>'
      + '    </a>'
      + '  </div>'
      + '</div>';
      return $(template);
}

function updateCollectionView() {
   'use strict';
   var $collection = $('.collection-container .row');
   $collection.empty();

   for (var i = 0; i < 33; i++) {
      var $newThumbnail = buildAlbumThumbnail();
      $collection.append($newThumbnail);
   }

   function onHover(event) {
     $(this).append(buildAlbumOverlay('/album.html'));
   }

   function offHover(event) {
      $(this).find('.collection-album-image-overlay').remove();
  }

   $collection.find('.collection-album-image-container').hover(onHover, offHover);
 }


if (document.URL.match(/\/collection.html/)) {
   // Wait until the HTML is fully processed.
   $(document).ready(function() {
//      console.log('collection.js');
      updateCollectionView();
   });
}

});

;require.register("scripts/landing", function(exports, require, module) {
// Now unused.  Built on jquery

$(document).ready(function() {
   $('.hero-content h3').click(function h3Click() {
      var subText = $(this).text();
      $(this).text(subText + '!');
   });

   /* Added for checkpoint 26  */
$('.hero-content h3').hover(function h3Hover() {
      $(this).css('color','red');
   });

   function onHoverAction(event) {
//     console.log('Hover action triggered.');
     $(this).animate({'margin-top': '20px'});
   }

   function offHoverAction(event) {
//     console.log('Off-hover action triggered.');
     $(this).animate({'margin-top': '0px'});
   }

$('.selling-points .point').hover(onHoverAction, offHoverAction);
/* Added for checkpoint 26  */
$('.selling-points .point h5').click(function h5Click() {
//  console.log('Clicking.');
  $(this).css('font-size', '24pt');
});

/* Added for checkpoint 26  */
$('.logo ').click(function logoClick() {
  $(this).fadeOut(2000);
});
});

});

;require.register("scripts/profile", function(exports, require, module) {
//Now unused ? Maybe use later ?  Built on jquery

// holds the name of our tab button container for selection later in the function
var tabsContainer = '.user-profile-tabs-container';
function selectTabHandler(event) {
   'use strict';
   var $tab = $(this);
   $(tabsContainer + ' li').removeClass('active');
   $tab.parent().addClass('active');
   var selectedTabName = $tab.attr('href');
//   alert(selectedTabName);
   $('.tab-pane').addClass('hidden');
   $(selectedTabName).removeClass('hidden');
   event.preventDefault();
}
if (document.URL.match(/\/profile.html/)) {
   $(document).ready(function tabsClick() {
      var $tabs = $(tabsContainer + ' a');
      $tabs.click(selectTabHandler);
      $tabs[0].click();
   });
}

});

;
//# sourceMappingURL=app.js.map