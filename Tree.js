class Tree {
  constructor (value) {
    this.value = value;
    this.children = [];
  }
  insert (value) {
    if (this.value === undefined) {
      this.value = value;
      return this;
    }
    let child = new Tree(value);
    this.children.push(child);
    return child;
  }
  find (value) {
    if (typeof value === 'function' && value(this.value)) {
      return this;
    } else if (this.value === value) {
      return this;
    } else {
      let found = this.children.map(child => child.find(value)).filter(e => e !== undefined);
      return found.length === 0 ? undefined : found[0];
    }
  }
  isLeaf () {
    return this.children.length === 0;
  }
  isBranch () {
    return this.children.length > 0;
  }
  prune () {
    this.children = [];
  }
  graft (...forest) {
    this.children = this.children.concat([...forest]);
  }
  depthFirstSearch(cb) {
    cb(this.value);
    this.children.forEach(child => child.depthFirstSearch(cb));
  }
  preorder(cb) {
    return this.depthFirstSearch(cb);
  }
  postorder(cb) {
    this.children.forEach(child => child.inorder(cb));
    cb(this.value);
  }
  breadthFirstSearch (cb) {
    let currentLayer = new Queue();
    let nextLayer = new Queue();
    cb(this.value, 0, this);
    let depth = 1;
    this.children.forEach(child => nextLayer.enqueue(child));
    while(nextLayer.length > 0 || currentLayer.length > 0) {
      while(nextLayer.length > 0) {
        let curr = nextLayer.dequeue();
        cb(curr.value, depth, curr);
        curr.children.forEach(child => currentLayer.enqueue(child));
      }
      depth ++;
      nextLayer = currentLayer;
    }
  }
  get size () {
    return 1 + this.children.reduce((total, next) => total + next.length, 0);
  }
}

class DoublyLinkedTree extends Tree {
  constructor (value) {
    super(value);
    this.parent = undefined;
    this.length = +!!value;
  }
  get uncle () {
    let parent = this.parent;
    if (parent === undefined) {
      return undefined;
    } else {
      let grandparent = parent.parent;
      if (grandparent === undefined) {
        return undefined;
      }
      return grandparent.left === parent ? grandparent.right : grandparent.left;
    }
  }
  get grandparent () {
    return this.parent ? (this.parent.parent ? this.parent.parent : undefined) : undefined;
  }
  insert (value) {
    let child = new DoublyLinkedTree(value);
    child.parent = this;
    let parent = child.parent;
    while(parent !== undefined) {
      parent.length ++;
      parent = parent.parent;
    }
    this.children.push(child);
    return child;
  }
};

module.exports = {Tree, DoublyLinkedTree};