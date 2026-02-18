var dayjs = require('dayjs');
var moment = require('moment');
var { DateTime } = require('luxon');

module.exports = function stringToTestId(string) {
    return string.replace(/[&\/\\#,+()$~%.'":*?<>{}\s]/g, '');
}
module.exports = function makeJSDateObject(date) {
    if (date instanceof dayjs) {
        return date.clone().toDate();
    }
    if (moment.isMoment(date)) {
        return date.clone().toDate();
    }
    if (date instanceof DateTime) {
        return date.toJSDate();
    }
    if (date instanceof Date) {
        return new Date(date.getTime());
    }
    return date; // handle case with invalid input
}
module.exports = function copy(text) {
    return navigator.clipboard.writeText(text);
}
module.exports = function loadScript(src, position) {
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.src = src;
    position.appendChild(script);
    return script;
}
module.exports = function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
