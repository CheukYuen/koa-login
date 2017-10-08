// var toLocalTime = function(time) {
//   var d = new Date(time);
//   var offset = (new Date().getTimezoneOffset() / 60) * -8;
//   var n = new Date(d.getTime() + offset);
//   return n;
// };
//
// console.log(toLocalTime(new Date()));



// var x = new Date();
// var currentTimeZoneOffsetInHours = x.getTimezoneOffset() / 60;
//
// var offset = currentTimeZoneOffsetInHours * -1;
// console.log(offset)
// var n = new Date(x.getTime() + offset);
// console.log(n.getTime());
// console.log(x.toUTCString());





var x = new Date();
x.setUTCHours(24);

console.log(x.toUTCString())