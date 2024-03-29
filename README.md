# A mobile jukebox

There are all kinds of jukebox/music players on the web, but how about one that plays music that's free to listen to and that is free of ads and other restrictions? So I've built the CC Jukebox to play [Creative Commons](http://creativecommons.org/)-licensed music located at the [Free Music Archive](http://freemusicarchive.org/) on a cellphone.

This is an HTML5 application built for mobile and forked from a project emulating [rdio](en.us.rdio.com/) that I did at bloc.io called [BlocJams](https://github.com/rsperberg/bloc-jams). BlocJams was built using [Brunch](http://brunch.io), an HTML5 build tool that's simpler and easier to use than Grunt.(see next section) .

You can see a demo of CC Jukebox running at [cc-jukebox-mobile.herokuapp.com](http://cc-jukebox-mobile.herokuapp.com).

# Making use of Brunch
## Getting started
* Install (if you don't have them):
    * [Node.js](http://nodejs.org): `brew install node` on OS X
    * [Brunch](http://brunch.io): `npm install -g brunch`
    * [Bower](http://bower.io): `npm install -g bower`
    * Brunch plugins and Bower dependencies: `npm install & bower install`.
* Run:
    * `brunch watch --server` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `brunch build --production` — builds minified project for production
* Learn:
    * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
    * Place static files you want to be copied from `app/assets/` to `public/`.
    * [Brunch site](http://brunch.io), [Chaplin site](http://chaplinjs.org)
