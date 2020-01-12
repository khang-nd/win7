/* eslint-disable no-underscore-dangle */
const padZero = (o) => (o < 10 ? `0${o}` : o);
const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
let today;
let h;
let m;
let s;
let d;
let D;
let M;
let Y;
let offset = 0;

export const getDateTime = () => {
  today = new Date();
  d = today.getDay();
  D = today.getDate();
  M = today.getMonth();
  Y = today.getFullYear();
  h = today.getHours();
  m = today.getMinutes();
  s = today.getSeconds();

  return {
    D: padZero(D),
    M: padZero(M + 1),
    Y: padZero(Y),
    h: padZero(h),
    m: padZero(m),
    s: padZero(s),
  };
};

export const navigate = (e) => {
  if (e) {
    switch (e.target.id) {
      case 'prev':
        offset -= 1;
        break;
      case 'next':
        offset += 1;
        break;
      default:
        offset = 0;
    }
  }
  today = new Date(Y, M + offset);
  const _M = today.getMonth();
  const _Y = today.getFullYear();
  today.setDate(1);

  return {
    d: DAYS[d],
    D,
    M,
    Y,
    _M,
    _Y,
    month: MONTHS[M],
    _month: MONTHS[_M],
    start: today.getDay(),
    end: _Y % 4 === 0 && _M === 1 ? MDAYS[_M] + 1 : MDAYS[_M],
  };
};
