// ==UserScript==
// @name         IndexOfPlayer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://hmaslov.d-real.sci-nnov.ru/public/mp3/Beatles/01%20Please,%20Please%20Me/
// @match        http://www.rightohear.com/mp3/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==
/* jshint -W097 */
'use strict';


$("<style>")
    .prop("type", "text/css")
    .html("#playlist,audio{background:#666;width:400px;padding:20px;}\
             .active a{color:#5DB0E6;text-decoration:none;}\
             li a{color:#eeeedd;background:#333;padding:5px;display:block;}\
             li a:hover{text-decoration:none;}").appendTo("head");
var firstItem = true;
var mp3Links = $('a').filter(function () {
  return $(this).attr('href').match(/\.mp3?/);
});

var player;
var playlist = '';

for(var i = 0 ; i < mp3Links.length ; i++) {
    var mp3 = $(mp3Links[i]);
    var mp3Link = mp3.attr('href');
    console.log(mp3.text());
    if(i==0) {
        //console.log(mp3.attr('href'));
        player = '<audio id="audio" preload="auto" tabindex="0" controls=""> \
                  <source src="'+ mp3Link +'"> \
                  Your Fallback goes here \
                  </audio> \
                  <ul id="playlist"> \
                  <li class="active">';
    }
    
    var itemPlaylist = '<li ' + (i==0 ? 'class="active"' : '') + '"><a href="'+ mp3Link +'">' + mp3.text() + '</a></li>';
    playlist += itemPlaylist;    
}
$('body').prepend(player + playlist);

var audio;
var playlist;
var tracks;
var current;
init();
function init(){
    current = 0;
    audio = $('#audio');
    playlist = $('#playlist');
    tracks = playlist.find('li a');
    len = tracks.length - 1;
    audio[0].volume = .10;
    audio[0].play();
    playlist.find('a').click(function(e){
        e.preventDefault();
        link = $(this);
        current = link.parent().index();
        run(link, audio[0]);
    });
    audio[0].addEventListener('ended',function(e){
        current++;
        if(current == len){
            current = 0;
            link = playlist.find('a')[0];
        }else{
            link = playlist.find('a')[current];    
        }
        run($(link),audio[0]);
    });
}

function run(link, player){
        player.src = link.attr('href');
        par = link.parent();
        par.addClass('active').siblings().removeClass('active');
        audio[0].load();
        audio[0].play();
}