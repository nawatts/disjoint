function DisjointSet(size, subsetPropsReducer, defaultProps) {
  this._parent = new Array(size);
  this._rank = new Array(size);
  this._numSubsets = size;

  this._subsetProps = new Array(size);
  this._subsetPropsReducer = subsetPropsReducer;

  let initializer;
  if (Object.prototype.toString.call(defaultProps) == '[object Function]') {
    initializer = defaultProps;
  } else {
    initializer = () => defaultProps;
  }

  for (let i = 0; i < size; i++) {
    this._parent[i] = i;
    this._rank[i] = 0;
    this._subsetProps[i] = Object.assign({}, initializer(i));
  }
}

DisjointSet.prototype.find = function(x) {
  // Find the subset that element x belongs to
  if (this._parent[x] !== x) {
    this._parent[x] = this.find(this._parent[x]);
  }
  return this._parent[x];
}

DisjointSet.prototype.isConnected = function(x, y) {
  // Are elements x and y in the same subset?
  return this.find(x) === this.find(y);
}

DisjointSet.prototype.union = function(x, y, edge) {
  // Union the two subsets containing elements x and y
  const xRoot = this.find(x);
  const yRoot = this.find(y);

  if (xRoot === yRoot) {
    return xRoot;
  }

  if (this._rank[xRoot] < this._rank[yRoot]) {
    this._parent[xRoot] = yRoot;
    this._numSubsets -= 1;
    if (this._subsetPropsReducer) {
      this._subsetProps[yRoot] = this._subsetPropsReducer(this._subsetProps[yRoot], this._subsetProps[xRoot], edge);
      this._subsetProps[xRoot] = null;
    }
    return yRoot;
  } else {
    this._parent[yRoot] = xRoot;
    this._numSubsets -= 1;
    if (this._subsetPropsReducer) {
      this._subsetProps[xRoot] = this._subsetPropsReducer(this._subsetProps[xRoot], this._subsetProps[yRoot], edge);
      this._subsetProps[yRoot] = null;
    }
    if (this._rank[xRoot] === this._rank[yRoot]) {
      this._rank[xRoot] += 1;
    }
    return xRoot;
  }
}

DisjointSet.prototype.subsets = function() {
  // Get subsets as arrays of elements
  const subsets = {}
  for (let i = 0; i < this._parent.length; i++) {
    const root = this.find(i);
    if (!subsets.hasOwnProperty(root)) {
      subsets[root] = [];
    }
    subsets[root].push(i);
  }

  return Object.keys(subsets)
    .map(r => subsets[r])
    .map(s => s.sort())
    .sort((s1, s2) => s1[0] - s2[0]);
}

DisjointSet.prototype.subset = function(x) {
  // Get the subset containing element x
  const subsetRoot = this.find(x);
  const subset = [];
  for (let i = 0; i < this._parent.length; i++) {
    if (this.find(i) === subsetRoot) {
      subset.push(i);
    }
  }
  subset.sort();
  return subset;
}

DisjointSet.prototype.numSubsets = function() {
  // Get number of subsets in the set
  return this._numSubsets;
}

DisjointSet.prototype.subsetProps = function(x) {
  // Get properties of subset containing element x
  return this._subsetProps[this.find(x)];
}

export default DisjointSet;
