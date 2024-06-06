// timezoneConfig.js
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Kolkata'); // Set IST timezone
module.exports = moment;
