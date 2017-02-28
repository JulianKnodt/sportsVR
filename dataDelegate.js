const exJSON = require('exjson');
class DataDelegate {
  constructor () {
    this.count = 0;
    this.storage = {}
  }
  addData(data, duration=1000 * 60 * 20) {
    let count = this.count
    this.storage[count] = data;
    this.count ++;
    return {
      url: count,
      duration };
    setTimeout(() => {
      delete this.storage[count];
    }, duration);
  }
  getData(index) {
    return this.storage[index];
  }
}

module.exports = DataDelegate;