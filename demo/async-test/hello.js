// hello.js
console.log('init hello.js...');

const fs = require('fs');
const path = require('path');
// a simple async function:
module.exports = () => {
  let expression = fs.readFileSync('./data.txt', 'utf-8');
  let r = eval(expression);
  console.log(`Calculate: ${expression} = ${r}`);
  return r;
};