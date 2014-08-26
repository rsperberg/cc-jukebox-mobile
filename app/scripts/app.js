var albumDouble = {
 name: 'Double Sextet / 2x5',
   artist: 'Steve Reich',
   label: 'Nonesuch',
   year: '2010',
   albumArtUrl: '/images/double_sextet_600.jpg',
   songs: [
        {name: 'Double Sextet I. Fast', length: '8:39', audioUrl: '/music/placeholders/blue'},
        {name: 'Double Sextet II. Slow', length: '6:43', audioUrl: '/music/placeholders/green'},
        {name: 'Double Sextet III. Fast', length: '6:56', audioUrl: '/music/placeholders/red'},
        {name: '2x5 I. Fast', length: '10:12', audioUrl: '/music/placeholders/pink'},
        {name: '2x5 II. Slow', length: '3:12', audioUrl: '/music/placeholders/magenta'},
        {name: '2x5 III. Fast', length: '7:08', audioUrl: '/music/placeholders/magenta'}
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
   }
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
        setSong: function(album, song) {
            if (currentSoundFile) {
                currentSoundFile.stop();
            }
            this.currentAlbum = album;
            this.currentSong = song;
            currentSoundFile = new buzz.sound(song.audioUrl, {
                formats: [ "mp3" ],
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

blocJams.directive('slider', function() {
    var updateSeekPercentage = function($seekBar, event) {
        var barWidth = $seekBar.width();
        var offsetX =  event.pageX - $seekBar.offset().left;

        var offsetXPercent = (offsetX  / $seekBar.width()) * 100;
        offsetXPercent = Math.max(0, offsetXPercent);
        offsetXPercent = Math.min(100, offsetXPercent);

        var percentageString = offsetXPercent + '%';
        $seekBar.find('.fill').width(percentageString);
        $seekBar.find('.thumb').css({left: percentageString});
    }
    return {
        templateUrl: '/templates/directives/slider.html',  // To be created shortly
        replace: true,
        restrict: 'E',
        link: function(scope, element, attributes) {
            var $seekBar = $(element);

            $seekBar.click(function(event) {
                updateSeekPercentage($seekBar, event);
            });

            $seekBar.find('.thumb').mousedown(function(event) {
                $seekBar.addClass('no-animate');

                $(document).bind('mousemove.thumb', function(event) {
                    updateSeekPercentage($seekBar, event);
                });

                // cleanup
                $(document).bind('mouseup.thumb', function() {
                    $seekBar.removeClass('no-animate');
                    $(document).unbind('mousemove.thumb');
                    $(document).unbind('mouseup.thumb');
                });

            })  //$seekBar.find
        }  // link
    };  // return
});  //   blocJams.directive('slider'...
