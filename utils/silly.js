
var sd = require("silly-datetime");

//需要使用一个日期时间，格式为 20150920110632
var ttt = sd.format(new Date(), 'YYYY:MM:DD:HH:mm');
console.log(ttt);