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

var createSongRow = function createSongRowR(songNumber, songName, songLength) {
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
   var onHover = function onHoverR(event) {
      songNumberCell = $(this).find('.song-number');
      songNumber = songNumberCell.data('song-number');
      if (songNumber !== currentlyPlayingSong) {
         songNumberCell.html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
      }
   };
   // Change from a play button to song number when the song isn't playing and we hover off the row.
   var offHover = function offHoverR(event) {
      songNumberCell = $(this).find('.song-number');
      songNumber = songNumberCell.data('song-number');
      if (songNumber !== currentlyPlayingSong) {
         songNumberCell.html(songNumber);
      }
   };

   // Toggle the play, pause, and song number based on the button clicked.
   var clickHandler = function clickHandlerR(event) {
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
   };

   $row.find('.song-number').click(clickHandler);
   $row.hover(onHover, offHover);
   return $row;
};  // createSongRow

var changeAlbumView = function changeAlbumViewR(album) {
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
};

var updateSeekPercentage = function updateSeekPercentageR($seekBar, event) {
   var barWidth = $seekBar.width();
   var offsetX = event.pageX - $seekBar.offset().left;  // get mouse x offset here
   // console.log(offsetX);
   var offsetXPercent = (offsetX  / $seekBar.width()) * 100;
   offsetXPercent = Math.max(0, offsetXPercent);
   offsetXPercent = Math.min(100, offsetXPercent);

   var percentageString = offsetXPercent + '%';
   $seekBar.find('.fill').width(percentageString);
   $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function setupSeekBarsR() {

   var $seekBars = $('.player-bar .seek-bar');
   $seekBars.click(function(event) {
      updateSeekPercentage($(this), event);
   });

   $seekBars.find('.thumb').mousedown(function seekBarsFindR(event) {
      var $seekBar = $(this).parent();
      $seekBar.addClass('no-animate');
      $(document).bind('mousemove.thumb', function mousemoveThumbBindR(event) {
         updateSeekPercentage($seekBar, event);
      });

      // cleanup
      $(document).bind('mouseup.thumb', function cleanupR() {
         $seekBar.removeClass('no-animate');
         $(document).unbind('mousemove.thumb');
         $(document).unbind('mouseup.thumb');
      });
   });
};

// This 'if' condition is used to prevent the jQuery modifications
// from happening on non-Album view pages.
//  - Use a regex to validate that the url has "/album" in its path.
if (document.URL.match(/\/album.html/)) {
// Wait until the HTML is fully processed.
$(document).ready(function documentReadR() {
   //   console.log('album.js');
   var theAlbum = albumDouble;
   changeAlbumView(theAlbum);
   setupSeekBars();
});
}
