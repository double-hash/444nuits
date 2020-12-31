let headerHeight;

function loadingAnim(){
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    var headerInnerHeight = $('.header').height();
    headerHeight = $('.header').outerHeight(true);
    var headerMargins = headerHeight - headerInnerHeight;
    // console.log(headerHeight);
    // console.log(headerInnerHeight);
    // console.log(loaderPadding);
    // $('.loader').css('height', 'calc(100vh - ' + loaderPadding + 'px)')
    $('.header').append('<div class="loading-screen"></div>');
    $('.header').append('<div class="loader"></div>');
    $('.body').addClass('loading');
    // $('.header').css('position', 'fixed');
    // $('.header').css('top', 0);
    $('.sous-titre').css('transform', 'skewX(90deg)');
    $('.sous-titre').css('opacity', '0');
    $('.loader').css('height', window.innerHeight - headerMargins);
    // $('.main').css('margin-top', headerHeight);
    $('.body').imagesLoaded( function() {
        gsap.to($('.sous-titre'), {
            duration: 0.6,
            delay:1.4,
            y:0,
            skewX:0,
            opacity:4,
            ease: 'power3.inOut',
        });
        gsap.to($('.titre'), {
            duration:2,
            opacity:1,
            ease: 'power2.inOut',
            onComplete: function() {
                gsap.to($('.header .loader'), {
                    duration: 0.7,
                    height: headerInnerHeight,
                    ease: 'Power1.out',
                    onComplete : function() {
                        $('.body').removeClass('loading');
                        $('.header').css('position', 'sticky');
                        // $('.main').css('margin-top', 0);
                    }
                });
                gsap.to($('.loading-screen'), {
                    duration: 0.7,
                    // delay:0,
                    opacity: 0,
                    ease: 'Power2.in',
                    onComplete : function() {                            
                        $('.loading-screen').css('display', 'none');
                    // $('.loading-screen').css('display', 'none');
                    }
                });
            }
        });
    });
  }

window.dzAsyncInit = function(articles) {
    DZ.init({
        appId  : '447722', // final key
        // appId  : '447762', // test key
        channelUrl : 'http://127.0.0.1:5500/channel.html'
    });

    // articles.forEach(article => {})

    
    var articles = $('.article');
    // console.log(articles);
    $.each(articles, function(name, value) {
        // console.log(value);
        var article = value;
        let id = $(article).data("article-url");
        let rUrl = $(article).data("redirect-url");
        // Get data from /album/**articleID**/tracks
        DZ.api(id, function(response){
            // console.log(response);
            response.data.forEach(element => {
                var duration = {
                    minutes : 0,
                    seconds : 0
                };
                duration.minutes = Math.floor(element.duration / 60);
                duration.seconds = element.duration % 60;
    
                if (duration.minutes < 10) {
                    duration.minutes = '0'+ duration.minutes;
                }
    
                var player = new Player(element.preview);
                var domElement = '<li class="article__item"><h2>' + element.title + '</h2><div class="points"></div><p>'+ duration.minutes +':' + duration.seconds +'</p>'+ player.domElement +'<a href="'+rUrl+'" class="item__more" target="_blank"><span class="more--icon">+</span><svg class="player__progress" viewBox="0 0 50 50" data-value="50" xmlns="http://www.w3.org/2000/svg" ><style>.player__progressbar{fill:none;stroke-miterlimit:round;transition:stroke-dashoffset 500ms ease-in-out;stroke-dasharray:200;stroke-dashoffset:200}</style><path class="player__progressbg" d="M2.5,25a22.5,22.5 0 1,0 45,0a22.5,22.5 0 1,0 -45,0" fill="none"/></svg></a></li>'
                $(article).find('.article__main').append(domElement);
                // console.log($('.main'))
                player.init();
                $(article).find('.player__icon--pause').css('display','none'); 
            });
        });
    });
    // Get data from /album/120441792/tracks
    
};                


$(function() {
	// var e = document.createElement('script');
	// e.src = 'https://cdns-files.dzcdn.net/js/min/dz.js';
    // e.async = true;
    // if (document.getElementById('dz-root')) {
    //     document.getElementById('dz-root').appendChild(e);
    // }
    $('.player__icon--pause').css('display','none'); 
    let playingAudio;
    let needNewPlaylist = true;
    let nowPlaying = {
    }

    nowPlaying.album, nowPlaying.cover = "2016-2018"
    nowPlaying.artist = "Népal"
    
    var aud = $('#current-playlist').children('audio[data-playing="true"]')[0];

    if (typeof aud !== "undefined") {
        addSongName($(aud).data('name'));
    }
    
    if ('mediaSession' in navigator) {
      
        navigator.mediaSession.setActionHandler('play', function() { 
            playPauseTrack();
         });
        navigator.mediaSession.setActionHandler('pause', function() { 
            playPauseTrack();
         });
        // navigator.mediaSession.setActionHandler('stop', function() { /* Code excerpted. */ });
        // navigator.mediaSession.setActionHandler('seekbackward', function() { /* Code excerpted. */ });
        // navigator.mediaSession.setActionHandler('seekforward', function() { /* Code excerpted. */ });
        // navigator.mediaSession.setActionHandler('seekto', function() { /* Code excerpted. */ });
        navigator.mediaSession.setActionHandler('previoustrack', function() { 
            prevTrack();
         });
        navigator.mediaSession.setActionHandler('nexttrack', function() {
            nextTrack();
         });
        // navigator.mediaSession.setActionHandler('skipad', function() { /* Code excerpted. */ });
      }

    $('.body').on('click', '.player--main', function(e) {
        // console.log(playingAudio);
        if ($(e.target).hasClass('player__icon--next')) {
            nextTrack();
        }
        else if ($(e.target).hasClass('player__icon--prev')) {
            prevTrack();

        }
        else if ($(e.target).hasClass('player__icon--play') || $(e.target).hasClass('player__icon--pause')){
            playPauseTrack();
        }
    });

    function nextTrack(){
        // console.log('next');
            
        var aud = $('#current-playlist').children('audio[data-playing="true"]')[0];
        var next = $(aud).next()[0];
        
        // aud.currentTime = 0;
        aud.pause();
        if (typeof next !== "undefined") {
            next.play();
            
            if ('mediaSession' in navigator) {
                    navigator.mediaSession.playbackState = "playing";
            }
            $('.player__icon--pause').css('display','none');
            $('.player__icon--play').css('display','block');
            $('.player--main .player__icon--play').css('display','none');
            $('.player--main .player__icon--pause').css('display','block');
        }
        else {
            next = $('#current-playlist').children('audio')[0];
            if ('mediaSession' in navigator) {
                    navigator.mediaSession.playbackState = "paused";
            }
            $('.player__icon--pause').css('display', 'none');
            $('.player__icon--play').css('display', 'block');
        }
        
        $('#current-playlist audio').attr('data-playing','false');
        $('#current-playlist audio[src="' + $(next).attr('src') + '"]').attr('data-playing','true');
        
        if (typeof playingAudio !== "undefined") {
            playingAudio.currentTime = 0;
            playingAudio.pause();
        }
        
        // updatePagePlayer(aud);
        updatePagePlayer(next);

        // playingAudio = next;
        updateAudio(next);

        addSongName($(next).data('name'));
    }

    function prevTrack() {
                   // console.log('pprev');
            
                   var aud = $('#current-playlist').children('audio[data-playing="true"]')[0];
                   var next = $(aud).prev()[0];
                   
                   aud.pause();
                   if(typeof next == "undefined"){
                       next = $('#current-playlist').children('audio')[0];
                       if ('mediaSession' in navigator) {
                           navigator.mediaSession.playbackState = "paused";
                       }
                       $('.player__icon--pause').css('display','none');
                       $('.player__icon--play').css('display','block');
                       $('.player--main .player__icon--play').css('display','none');
                       $('.player--main .player__icon--pause').css('display','block');
                   }
                   else {
                       next.play();
                       if ('mediaSession' in navigator) {
                            navigator.mediaSession.playbackState = "playing";
                       }
                       $('.player--main .player__icon--play').css('display', 'none');
                       $('.player--main .player__icon--pause').css('display', 'block');
                   }
                   // console.log(next);
                   $('#current-playlist audio').attr('data-playing','false');
                   $('#current-playlist audio[src="' + $(next).attr('src') + '"]').attr('data-playing','true');
                   
                   
                   // console.log(aud);
                   // aud.currentTime = 0;
                   
                   // aud.pause();
                   // next.play();
                   
                   if (typeof playingAudio !== "undefined") {
                       playingAudio.currentTime = 0;
                       playingAudio.pause();
                   }
                   
                //    updatePagePlayer(aud);
                   updatePagePlayer(next);
       
       
                   
                   // playingAudio = next;
                   updateAudio(next);
       
                   addSongName($(next).data('name'));
    }

    function playPauseTrack(){
        // player = $(this);
        var aud = $('#current-playlist').children('audio[data-playing="true"]')[0];
        // console.log(aud.src)
        var pAud = $('*[data-local-url] .player audio[src="' + $(aud).attr('src') + '"]');
        // console.log(pAud);
        var dAud = $('*[data-article-url] .player.playing audio')[0];

        if (typeof dAud !== 'undefined'){
            $('.playing').removeClass('playing');
            dAud.pause();
        }
        
        let pPath;
        if (aud.paused == true) {
            aud.play();
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = "playing";
            }
            $('.player__icon--pause').css('display','none');
            $('.player__icon--play').css('display','block');
            $('.player--main .player__icon--play').css('display','none');
            $('.player--main .player__icon--pause').css('display','block');
            // console.log($(pAud).siblings('.player__btn').find('.player__icon--pause'));
            if (typeof pAud !== "undefined") {
                $(pAud).siblings('.player__btn').find('.player__icon--pause').css('display','block');
                $(pAud).siblings('.player__btn').find('.player__icon--play').css('display','none');
            }
        }
        else {
            aud.pause();
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = "paused";
            }
            $('.player__icon--pause').css('display','none');
            $('.player__icon--play').css('display','block');
            // $('.player__playicon').html('▶');
        }
        let path = $('.player--main path.player__progressbar')[0];
        pPath = $(pAud).siblings('.player__btn').find('path.player__progressbar')[0];
        aud.ontimeupdate = function(){
            let value = aud.currentTime / aud.duration * 100
            let length = path.getTotalLength();
            let to = length *( value / 100);
            // Trigger Layout in Safari Hack 
            // https://jakearchibald.com/2013/animated-line-drawing-svg/
            path.getBoundingClientRect();
            path.style.strokeDashoffset = Math.max(0, 200-to); 
            if (typeof pPath !== "undefined") {
                pPath.getBoundingClientRect();
                pPath.style.strokeDashoffset = Math.max(0, 200-to); 
            }
        } 
    }

    $('.body').on('click', '*[data-local-url] .player', function() {
        player = $(this);
        $('.player--main').addClass('playing');
        var aud = $(this).children('audio')[0];
        
        nowPlaying.album = $.trim($(this).parents('.article').data('album'));

        if (needNewPlaylist == true) {
            var playlist = $('[data-local-url] .player audio');
            playlist = $(playlist).clone();
            
            nowPlaying.artist = $.trim($('.header__title--main').text());

            $('#current-playlist').html('');
            $("#current-playlist").append(playlist);
            needNewPlaylist = false;
        }

        $('#current-playlist audio').attr('data-playing','false');
        $('#current-playlist audio[src="' + $(aud).attr('src') + '"]').attr('data-playing','true');

        aud = $('#current-playlist audio[data-playing="true"]')[0];
        var src = $(aud).attr('src');
        var destSrc;
        
        if (typeof playingAudio  !== "undefined") {
            destSrc = $(playingAudio).attr('src');
        }
        // console.log(src, destSrc);
        if (src !== destSrc){
            $('.player__icon--pause').css('display','none');
            $('.player__icon--play').css('display','block');
            $(this).find('.player__icon--play').css('display','none');
            $(this).find('.player__icon--pause').css('display','block');
            $('.player--main .player__icon--play').css('display','none');
            $('.player--main .player__icon--pause').css('display','block');
            aud.play();
        }
        else {
            if (aud.paused == false) {
                aud.pause();
                $(this).find('.player__icon--pause').css('display','none');
                $(this).find('.player__icon--play').css('display','block');
                $('.player--main .player__icon--pause').css('display','none');
                $('.player--main .player__icon--play').css('display','block');
            }
            else {
                aud.play();
                $('.player__icon--pause').css('display','none');
                $('.player__icon--play').css('display','block');
                $(this).find('.player__icon--play').css('display','none');
                $(this).find('.player__icon--pause').css('display','block');
                $('.player--main .player__icon--play').css('display','none');
                $('.player--main .player__icon--pause').css('display','block');
            }
        }
        
        if (playingAudio && playingAudio !== aud) {
            playingAudio.currentTime = 0;
            playingAudio.pause();
        }
        
  
        // playingAudio = aud;
        updateAudio(aud);
        
        addSongName($(aud).data('name'));
        
        

        let playerpath = $(this).find('path.player__progressbar')[0];
        let mainplayerpath = $('.player--main path.player__progressbar')[0];
        aud.ontimeupdate = function(){
            let value = aud.currentTime / aud.duration * 100
            let length = playerpath.getTotalLength();
            let to = length *( value / 100);
            // Trigger Layout in Safari Hack 
            // https://jakearchibald.com/2013/animated-line-drawing-svg/
            playerpath.getBoundingClientRect();
            playerpath.style.strokeDashoffset = Math.max(0, 200-to); 
            mainplayerpath.getBoundingClientRect();
            mainplayerpath.style.strokeDashoffset = Math.max(0, 200-to); 
        } 
    });
    
    $('.body').on('click', '*[data-article-url] .player', function() {
        $('.playing').removeClass('playing');
        player = $(this);
        player.addClass('playing');
        var aud = $(this).children('audio')[0];
        var playerAud = $('[data-playing="true"]')[0];
        playerAud.pause();
        // var src = aud.src;
        // aud = $(aud).clone();
        // var name = $(this).siblings('h2')[0];
        // name = $(name).text();
        // $(aud).attr("data-name", name);
        // var plAudio = $('#current-playlist').children('audio')[0];
        // var destSrc;
        // if (typeof plAudio  !== "undefined") {
        //     destSrc = plAudio.src;
        // }
        // if (src !== destSrc){
        //     $('.player__icon--pause').css('display','none');
        //     $('.player__icon--play').css('display','block');
        //     $(this).find('.player__icon--play').css('display','none');
        //     $(this).find('.player__icon--pause').css('display','block');
        //     $('.player--main .player__icon--play').css('display','none');
        //     $('.player--main .player__icon--pause').css('display','block');
        //     $('#current-playlist').html('');
        //     $('#current-playlist').append(aud);
        //     aud = $('#current-playlist').children('audio')[0];
        // aud.play();
        if (playingAudio && playingAudio !== aud) {
            playingAudio.pause();
            if ($(playingAudio).parents('.article').length){
                // console.log('wesh');
                playingAudio.currentTime = 0;
                playingAudio = aud;
            }
        }
        //     addSongName($(aud).data('name'));
        // }
        // else {
            // if (typeof plAudio  !== "undefined") {
            //     aud = plAudio;
            // }
            // console.log('test');
            // aud.pause();
            // $(this).find('.player__icon--pause').css('display','none');
            // $(this).find('.player__icon--play').css('display','block');
        if (aud.paused) {
            aud.play();
            $('.player__icon--pause').css('display','none');
            $('.player__icon--play').css('display','block');
            $(this).find('.player__icon--play').css('display','none');
            $(this).find('.player__icon--pause').css('display','block');
            // $('.player__playicon').html('&#9614;&nbsp;&#9614;');
            playingAudio = aud;
        }
        else {
            aud.pause();
            $(this).find('.player__icon--pause').css('display','none');
            $(this).find('.player__icon--play').css('display','block');
            // $('.player__playicon').html('▶');
        }
        // }
        // if (aud.paused){
        //     aud.play();
        // }
        // else {
        //     aud.pause();
        // }
        let playerpath = $(this).find('path.player__progressbar')[0];
        aud.ontimeupdate = function(){
            let value = aud.currentTime / aud.duration * 100
            let length = playerpath.getTotalLength();
            let to = length *( value / 100);
            // Trigger Layout in Safari Hack 
            // https://jakearchibald.com/2013/animated-line-drawing-svg/
            playerpath.getBoundingClientRect();
            playerpath.style.strokeDashoffset = Math.max(0, 200-to); 
        } 
    });

    // $('.body').on('click', '.article__video', function() {
    //     console.log('iframe');
    // });

    function addSongName(name){
        // console.log($('#album-name').text());
        // console.log($('.header__title--main').text());
        if (typeof nowPlaying.cover !== "undefined") {
            $('.song-title').text(name);
            defilingText();
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: name,
                    artist: nowPlaying.artist,
                    album: nowPlaying.album,
                    // artwork: $(cover).attr('src'),
                    artwork: [
                    { src: './assets/img/' + nowPlaying.cover +'--128-128.png' , sizes: '128x128', type: 'image/png' },
                    { src:  './assets/img/' + nowPlaying.cover +'.jpg', sizes: '512x512', type: 'image/jpg' },
                    ]
                });
            }
        }
        else {
            $('.song-title').text(name);
            defilingText();
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: name,
                    artist: nowPlaying.artist,
                    album: nowPlaying.album,
                });
            }
        }
    }

    function defilingText() {
        $('.song-title').removeClass('defiling');
        if ($('.song-title').width() >= $('.now-playing').width()) {
            $('.song-title').addClass('defiling');
        }
    }

    function updateAudio(aud){
        cover = $(aud).data('pic');
        playingAudio = aud;
        
        nowPlaying.title = $(aud).data('name');
        nowPlaying.cover = $(aud).data('pic');


        aud.addEventListener('ended',function(){
            nextTrack();
        });
    }

    function updatePagePlayer(aud){
        var src = $(aud).attr('src');
        var pAud = $('[data-local-url] .player audio[src="' + $(aud).attr('src') + '"]');

        // if (typoepAud) {
        // }

        mainplayerpath = $('.player--main path.player__progressbar')[0];

        $('.player__progressbar').each(function(){
            this.getBoundingClientRect();
            this.style.strokeDashoffset = Math.max(0, 200); 
        })

        if (pAud.length > 0) {
            nowPlaying.album = $.trim($(pAud).parents('.article').data('album'));
            $('.article .player__icon--play').css('display','block');
            $('.article .player__icon--pause').css('display','none');
            if (aud.paused == false) {
                $(pAud).siblings('.player__btn').find('.player__icon--pause').css('display','block');
                $(pAud).siblings('.player__btn').find('.player__icon--play').css('display','none');
            }
            pPath = $(pAud).siblings('.player__btn').find('path.player__progressbar')[0];

            aud.ontimeupdate = function(){
                let value = aud.currentTime / aud.duration * 100
                let length = mainplayerpath.getTotalLength();
                let to = length *( value / 100);
                // Trigger Layout in Safari Hack 
                // https://jakearchibald.com/2013/animated-line-drawing-svg/
                if (typeof pPath !== "undefined") {
                        pPath.getBoundingClientRect();
                        pPath.style.strokeDashoffset = Math.max(0, 200-to); 
                }
                mainplayerpath.getBoundingClientRect();
                mainplayerpath.style.strokeDashoffset = Math.max(0, 200-to); 
            } 
        }
    }

    function initMainPlayer(){
        let aud = $('#current-playlist audio[data-playing="true"]')[0];
        if (aud.paused) {
            let playerpath = $('.player--main path.player__progressbar')[1];
            let value = aud.currentTime / aud.duration * 100
            let length = playerpath.getTotalLength();
            let to = length *( value / 100);
            // Trigger Layout in Safari Hack 
            // https://jakearchibald.com/2013/animated-line-drawing-svg/
            playerpath.getBoundingClientRect();
            playerpath.style.strokeDashoffset = Math.max(0, 200-to);
            $('.player--main').addClass('playing'); 
        }
        else {
            $('.player--main .player__icon--play').css('display','none');
            $('.player--main .player__icon--pause').css('display','block');
            $('.player--main').addClass('playing');
        }
        if (typeof $(aud).data('name')  !== "undefined") {
            $('.song-title').text($(aud).data('name'));
        }
        defilingText();
        // console.log($(aud).data('name'));
        let playerpath = $('.player--main path.player__progressbar')[1];
        aud.ontimeupdate = function(){
            let value = aud.currentTime / aud.duration * 100
            let length = playerpath.getTotalLength();
            let to = length *( value / 100);
            // Trigger Layout in Safari Hack 
            // https://jakearchibald.com/2013/animated-line-drawing-svg/
            playerpath.getBoundingClientRect();
            playerpath.style.strokeDashoffset = Math.max(0, 200-to); 
        } 
    }

    let headerPadding = parseInt($('.header').css('margin-top'));
    barba.init({
        cacheIgnore: true,
        views: [{
            namespace: 'home',
            beforeEnter() {
                if (window.pageYOffset > headerPadding){
                    document.body.scrollTop = headerPadding; // For Safari
                    document.documentElement.scrollTop = headerPadding; // For Chrome, Firefox, IE and Opera
                }
                else {
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                }
                $('.player__icon--pause').css('display','none'); 
                // loadingAnim();
                // initMainPlayer();
                initMainPlayer();
            },
            afterEnter() {
                // refresh the parallax based on new page content
                // parallax.refresh();
            }
        },
        {
            namespace: 'page',
            beforeEnter(){
                if (window.pageYOffset > headerPadding){
                    document.body.scrollTop = headerPadding; // For Safari
                    document.documentElement.scrollTop = headerPadding; // For Chrome, Firefox, IE and Opera
                }
                else {
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                }
                $('.player__icon--pause').css('display','none'); 
                //launching deezer API
                // TODO : penser aux projets pas présents sur deezer
                window.dzAsyncInit($('.article'));
                // console.log($('.article'));
                // $('.article').forEach(article => {
                //     window.dzAsyncInit(article);
                // })
                initMainPlayer();
            },
            afterEnter(){
                needNewPlaylist = true;
            }
        }],
        transitions: [{
            name: 'opacity-transition',
            leave(data) {
                // $('.header').css('position','fixed');
                // $('.header').css('margin-top', 0);
                // $('.main').css('margin-top', headerHeight);
                return gsap.to(data.current.container, {
                    duration:0.5,
                    ease: 'Power1.out',
                    opacity: 0
                });
            },
            enter(data) {
                return gsap.from(data.next.container, {
                    duration:0.5,
                    ease: 'Power1.in',
                    opacity: 0
                });
            }
        }]
    });
});

(function($) {
    loadingAnim();
})(jQuery);



class Player {
    constructor(url) {
        this.url = url;
        this.audio = 
        // this.container = $(container);
        this.domElement = '<div class="player" data-url="'+ url +'"><div class="player__btn"><div class="player__icon player__icon--play"></div><div class="player__icon player__icon--pause" ></div> <svg class="player__progress" viewBox="0 0 50 50" data-value="50" xmlns="http://www.w3.org/2000/svg" ><style>.player__progressbar{fill:none;stroke-miterlimit:round;transition:stroke-dashoffset 500ms ease-in-out;stroke-dasharray:200;stroke-dashoffset:200}</style><path class="player__progressbg" d="M2.5,25a22.5,22.5 0 1,0 45,0a22.5,22.5 0 1,0 -45,0" fill="none"/> <path class="player__progressbar" d="M2.5,25a22.5,22.5 0 1,0 45,0a22.5,22.5 0 1,0 -45,0" fill="none"/> </svg></div> <audio src="'+ url +'" loop></audio></div>';
        // return this.domElement;
    }

    init(){
        let aud = $('.player[data-url="'+this.url+'"]').find('audio')[0];
        let path = $('.player[data-url="'+this.url+'"]').find('path.player__progressbar')[0];
        aud.ontimeupdate = function(){
            let value = aud.currentTime / aud.duration * 100
            let length = path.getTotalLength();
            let to = length *( value / 100);
            // Trigger Layout in Safari Hack 
            // https://jakearchibald.com/2013/animated-line-drawing-svg/
            path.getBoundingClientRect();
            path.style.strokeDashoffset = Math.max(0, 200-to); 
        } 
    }


    // ontimeupdate(){
    //     return this.ontimeupdate
    // }
}