function DisjointSet(size, subsetPropsReducer, defaultProps) {
  this._parent = new Array(size);
  this._rank = new Array(size);
  this._numSubsets = size;

  this._subsetProps = new Array(size);
  this._subsetPropsReducer = subsetPropsReducer;

  for (let i = 0; i < size; i++) {
    this._parent[i] = i;
    this._rank[i] = 0;
    this._subsetProps[i] = Object.assign({}, defaultProps);
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

DisjointSet.prototype.numSubsets = function() {
  // Get number of subsets in the set
  return this._numSubsets;
}

DisjointSet.prototype.subsetProps = function(x) {
  // Get properties of subset containing element x
  return this._subsetProps[this.find(x)];
}

export default DisjointSet;
