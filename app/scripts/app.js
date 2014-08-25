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
   $stateProvider.state('collection', {
      url: '/collection',
      controller: 'Collection.controller',
      templateUrl: '/templates/collection.html'
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

blocJams.controller('Collection.controller', ['$scope', function($scope) {
   $scope.albums = [];
   for (var i = 0; i < 33; i++) {
      $scope.albums.push(angular.copy(albumDouble));
   }
}]);
