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
[
'/images/album-placeholders/album-1.jpg',
'/images/album-placeholders/album-2.jpg',
'/images/album-placeholders/album-3.jpg'
],
[
'/images/album-placeholders/album-4.jpg',
'/images/album-placeholders/album-5.jpg',
'/images/album-placeholders/album-6.jpg'
],
[
'/images/album-placeholders/album-7.jpg',
'/images/album-placeholders/album-8.jpg',
'/images/album-placeholders/album-9.jpg'
]
];
/*      var albumsArray = [
        '/images/album-placeholders/album-1.jpg',
        '/images/album-placeholders/album-2.jpg',
        '/images/album-placeholders/album-3.jpg',
        '/images/album-placeholders/album-4.jpg',
        '/images/album-placeholders/album-5.jpg',
        '/images/album-placeholders/album-6.jpg',
        '/images/album-placeholders/album-7.jpg',
        '/images/album-placeholders/album-8.jpg',
        '/images/album-placeholders/album-9.jpg'
   ];    */
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
