# disjoint

Implementation of a [disjoint set](https://en.wikipedia.org/wiki/Disjoint-set_data_structure).

Supports tracking arbitrary information about each subset and updating it as new links are added.

[![npm version](https://img.shields.io/npm/v/disjoint.svg)](https://www.npmjs.com/package/disjoint)

```JavaScript
// Example: 6 elements connected with weighted edges
// Edge weights are in parentheses
// Track maximum edge weight in each subset
//
//    0 -(2)- 1       2
//    |               |
//   (4)             (3)
//    |               |
//    3 -(1)- 4       5
//

const set = new DisjointSet(
  6, // Size of disjoint set
  function(s1, s2, edge) {
    // Reducer for updating subset properties when two subsets are joined.
    // s1: properties of one subset
    // s2: properties of the other subset
    // edge: edge properties, from third argument to union
    return {
      maxWeight: Math.max(s1.maxWeight, s2.maxWeight, edge.weight)
    }
  },
  { maxWeight: 0 } // Initial value for subset properties.
);

// Join elements
set.union(0, 1, { weight: 2 });
set.union(2, 5, { weight: 3 });
set.union(3, 4, { weight: 1 });
set.union(3, 0, { weight: 4 });

// Test if elements are connected
set.isConnected(0, 4); // true
set.isConnected(1, 2); // false

// Number of subsets
set.numSubsets(); // 2

// List of all subsets
set.subsets(); // [ [0, 1, 3, 4], [2, 5] ]

// Subset containing a specific element
set.subset(2) // [2, 5]

// Properties of subset containing a specific element
set.subsetProps(1) // { maxWeight: 4 }
```
