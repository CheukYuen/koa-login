/**
 *
 * @param {Array} array
 * @returns {number}
 */
module.exports = function average(array) {
  let sum = 0;
  for (let num of array) {
    sum += num
  }
  return sum / array.length
};