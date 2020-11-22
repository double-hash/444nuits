// document.querySelectorAll('path.player__progressbar').forEach(path => {
//     let length = path.getTotalLength();
//     let maxValue = 100;
//     let value = parseInt(path.parentNode.getAttribute('data-value'));
//     let to = length *( value / 100);
//     console.log(to);
//     console.log(length);
//     // Trigger Layout in Safari Hack 
//     // https://jakearchibald.com/2013/animated-line-drawing-svg/
//     path.getBoundingClientRect();
//     path.style.strokeDashoffset = Math.max(0, 200-to);  
//   });


$(
function(){
    var aud = $('audio')[0];
    $('.player__btn').on('click', function(){
        if (aud.paused) {
            aud.play();
            $('.player__playicon').html('⏸');
        }
        else {
            aud.pause();
            $('.player__playicon').html('&nbsp;▶');
        }
    })
    aud.ontimeupdate = function(){
        updatePlayer(aud.currentTime / aud.duration * 100)
    }
})


function updatePlayer(value) {
    let path = document.querySelectorAll('path.player__progressbar')[0];
    let length = path.getTotalLength();
    let to = length *( value / 100);
    console.log(to);
    // Trigger Layout in Safari Hack 
    // https://jakearchibald.com/2013/animated-line-drawing-svg/
    path.getBoundingClientRect();
    path.style.strokeDashoffset = Math.max(0, 200-to);  
}

// init Masonry
// var $grid = 
// $('.main--feed').masonry({
//     // options...
//     itemSelector: '.work--item',
//     columnWidth: '.grid-sizer',
//   });
// // layout Masonry after each image loads
// $grid.imagesLoaded().progress( function() {
//     $grid.masonry('layout');
// });


// gsap.to($('.loader'), {
//     duration: 2,
//     height: 0, 
//     //onUpdate fires each time the tween updates; we'll explain callbacks later.
//     // onUpdate: function() {
//     //   console.log(obj.prop); //logs the value on each update.
//     // }
//   });
loadingAnim();

function loadingAnim(){
    $('.header').append('<div class="loading-screen"></div>');
    $('.header').append('<div class="loader"></div>');
    $('.body').addClass('loading');
    // $('.loader').css('height', '100vh')
    $('.body').imagesLoaded( function() {
        // setTimeout(() => {
            gsap.to($('.sous-titre'), {
                duration: 0.3,
                delay:1.7,
                y:0,
                skewX:0,
                ease: 'ease.in',
                onComplete : function() {
                    $('.body').removeClass('loading');
                }
            });
            gsap.to($('.titre'), {
                duration:2,
                opacity:1,
                ease: 'power2.inOut',
                onComplete: function() {
                    gsap.to($('.header .loader'), {
                        duration: 0.8,
                        delay:0.3,
                        height: 90,
                        ease: 'power2.out',
                        onComplete : function() {
                        }
                    });
                    gsap.to($('.loading-screen'), {
                        duration: 1,
                        delay:0.5,
                        opacity: 0,
                        ease: 'ease.in',
                        onComplete : function() {
                            $('.loading-screen').css('display', 'none');
                        }
                    });
                }
            });
        // }, 3000);
    });
  }