/* eslint-disable no-fallthrough */
import $ from 'jquery';

export default (elements) => {
  // elements
  const $audioBrowser = elements.audioBrowser;
  const $videoBrowser = elements.videoBrowser;
  const $photoBrowser = elements.photoBrowser;
  const $playlist = elements.playlist;
  const $library = elements.library;
  const $volume = elements.volume;
  const $progress = elements.progress;
  const $audio = elements.audio;
  const $video = elements.video;
  const $photo = elements.photo;
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
  const PLAYER = {
    photo: 'player-photo',
    video: 'player-video',
    audio: 'player-audio',
  };
  const { floor, round, random } = Math;

  // GLOBAL VARIABLES
  let current; // current file name
  let sources = [];
  let isLoop = false;
  let isRandom = false;
  let player; // player depends on file type
  let playPromise;

  function changeState(state) {
    const { id } = player;
    switch (state) {
      case STOP:
        if (id !== PLAYER.photo && playPromise) {
          playPromise.then(() => player.pause());
          player.currentTime = 0;
        }
        if (id !== PLAYER.audio) {
          $(player)
            .hide()
            .parents('.window').removeClass('now-playing');
        }
        $playic.attr('class', icon.play);
        $stop.addClass('disabled');
        break;
      case PLAY:
        if (!sources.length) return;
        if (!player.src) player.src = sources[0].src;
        if (id !== PLAYER.photo) playPromise = player.play();
        if (id !== PLAYER.audio) {
          $(player)
            .show()
            .parents('.window').addClass('now-playing');
        }
        $playic.attr('class', icon.pause);
        $stop.removeClass('disabled');
        break;
      case PAUSE:
        if (id !== PLAYER.photo && playPromise) {
          playPromise.then(() => player.pause());
        }
        $playic.attr('class', icon.play);
        $stop.removeClass('disabled');
        break;
      case MUTE:
        player.muted = true;
        $muteic.attr('class', icon.mute);
        break;
      case SEEK:
        $progress.val(player.currentTime);
        $progress.css('background', `linear-gradient(to right, #0365c8 ${(player.currentTime / player.duration) * 100 - 1}%, transparent ${(player.currentTime / player.duration) * 100}%)`);
        break;
      default: // change volume
        player.muted = false;
        $volume.css('background', `linear-gradient(to right, #0365c8 ${player.volume * 100}%, transparent ${player.volume * 100}%)`);
        if (player.volume > 0.5) $muteic.attr('class', icon.high);
        else if (player.volume === 0) $muteic.attr('class', icon.mute);
        else $muteic.attr('class', icon.low);
    }
  }

  function navigate(direction) {
    if (!sources.length || sources.length === 1) return;

    let index = 0;
    let playable = false;
    const dir = (this && this.id) || direction;
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
    player.src = sources[index].src;
    changeState(playable ? PLAY : STOP);
  }

  function formatTime(time) {
    if (!time) return null;
    const newTime = floor(time);
    let hours = floor(newTime / 3600);
    let minutes = floor((newTime - (hours * 3600)) / 60);
    let seconds = newTime - (hours * 3600) - (minutes * 60);

    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${Number(hours) === 0 ? '' : `${hours}:`}${minutes}:${seconds}`;
  }

  function formatSize(size) {
    let format = 'KB';
    let newSize = size;
    if (size / 1024 ** 2 >= 1) format = 'MB';
    if (size / 1024 ** 3 >= 1) format = 'GB';
    switch (format) {
      case 'GB':
        newSize /= 1024;
      case 'MB':
        newSize /= 1024;
      default:
        newSize /= 1024;
    }
    return `${Number.isInteger(newSize) ? newSize : newSize.toFixed(1)} ${format}`;
  }

  function loadFile(file) {
    const { name, type } = file;
    let fileName = name.split('.');
    const ext = type ? fileName.pop() : 'mp3';
    fileName = fileName.join('.');

    function callback(resolve) {
      const data = URL.createObjectURL(file);
      let handle;
      sources.push({
        name: fileName,
        src: data,
      });
      if (type.includes('image')) {
        resolve({
          name: fileName,
          duration: '',
          size: formatSize(file.size),
          lastModified: new Date(file.lastModified).toLocaleDateString('en-US', dateOptions),
          type: ext.toLowerCase(),
        });
      } else if (type.includes('video')) handle = $('<video>');
      else handle = $('<audio>');
      handle.attr('src', data).on('loadedmetadata', () => {
        URL.revokeObjectURL(file);
        resolve({
          name: fileName,
          duration: formatTime(handle[0].duration),
          size: formatSize(file.size),
          lastModified: new Date(file.lastModified).toLocaleDateString('en-US', dateOptions),
          type: ext.toLowerCase(),
        });
      });
    }
    return new Promise(callback);
  }

  function handleFiles() {
    const { files } = this;

    if (!files.length) return;

    switch (this.id) {
      case 'player-open__photo':
        [player] = $photo;
        $library.text('Pictures');
        break;
      case 'player-open__video':
        [player] = $video;
        $library.text('Videos');
        break;
      case 'player-open__audio':
        [player] = $audio;
        $library.text('Music');
        break;
      default:
    }

    // clean up
    sources = [];
    current = null;
    player.removeAttribute('src');
    changeState(STOP);

    $prev.removeClass('disabled');
    $next.removeClass('disabled');

    // append header row
    const table = $('<table>').appendTo($playlist.empty());
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
    const promises = [];
    Array.from(files).forEach((file) => {
      const promise = loadFile(file);
      promises.push(promise);
      promise.then((data) => {
        $('<tr>', {
          appendTo: table,
          append: Object.values(data).map((value) => $('<td>', { text: value })),
          click() {
            current = $(this).find('td:first-child').text();
            player.src = sources.find((src) => current === src.name).src;
            changeState(PLAY);
          },
        });
      });
    });
    Promise.all(promises).then(() => table.addSortWidget());
  }

  // EVENT HANDLERS
  $audio.add($video).on('timeupdate', () => changeState(SEEK));
  $audio.add($video).on('loadedmetadata', () => {
    $progress.attr('max', player.duration);
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
  $audio.add($video).on('ended', () => {
    if (sources.length > 1) navigate('play-next');
    else if (isLoop) changeState(PLAY);
    else changeState(STOP);
  });

  $stop.click(() => changeState(STOP));
  $mute.click(() => changeState(player.muted ? null : MUTE));
  $play.click(() => changeState(player.paused ? PLAY : PAUSE));
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
    if (!player) return;
    player.volume = e.target.value / 100;
    changeState();
  });

  $progress.on('input', (e) => {
    if (!player) return;
    player.currentTime = e.target.value;
    changeState(SEEK);
  });

  $audioBrowser.on('change', handleFiles);
  $videoBrowser.on('change', handleFiles);
  $photoBrowser.on('change', handleFiles);
};
