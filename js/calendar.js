var Calendar = function () {

    const padZero = o => (o < 10 ? "0" + o : o);
    const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const DAYS = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    let today, h, m, s, d, D, M, Y, offset = 0;

    this.getDateTime = () => {
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
            s: padZero(s)
        }
    };

    this.navigate = e => {
        if (e) {
            switch (e.target.id) {
                case "prev":
                    offset--;
                    break;
                case "next":
                    offset++;
                    break;
                default:
                    offset = 0;
            }
        }
        today = new Date(Y, M + offset);
        let _M = today.getMonth();
        let _Y = today.getFullYear();
        today.setDate(1);

        return {
            d: DAYS[d],
            D: D,
            M: M,
            Y: Y,
            _M: _M,
            _Y: _Y,
            month: MONTHS[M],
            _month: MONTHS[_M],
            start: today.getDay(),
            end: _Y % 4 === 0 && _M === 1 ? MDAYS[_M] + 1 : MDAYS[_M]
        }
    };
};