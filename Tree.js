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
}

const diffByOne = (a,b) => 2 > Math.abs(a-b);

const RIGHT = 1;
const LEFT = 0;
const oppDir = dir=> dir === RIGHT ? LEFT : RIGHT;
class DoublyLinkedBinaryTree {
  constructor (value, identifier=identity) {
    this.value = value;
    this.children = [];
    this.identifier = identifier;
    this.parent = undefined;
  }
  get right () {
    return this.children[RIGHT];
  }
  get left () {
    return this.children[LEFT];
  }
  set right (value) {
    this.children[RIGHT] = value;
  }
  set left (value) {
    this.children[LEFT] = value;
  }
  get isRightChild () {
    return this.parent ? this.parent.right === this : false;
  }
  get isLeftChild () {
    return this.parent ? this.parent.left === this : false;
  }
  get isRoot () {
    return this.parent === undefined;
  }
  get uncle () {
    return this.grandparent ? (this.parent.isRightChild ? this.grandparent.left : this.grandparent.right) : undefined;
  }
  get sibling () {
    return this.parent ? (this.isRightChild ? this.parent.left : this.parent.right) : undefined;
  }
  get grandparent () {
    return this.parent ? this.parent.parent : undefined;
  }
  get isLeaf() {
    return this.children.every(child => child === undefined);
  }
  get hasOneChild () {
    return (this.right !== undefined && this.left === undefined) 
    || (this.right === undefined && this.left !== undefined);
  }
  get hasTwoChildren () {
    return (this.right !== undefined && this.left !== undefined);
  }
  _swapWithParent () {
    //Need to create a new node to replace old one;
    let replacement = new BinaryTree(this.value, this.identifier);
    replacement.parent = this.parent;
    replacement.children = this.children;
    if (this.parent !== undefined) {
      if (this.isRightChild) {
        this.parent.right = replacement;
      } else {
        this.parent.left = replacement;
      }
    }
    this.value = replacement.parent.value;
    this.children = replacement.parent.children;
    this.parent = replacement.parent.parent;
    //Update references to this
    this.children.forEach(child => {if(child) child.parent = this});
    //Update references to replacement
    this.children.forEach(child => {if(child) child.children.forEach(kid => {if (kid) kid.parent = child})});
  }
  rotateRight () {
    this._rotate(RIGHT);
    this._swapWithParent();
  }
  rotateLeft () {
    this._rotate(LEFT);
    this._swapWithParent();
  }
  _rotate (dir) {
    let opposite = oppDir(dir);
    let pivot = this.children[opposite];
    this.children[opposite] = pivot.children[dir];
    pivot.children[dir] = this;
    pivot.parent = this.parent;
    pivot.children.forEach(child => {if(child) child.parent = pivot;});
    this.children.forEach(child => {if(child) child.parent = this;});
  }
  insert (value) {
    if (this.value === undefined) {
      this.value = value;
      return this;
    } else {
      let dir;
      if (this.identifier(value) > this.identifier(this.value)) {
        dir = RIGHT;
      } else {
        dir = LEFT;
      }
      if (this.children[dir] === undefined) {
        let newTree = new BinaryTree(value, this.identifier);
        newTree.parent = this;
        this.children[dir] = newTree;
        return newTree;
      } else {
        return this.children[dir].insert(value);
      }
    }
  }
  find (value) {
    let identifiedValue = this.identifier(value);
    let thisValue = this.identifier(this.value);
    if (thisValue === identifiedValue) {
      return this;
    } else {
      let dir;
      if (thisValue < identifiedValue) {
        dir = RIGHT;
      } else {
        dir = LEFT;
      }
      if (this.children[dir] === undefined) {
        return undefined;
      } else {
        return this.children[dir].find(value);
      }
    }
  }
  contains (value) {
    return this.find(value) !== undefined;
  }
  _minimumChild () {
    let current = this;
    while (current.left !== undefined) {
      current = current.left
    }
    return current;
  }
  minimum() {
    return this._minimumChild().value;
  }
  _maximumChild () {
    let current = this;
    while (current.right !== undefined) {
      current = current.right
    }
    return current;
  }
  maximum() {
    return this._maximumChild().value;
  }
  remove (value) {
    let identifiedValue = this.identifier(value);
    let thisValue = this.identifier(this.value);
    if (thisValue === identifiedValue) {
      if (this.isLeaf) {
        if (this.isRoot) {
          this.value = undefined;
        } else if (this.isRightChild) {
          this.parent.right = undefined;
        } else if (this.isLeftChild) {
          this.parent.left = undefined;
        }
      } else if (this.hasOneChild) {
        let rmDir = this.right ? LEFT : RIGHT;
        this.right ? this.rotateLeft() : this.rotateRight();
        this.children[rmDir] = undefined;
      } else if (this.hasTwoChildren) {
        let replacement = this.right._minimumChild();
        this.value = replacement.value;
        this.right.remove(replacement.value);
      }
    } else {
      let dir;
      if (thisValue < identifiedValue) {
        dir = RIGHT;
      } else {
        dir = LEFT;
      }
      if (this.children[dir] === undefined) {
        return undefined;
      } else {
        return this.children[dir].remove(value);
      }
    }
  }
  readable (_depth = 0, side=undefined) {
    let retval = _depth === 0 ? '' : (' ').repeat(_depth) + '➤';
    let positioning = side === undefined ? 'ROOT' : (side === RIGHT ? '⯅' : '⯆');
    console.log(retval, this.value, positioning, _depth + ' deep');
    if (this.left) this.left.readable(_depth +1, LEFT);
    if (this.right) this.right.readable(_depth +1, RIGHT);
  }
};

module.exports = {Tree, DoublyLinkedTree};