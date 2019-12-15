/* eslint-disable func-names */
/* eslint-disable no-undef */
module.exports = (elements) => {
  // elements
  const $audioBrowser = elements.audioBrowser;
  const $videoBrowser = elements.videoBrowser;
  const $photoBrowser = elements.photoBrowser;
  const $playlist = elements.playlist;
  const $volume = elements.volume;
  const $progress = elements.progress;
  const $audio = elements.audio[0];
  const $video = elements.video[0];
  const $random = elements.random;
  const $loop = elements.loop;
  const $play = elements.play;
  const $prev = elements.prev;
  const $next = elements.next;
  const $stop = elements.stop;
  const $mute = elements.mute;
  const $muteic = $mute.find('>i');
  const $playic = $play.find('>i');
  const dateOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  // states
  const STOP = 0;
  const PLAY = 1;
  const PAUSE = 2;
  const MUTE = 3;
  const SEEK = 4;

  const icon = {
    play: 'fa fa-play ml-5',
    pause: 'fa fa-pause',
    mute: 'fa fa-volume-off',
    low: 'fa fa-volume-down',
    high: 'fa fa-volume-up',
  };

  let current; // current file name
  let sources = [];
  let isLoop = false;
  let isRandom = false;
  const { round, random } = Math;

  const changeState = (state) => {
    switch (state) {
      case STOP:
        $audio.pause();
        $audio.currentTime = 0;
        $playic.attr('class', icon.play);
        $stop.addClass('disabled');
        break;
      case PLAY:
        if (!sources.length) return;
        if (!$audio.src) $audio.src = sources[0].src;
        $audio.play();
        $playic.attr('class', icon.pause);
        $stop.removeClass('disabled');
        break;
      case PAUSE:
        $audio.pause();
        $playic.attr('class', icon.play);
        $stop.removeClass('disabled');
        break;
      case MUTE:
        $audio.muted = true;
        $muteic.attr('class', icon.mute);
        break;
      case SEEK:
        $progress.val($audio.currentTime);
        $progress.css('background', `linear-gradient(to right, #0365c8 ${($audio.currentTime / $audio.duration) * 100 - 1}%, transparent ${($audio.currentTime / $audio.duration) * 100}%)`);
        break;
      default: // change volume
        $audio.muted = false;
        $volume.css('background', `linear-gradient(to right, #0365c8 ${$audio.volume * 100}%, transparent ${$audio.volume * 100}%)`);
        if ($audio.volume > 0.5) $muteic.attr('class', icon.high);
        else if ($audio.volume === 0) $muteic.attr('class', icon.mute);
        else $muteic.attr('class', icon.low);
    }
  };

  const navigate = function (direction) {
    if (!sources.length || sources.length === 1) return;

    let index = 0;
    let playable = false;
    const dir = this.id || direction;
    if (current) {
      const max = sources.length - 1;
      index = sources.indexOf(sources.find((src) => current === src.name));
      if (isRandom) {
        playable = true;
        index = (function randomize(i) {
          const number = round(random() * max);
          return number === i ? randomize(i) : number;
        }(index));
      } else if (dir === 'play-next') {
        playable = index < max || isLoop;
        index = index === max ? 0 : index + 1;
      } else {
        index = index === 0 ? max : index - 1;
      }
    }
    current = sources[index].name;
    $audio.src = sources[index].src;
    changeState(playable ? PLAY : STOP);
  };

  File.prototype.isAccepted = function (formats) {
    const split = this.name.split('.');
    const ext = split[split.length - 1];
    return formats.indexOf(ext) > -1;
  };

  const formatTime = function (time) {
    let minute = time / 60;
    let second = round(time % 60);
    minute = minute.toFixed(0);
    second = second <= 9 ? `0${second}` : second;
    return `${minute}:${second}`;
  };

  const handleFiles = function () {
    const { files, accept } = this;

    if (!files.length) return;

    const formats = accept.split(',').map((ext) => ext.substring(1));
    const validFiles = Array.from(files).filter((file) => file.isAccepted(formats));

    if (!validFiles) return;

    const table = $('<table>').appendTo($playlist.empty());

    if (this.id === 'player-open__photo') {
      console.log('photo');
    } else {
      // clean up
      sources = [];
      current = null;
      $audio.removeAttribute('src');
      changeState(STOP);

      $prev.attr('class', `player-control ${validFiles.length > 1 ? '' : 'disabled'}`);
      $next.attr('class', `player-control ${validFiles.length > 1 ? '' : 'disabled'}`);

      // append header row
      $('<tr>', {
        appendTo: table,
        append: [
          $('<th>', { text: 'Title' }),
          $('<th>', { text: 'Length' }),
          $('<th>', { text: 'Size' }),
          $('<th>', { text: 'Last Modified' }),
          $('<th>', { text: 'Type' }),
        ],
      });

      // append row for each file
      $.each(validFiles, (index, file) => {
        const reader = new FileReader();
        const fileName = file.name.split('.');
        const fileExt = fileName.pop();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
          const data = e.target.result;
          const audio = new Audio(data);
          audio.onloadedmetadata = () => {
            sources.push({
              name: fileName.join('.'),
              src: data,
            });
            $('<tr>', {
              appendTo: table,
              append: [
                $('<td>', { text: fileName.join('.') }),
                $('<td>', { text: formatTime(audio.duration) }),
                $('<td>', { text: `${(file.size / 1024 / 1024).toFixed(1)} MB` }),
                $('<td>', { text: new Date(file.lastModified).toLocaleDateString('en-US', dateOptions) }),
                $('<td>', { text: fileExt }),
              ],
              click() {
                current = $(this).find('td:first-child').text();
                $audio.src = sources.find((src) => current === src.name).src;
                changeState(PLAY);
              },
            });

            if (index === validFiles.length - 1) table.addSortWidget();
          };
        };
      });
    }
  };

  // EVENT HANDLERS
  $audio.addEventListener('timeupdate', () => changeState(SEEK));
  $audio.addEventListener('loadedmetadata', () => {
    $progress.attr('max', $audio.duration);
    $playlist.find('tr').removeClass('active');
    if (current) {
      $playlist
        .find('td:first-child').filter((_, td) => $(td).text() === current)
        .parent().addClass('active');
    } else {
      current = $playlist
        .find('tr:nth-child(2)').addClass('active')
        .find('td:first-child').text();
    }
  });
  $audio.addEventListener('ended', () => {
    if (sources.length > 1) navigate('play-next');
    else if (isLoop) changeState(PLAY);
    else changeState(STOP);
  });

  $stop.click(() => changeState(STOP));
  $mute.click(() => changeState($audio.muted ? null : MUTE));
  $play.click(() => changeState($audio.paused ? PLAY : PAUSE));
  $prev.click(navigate);
  $next.click(navigate);
  $loop.click(() => {
    $loop.toggleClass('active');
    isLoop = !isLoop;
  });
  $random.click(() => {
    $random.toggleClass('active');
    isRandom = !isRandom;
  });

  $volume.on('input', (e) => {
    $audio.volume = e.target.value / 100;
    changeState();
  });

  $progress.on('input', (e) => {
    $audio.currentTime = e.target.value;
    changeState(SEEK);
  });

  $audioBrowser.on('change', handleFiles);
  $videoBrowser.on('change', handleFiles);
  $photoBrowser.on('change', handleFiles);
};
