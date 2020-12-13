let headerHeight;

function loadingAnim(){
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    headerHeight = $('.header').outerHeight(true);
    $('.header').append('<div class="loading-screen"></div>');
    $('.header').append('<div class="loader"></div>');
    $('.body').addClass('loading');
    $('.header').css('position', 'fixed');
    $('.sous-titre').css('transform', 'skewX(90deg)');
    $('.sous-titre').css('opacity', '0');
    $('.main').css('margin-top', headerHeight);
    // $('.body').imagesLoaded( function() {
        gsap.to($('.sous-titre'), {
            duration: 0.6,
            delay:1.4,
            y:0,
            skewX:0,
            opacity:4,
            ease: 'power4.inOut',
        });
        gsap.to($('.titre'), {
            duration:2,
            opacity:1,
            ease: 'power2.inOut',
            onComplete: function() {
                gsap.to($('.header .loader'), {
                    duration: 0.7,
                    height: 90,
                    ease: 'power2.inOut',
                    onComplete : function() {
                        $('.body').removeClass('loading');
                        $('.header').css('position', 'sticky');
                        $('.main').css('margin-top', 0);
                    }
                });
                gsap.to($('.loading-screen'), {
                    duration: 1,
                    delay:0.7,
                    opacity: 0,
                    ease: 'Power1.in',
                    onComplete : function() {                            $('.loading-screen').css('display', 'none');
                        $('.loading-screen').css('display', 'none');
                    }
                });
            }
        });
    // });
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
        // console.log(id + " " + rUrl);
        // Get data from /album/120441792/tracks
        DZ.api(id, function(response){
            console.log(response);
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
                $('.player__icon--pause').css('display','none'); 
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
    $('.body').on('click', '.player', function() {
        player = $(this);
        var aud = $(this).children('audio')[0];
        if (aud.paused) {
            if (playingAudio && playingAudio !== aud) {
                playingAudio.currentTime = 0;
                playingAudio.pause();
            }
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
        let path = $(this).find('path.player__progressbar')[0];
        aud.ontimeupdate = function(){
            let value = aud.currentTime / aud.duration * 100
            let length = path.getTotalLength();
            let to = length *( value / 100);
            // Trigger Layout in Safari Hack 
            // https://jakearchibald.com/2013/animated-line-drawing-svg/
            path.getBoundingClientRect();
            path.style.strokeDashoffset = Math.max(0, 200-to); 
        } 
    });
    
 
    barba.init({
        cacheIgnore: true,
        views: [{
            namespace: 'home',
            beforeEnter() {
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                // update the menu based on user navigation
                $('.player__icon--pause').css('display','none'); 
                // loadingAnim();
            },
            afterEnter() {
                // refresh the parallax based on new page content
                // parallax.refresh();
            }
        },
        {
            namespace: 'page',
            beforeEnter(){
                $('.player__icon--pause').css('display','none'); 
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                //launching deezer API
                // TODO : penser aux projets pas présents sur deezer
                window.dzAsyncInit($('.article'));
                // console.log($('.article'));
                // $('.article').forEach(article => {
                //     window.dzAsyncInit(article);
                // })
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