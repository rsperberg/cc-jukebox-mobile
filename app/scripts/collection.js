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
