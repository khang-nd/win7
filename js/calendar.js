var Calendar = function() {

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

    var getFullDate = () => {
        if(!d || d !== today.getDay())
            today = new Date();
        d = today.getDay();
        D = today.getDate();
        M = today.getMonth();
        Y = today.getFullYear();
    }

    var getFullTime = () => {
        today = new Date();
        h = today.getHours();
        m = today.getMinutes();
        s = today.getSeconds();

        return {
            h: padZero(h),
            m: padZero(m),
            s: padZero(s)
        }

        // $('#time').text(`${padZero(h)}:${padZero(m)}`);
        // $('#date').text(`${padZero(D)}/${padZero(M)}/${padZero(Y)}`);

        // // clock hands rotation
        // $("#clock > #handH").css("transform", `rotate(${h * 30}deg) translate(50%)`); // 360deg / 12
        // $("#clock > #handM").css("transform", `rotate(${m * 6}deg) translate(50%)`); // 360deg / 60
        // $("#clock > #handS").css("transform", `rotate(${s * 6}deg) translate(50%, 25%)`);
        // $("#hour").text(`${padZero(h)}:${padZero(m)}:${padZero(s)}`);
    };

    var updateCalendar = e => {
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
        today = new Date(Y, M + offset, D);
        let _M = today.getMonth();
        let _Y = today.getFullYear();

        // print calendar
        $("#today").text(DAYS[d] + ", " + MONTHS[M] + " " + D + ", " + Y);
        $("#curr").text(MONTHS[_M] + " " + _Y);
        $("#days").empty();
        today.setDate(1);
        // day start in month
        let start = today.getDay();
        // day end whether it is leap year
        let end = _Y % 4 === 0 && _M === 1 ? MDAYS[_M] + 1 : MDAYS[_M];
        for (var i = 0, j = 0; i < 42; i++) {
            if (i >= start) j++;
            $("<li>", {
                class: j === D && _M === M && _Y === Y ? "active" : "",
                html: i < start || i >= start + end ? "&nbsp;" : j,
                appendTo: "#days"
            });
        }
    };
    updateCalendar();
    $("#prev").click(updateCalendar);
    $("#next").click(updateCalendar);
    $("#today").click(updateCalendar);

    // exposes properties
    return {
        updateTime: () => updateTime,
        updateCalendar: () => updateCalendar
    }
};