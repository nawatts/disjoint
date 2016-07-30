function DisjointSet(size) {
  this._parent = new Array(size);
  this._rank = new Array(size);

  this._numSubsets = size;

  for (let i = 0; i < size; i++) {
    this._parent[i] = i;
    this._rank[i] = 0;
  }
}

DisjointSet.prototype.find = function(x) {
  // Find the subset that element x belongs to
  if (this._parent[x] !== x) {
    this._parent[x] = this.find(this._parent[x]);
  }
  return this._parent[x];
}

DisjointSet.prototype.union = function(x, y) {
  // Union the two subsets containing elements x and y
  const xRoot = this.find(x);
  const yRoot = this.find(y);

  if (xRoot === yRoot) {
    return xRoot;
  }

  if (this._rank[xRoot] < this._rank[yRoot]) {
    this._parent[xRoot] = yRoot;
    this._numSubsets -= 1;
    return yRoot;
  } else if (this._rank[xRoot] > this._rank[yRoot]) {
    this._parent[yRoot] = xRoot;
    this._numSubsets -= 1;
    return xRoot;
  } else {
    this._parent[yRoot] = xRoot;
    this._rank[xRoot] += 1;
    this._numSubsets -= 1;
    return xRoot;
  }
}

DisjointSet.prototype.numSubsets = function() {
  return this._numSubsets;
}

export default DisjointSet;
