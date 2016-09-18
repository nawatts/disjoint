/**
 * Create a [disjoint set]{@link https://en.wikipedia.org/wiki/Disjoint-set_data_structure}.
 * @constructor
 * @param {Number} size - The number of elements in the set
 * @param {SubsetPropsReducer} subsetPropsReducer - Defines how subset properties are combined when two subsets
 * are merged as the result of a union.
 * @param {(Object|SubsetPropsInitializer)} defaultProps - Initial subset properties or a callback that returns
 * initial subset properties.
 */
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

/**
 * Defines how subset properties are combined when two subsets are merged as the result of a union.
 * @callback SubsetPropsReducer
 * @param {Object} s1 - Properties of a subset.
 * @param {Object} s2 - Properties of a subset.
 * @param {Object} edgeProps - Properties of the edge that will join sets s1 and s2.
 * @returns {Object} Properties of the merged subset.
 */

/**
 * Defines initial properties for a subset. Initially, a set with n elements will contain n subsets, each
 * containing a single element.
 * @callback SubsetPropsInitializer
 * @param {Number} i - The element the initial subset will contain.
 * @returns {Object} Properties of the initial subset containing element i.
 */

/**
 * Find the root of the subset containing element x.
 * @param {Number} x - An element in the set.
 * @returns {Number} The root of the subset containing element x.
 */
DisjointSet.prototype.find = function(x) {
  if (this._parent[x] !== x) {
    this._parent[x] = this.find(this._parent[x]);
  }
  return this._parent[x];
}

/**
 * Determine if two elements are connected.
 * @param {Number} x - An element in the set.
 * @param {Number} y - An element in the set.
 * @returns {Boolean} True if elements x and y are connected (in the same subset).
 */
DisjointSet.prototype.isConnected = function(x, y) {
  return this.find(x) === this.find(y);
}

/**
 * Connect two elements and merge their subsets.
 * @param {Number} x - An element in the set.
 * @param {Number} y - An element in the set.
 * @param {Object} edge - Arbitrary properties of the edge connecting elements x and y. These are passed to the set's
 * {@link SubsetPropsReducer} to determine properties of the merged subset.
 * @returns {Number} The root of the merged subset.
 */
DisjointSet.prototype.union = function(x, y, edge) {
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

/**
 * Get all subsets in the set.
 * @returns {Number[][]} An array of subsets. Each subset is an array of elements contained in that subset.
 */
DisjointSet.prototype.subsets = function() {
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

/**
 * Get the subset containing an element.
 * @param {Number} x - An element in the set.
 * @returns {Number[]} Array of elements in the subset containing element x.
 */
DisjointSet.prototype.subset = function(x) {
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

/**
 * Get the number of subsets in the set.
 * @returns {Number} Number of subsets in the set.
 */
DisjointSet.prototype.numSubsets = function() {
  return this._numSubsets;
}

/**
 * Get the properties of the subset containing a specific element.
 * @param {Number} x - An element in the set.
 * @returns {Object} - The properties of the subset containing element x.
 */
DisjointSet.prototype.subsetProps = function(x) {
  return this._subsetProps[this.find(x)];
}

export default DisjointSet;
