/**
 * A [disjoint set](https://en.wikipedia.org/wiki/Disjoint-set_data_structure) data structure.
 *
 * @typeParam SubsetProps Properties for each subset.
 * @typeParam EdgeProps Properties for "edges" joining elements.
 */
class DisjointSet<
  SubsetProps extends Record<string, unknown> = Record<string, unknown>,
  EdgeProps = any // eslint-disable-line @typescript-eslint/no-explicit-any
> {
  private _parent: number[];

  private _rank: number[];

  private _numSubsets: number;

  private _subsetProps: Array<SubsetProps | null>;

  private _subsetPropsReducer:
    | ((s1: SubsetProps, s2: SubsetProps, edge?: EdgeProps) => SubsetProps)
    | undefined;

  /**
   * Create a DisjointSet.
   *
   * @param size - The number of elements in the set
   * @param subsetPropsReducer - Defines how subset properties are combined when two subsets are merged as the result of a union.
   * @param defaultProps - Initial subset properties or a callback that returns initial subset properties.
   */
  constructor(
    size: number,
    subsetPropsReducer?: (
      s1: SubsetProps,
      s2: SubsetProps,
      edge?: EdgeProps
    ) => SubsetProps,
    defaultProps?: SubsetProps | ((x: number) => SubsetProps)
  ) {
    this._parent = new Array(size);
    this._rank = new Array(size);
    this._numSubsets = size;

    this._subsetProps = new Array(size);
    this._subsetPropsReducer = subsetPropsReducer;

    let initializer: (x: number) => SubsetProps;
    if (Object.prototype.toString.call(defaultProps) == "[object Function]") {
      initializer = defaultProps as (x: number) => SubsetProps;
    } else {
      initializer = () => defaultProps as SubsetProps;
    }

    for (let i = 0; i < size; i++) {
      this._parent[i] = i;
      this._rank[i] = 0;
      this._subsetProps[i] = Object.assign({}, initializer(i));
    }
  }

  /**
   * Find the root of the subset containing element x.
   *
   * @param x - An element in the set.
   * @returns The root of the subset containing element x.
   */
  find(x: number): number {
    if (this._parent[x] !== x) {
      this._parent[x] = this.find(this._parent[x]);
    }
    return this._parent[x];
  }

  /**
   * Determine if two elements are connected.
   *
   * @param x - An element in the set.
   * @param y - An element in the set.
   * @returns True if elements x and y are connected (in the same subset).
   */
  isConnected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }

  /**
   * Connect two elements and merge their subsets.
   *
   * @param x - An element in the set.
   * @param y - An element in the set.
   * @param edge - Arbitrary properties of the edge connecting elements x and y. These are passed to the set's
   * {@link _subsetPropsReducer} to determine properties of the merged subset.
   * @returns The root of the merged subset.
   */
  union(x: number, y: number, edge?: EdgeProps): number {
    const xRoot = this.find(x);
    const yRoot = this.find(y);

    if (xRoot === yRoot) {
      return xRoot;
    }

    if (this._rank[xRoot] < this._rank[yRoot]) {
      this._parent[xRoot] = yRoot;
      this._numSubsets -= 1;
      if (this._subsetPropsReducer) {
        this._subsetProps[yRoot] = this._subsetPropsReducer(
          this._subsetProps[yRoot] as SubsetProps,
          this._subsetProps[xRoot] as SubsetProps,
          edge
        );
        this._subsetProps[xRoot] = null;
      }
      return yRoot;
    } else {
      this._parent[yRoot] = xRoot;
      this._numSubsets -= 1;
      if (this._subsetPropsReducer) {
        this._subsetProps[xRoot] = this._subsetPropsReducer(
          this._subsetProps[xRoot] as SubsetProps,
          this._subsetProps[yRoot] as SubsetProps,
          edge
        );
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
   *
   * @returns An array of subsets. Each subset is an array of elements contained in that subset.
   */
  subsets(): number[][] {
    const subsets = new Map<number, number[]>();
    for (let i = 0; i < this._parent.length; i++) {
      const root = this.find(i);
      if (!subsets.has(root)) {
        subsets.set(root, []);
      }
      (subsets.get(root) as number[]).push(i);
    }

    return Array.from(subsets.values(), (s) => s.sort()).sort(
      (s1, s2) => s1[0] - s2[0]
    );
  }

  /**
   * Get the subset containing an element.
   *
   * @param x - An element in the set.
   * @returns Array of elements in the subset containing element x.
   */
  subset(x: number): number[] {
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
   *
   * @returns Number of subsets in the set.
   */
  numSubsets(): number {
    return this._numSubsets;
  }

  /**
   * Get the properties of the subset containing a specific element.
   *
   * @param x - An element in the set.
   * @returns - The properties of the subset containing element x.
   */
  subsetProps(x: number): SubsetProps {
    return this._subsetProps[this.find(x)] as SubsetProps;
  }
}

export = DisjointSet;
