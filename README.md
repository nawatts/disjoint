# disjoint

Implementation of a [disjoint set](https://en.wikipedia.org/wiki/Disjoint-set_data_structure).

Supports tracking arbitrary information about each subset and updating it as new links are added.

```JavaScript
const set = new DisjointSet(
  10, // Size of disjoint set
  function(s1, s2, edge) {
    // Reducer for updating subset properties when two subsets are joined.
    // s1: properties for parent subset
    // s2: properties for child subset
    // edge: edge properties, from 3rd argument to union
    return {
      maxWeight: Math.max(s1.maxWeight, s2.maxWeight, edge.weight)
    }
  },
  { maxWeight: 0 } // Initial value for subset properties.
);

set.union(0, 1, { weight: 2 });
set.union(1, 2, { weight: 4 });

set.subsetProps(0).maxWeight == 4
```
