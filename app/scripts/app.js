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

blocJams = angular.module('BlocJams', ['ui.router']);
// angular.module('BlocJams', []).controller('Landing.controller', ['$scope', function($scope) {
//   console.log('Landing.controller');
blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
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

 // This is a cleaner way to call the controller than crowding it on the module definition.
 blocJams.controller('Landing.controller', ['$scope', function($scope) {

    $scope.titleText = 'Bloc Jams';
    $scope.subText = 'Turn the music up!';
    $scope.subTextClicked = function() {
        $scope.subText += '!';
    };

    function shuffle(o) { //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {
        return o;
        }
    }

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

// blocJams.controller('Collection.controller', ['$scope', function($scope) {
blocJams.controller('Collection.controller', ['$scope','SongPlayer', function($scope, SongPlayer) {
    $scope.albums = [];
    for (var i = 0; i < 33; i++) {
        $scope.albums.push(angular.copy(albumDouble));
    }

    $scope.playAlbum = function(album) {
        SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
    };
}]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger) {
    $scope.album = angular.copy(albumDouble);
//   ConsoleLogger.logIt();
    var hoveredSong = null;
    var playingSong = null;

    $scope.onHoverSong = function(song) {
        hoveredSong = song;
    };
    $scope.offHoverSong = function(song) {
        hoveredSong = null;
    };

    $scope.getSongState = function(song) {
        if (song === SongPlayer.currentSong && SongPlayer.playing) {
            return 'playing';
        } else if (song === hoveredSong) {
            return 'hovered';
        }
        return 'default';
    };

    $scope.playSong = function(song) {
 //     playingSong = song;
        SongPlayer.setSong($scope.album, song);
//        SongPlayer.play();  // info in chkpt 42 ambiguous about this change
    };

    $scope.pauseSong = function(song) {
//      playingSong = null;
      SongPlayer.pause();
    };
}]);  // Album.controller

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger) {
    $scope.songPlayer = SongPlayer;
//    ConsoleLogger.logIt();
}]);

blocJams.service('SongPlayer', function() {
    var currentSoundFile = null;
    var trackIndex = function(album, song) {
        return album.songs.indexOf(song);
    };
    return {
        currentSong: null,
        currentAlbum: null,
        playing: false,

        play: function() {
            this.playing = true;
            currentSoundFile.play();
        },
        pause: function() {
            this.playing = false;
            currentSoundFile.pause();
        },
        next: function() {
            var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
            currentTrackIndex++;
            if (currentTrackIndex >= this.currentAlbum.songs.length) {
                currentTrackIndex = 0;
             }
             var song = this.currentAlbum.songs[currentTrackIndex];
             this.setSong(this.currentAlbum, song);
 //              this.currentSong = this.currentAlbum.songs[currentTrackIndex];
        },
        previous: function() {
            var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
            currentTrackIndex--;
            if (currentTrackIndex < 0) {
                currentTrackIndex = this.currentAlbum.songs.length - 1;
            }
            var song = this.currentAlbum.songs[currentTrackIndex];
            this.setSong(this.currentAlbum, song);
//               this.currentSong = this.currentAlbum.songs[currentTrackIndex];
        },
        seek: function(time) {
            // Checks to make sure that a sound file is playing before seeking
            if (currentSoundFile) {
                // Uses a Buzz method to set the time of the song
                currentSoundFile.setTime(time);
            }
        },
        setSong: function(album, song) {
            if (currentSoundFile) {
                currentSoundFile.stop();
            }
            this.currentAlbum = album;
            this.currentSong = song;
            currentSoundFile = new buzz.sound(song.audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });

            this.play();
        }  //setSong
    };
});

blocJams.service('ConsoleLogger', function() {
    return {
        logIt: function() {
            console.log('Hello, World!');
        }
};
});

blocJams.directive('slider', ['$document', function() {
    // Returns a number between 0 and 1 to determine where the mouse event happened along the slider bar.
    var calculateSliderPercentFromMouseEvent = function($slider, event) {
        var offsetX =  event.pageX - $slider.offset().left; // Distance from left
        var sliderWidth = $slider.width(); // Width of slider
        var offsetXPercent = (offsetX  / sliderWidth);
        offsetXPercent = Math.max(0, offsetXPercent);
        offsetXPercent = Math.min(1, offsetXPercent);
        return offsetXPercent;
    };
 /*   var updateSeekPercentage = function($seekBar, event) {
        var barWidth = $seekBar.width();
        var offsetX =  event.pageX - $seekBar.offset().left;

        var offsetXPercent = (offsetX  / $seekBar.width()) * 100;
        offsetXPercent = Math.max(0, offsetXPercent);
        offsetXPercent = Math.min(100, offsetXPercent);

        var percentageString = offsetXPercent + '%';
        $seekBar.find('.fill').width(percentageString);
        $seekBar.find('.thumb').css({left: percentageString});
    }   */
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
            console.log(attributes);

            attributes.$observe('value', function(newValue) {
                scope.value = numberFromValue(newValue, 0);
            });
            attributes.$observe('max', function(newValue) {
                scope.max = numberFromValue(newValue, 100) || 100;
            });

            scope.onClickSlider = function(event) {
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

            scope.fillStyle = function() {
                return {width: percentString()};
            };

            scope.thumbStyle = function() {
                return {left: percentString()};
            };

            scope.trackThumb = function() {
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

            // notifyCallback()
            var notifyCallback = function notifyCallback(newValue) {
                if (typeof scope.onChange === 'function') {
                    scope.onChange({value: newValue});
                }
            }; //- notifyCallback()

        }  // link
    };  // return
}]);  //   blocJams.directive('slider'...
