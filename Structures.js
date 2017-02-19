class Queue {
  constructor(...elems) {
    this.pointer = 0;
    this.storage = {};
    elems.forEach((e,i) => {
      this.storage[i] = e;
    });
    this.length = elems.length || 0;
    this.end = this.length;
  }
  enqueue (elem) {
    this.storage[this.end] = elem;
    this.end ++;
    this.length ++;
  }
  dequeue () {
    let next = this.storage[this.pointer];
    if (next !== undefined) {
      delete this.storage[this.pointer];
      this.pointer ++;
      this.length --;
    }
    return next;
  }
  at (index) {
    return this.storage[this.pointer + index];
  }
  forEach (cb) {
    for (let index in this.storage) {
      cb(this.storage[index], Number(index)-this.pointer);
    }
  }
}
class Stack {
  constructor(...elems) {
    this.storage = [...elems];
  }
  pull (amt) {
    return new Stack(...this.storage.slice(-amt));
  }
  get length () {
    return this.storage.length;
  }
  push (elem) {
    return this.storage.push(elem);
  }
  pop () {
    return this.storage.pop();
  }
  peek () {
    return this.storage[this.storage.length -1];
  }
  forEach(cb) {
    this.storage.forEach(cb);
  }
}

module.exports = {
  Queue,
  Stack
}