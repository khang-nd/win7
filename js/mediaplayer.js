// function mediaplayer() {

//     // components
//     const $volume = $('#volume > input'),
//         $progress = $('#player-progress'),
//         $player = SC.Widget('player'),
//         $random = $('#random'),
//         $repeat = $('#repeat'),
//         $play = $('#play'),
//         $prev = $('#prev'),
//         $next = $('#next'),
//         $stop = $('#stop'),
//         $mute = $('#mute'),
//         $muteic = $('#mute > i'),
//         $playic = $('#play > i');

//     // states
//     const STOP = 0,
//         PLAY = 1,
//         PAUSE = 2,
//         MUTE = 3,
//         SEEK = 4;

//     const icon = {
//         play: 'fa fa-play ml-5',
//         pause: 'fa fa-pause',
//         mute: 'fa fa-volume-off',
//         low: 'fa fa-volume-down',
//         high: 'fa fa-volume-up'
//     };

//     let volume = 100,
//         cur = 0,
//         max = 0;

//     let tracks = [177671751];

//     const changeState = state => {
//         switch (state) {
//             case STOP:
//                 cur = 0;
//                 $player.pause().seekTo(cur);
//                 $playic.attr('class', icon.play);
//                 $stop.addClass('disabled');
//                 break;
//             case PLAY:
//                 $player.play();
//                 $playic.attr('class', icon.pause);
//                 $stop.removeClass('disabled');
//                 break;
//             case PAUSE:
//                 $player.pause();
//                 $playic.attr('class', icon.play);
//                 $stop.removeClass('disabled');
//                 break;
//             case MUTE:
//                 $player.setVolume(0);
//                 $muteic.attr('class', icon.mute);
//                 break;
//             case SEEK:
//                 $progress.attr('value', cur);
//                 $progress.css('background', `linear-gradient(to right, #0365c8 ${cur / max * 100}%, transparent ${cur / max * 100}%)`);
//                 break;
//             default:
//                 $player.setVolume(volume);
//                 $volume.css('background', `linear-gradient(to right, #0365c8 ${volume}%, transparent ${volume}%)`);
//                 if (volume > 50)
//                     $muteic.attr('class', icon.high);
//                 else if (volume > 0 && volume <= 50)
//                     $muteic.attr('class', icon.low);
//                 else
//                     $muteic.attr('class', icon.mute);
//         }
//     };

//     // player's event handlers
//     $player
//         .bind(SC.Widget.Events.PLAY, () => {
//             $player.getDuration(d => max = d);
//             $progress.attr('max', max);
//         })
//         .bind(SC.Widget.Events.PLAY_PROGRESS, e => {
//             cur = e.currentPosition;
//             changeState(SEEK);
//         });

//     // controls' event handlers
//     $volume.on('input', e => $(e.target).change());
//     $volume.change(e => {
//         volume = e.target.value;
//         changeState();
//     });

//     $progress.on('input', e => $(e.target).change());
//     $progress.change(e => {
//         cur = e.target.value;
//         $player.seekTo(cur);
//         changeState(SEEK);
//     });

//     $stop.click(() => changeState(STOP));
//     $mute.click(() => changeState($muteic.hasClass(icon.mute) ? null : MUTE));
//     $play.click(() => changeState($playic.hasClass(icon.play) ? PLAY : PAUSE));

// }