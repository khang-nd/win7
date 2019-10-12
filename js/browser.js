// cannot print iframe url to addr bar due to cross-domain policy
let Browser = function () {
    const PROXY = 'https://jsonp.afeld.me/?url=';
    // const PROXY = '';
    const HOME = 'https://www.msn.com';
    const ADDR = this.address;
    const PAGE = this.page;
    const BING = this.bing;
    const START = this.start;
    const isEnter = this.isEnter;

    START.click(() => {
        if(!PAGE[0].src) {
            PAGE[0].src = PROXY + HOME;
            ADDR[0].value = HOME;
        }
    });
    ADDR.focus(e => e.target.select())
        .keyup(e => { if(isEnter(e)) PAGE[0].src = PROXY + e.target.value });
    BING.keyup(e => { if(isEnter(e)) PAGE[0].src = 'https://www.bing.com/search?q=' + e.target.value });
}