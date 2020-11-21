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