import chai = require("chai");
const expect = chai.expect;

import DisjointSet from ".";

describe("DisjointSet", function () {
  describe("case 1", function () {
    // Example from http://algs4.cs.princeton.edu/15uf/
    const set = new DisjointSet(10);

    before(function () {
      set.union(4, 3);
      set.union(3, 8);
      set.union(6, 5);
      set.union(9, 4);
      set.union(2, 1);
      set.union(8, 9);
      set.union(5, 0);
      set.union(7, 2);
      set.union(6, 1);
      set.union(1, 0);
      set.union(6, 7);
    });

    it("should contain 2 subsets", function () {
      expect(set.numSubsets()).to.eql(2);
    });

    it("should group elements correctly", function () {
      expect(set.isConnected(0, 1)).to.be.true;
      expect(set.isConnected(0, 2)).to.be.true;
      expect(set.isConnected(0, 5)).to.be.true;
      expect(set.isConnected(0, 6)).to.be.true;
      expect(set.isConnected(0, 7)).to.be.true;

      expect(set.isConnected(3, 4)).to.be.true;
      expect(set.isConnected(3, 8)).to.be.true;
      expect(set.isConnected(3, 9)).to.be.true;

      expect(set.isConnected(0, 3)).to.be.false;

      expect(set.subsets()).to.eql([
        [0, 1, 2, 5, 6, 7],
        [3, 4, 8, 9],
      ]);
    });

    it("should identify the subset containing a particular element", function () {
      expect(set.subset(2)).to.eql([0, 1, 2, 5, 6, 7]);
      expect(set.subset(8)).to.eql([3, 4, 8, 9]);
    });
  });

  describe("max weight example", function () {
    type SubsetProps = {
      maxWeight: number;
    };
    type EdgeProps = {
      weight: number;
    };

    const set = new DisjointSet<SubsetProps, EdgeProps>(
      6,
      function (
        s1: SubsetProps,
        s2: SubsetProps,
        edge?: EdgeProps
      ): SubsetProps {
        return {
          maxWeight: Math.max(s1.maxWeight, s2.maxWeight, edge?.weight || 0),
        };
      },
      { maxWeight: 0 }
    );

    before(function () {
      set.union(0, 1, { weight: 2 });
      set.union(1, 2, { weight: 4 });
      set.union(3, 4, { weight: 6 });
    });

    it("should calculate max weight of subset", function () {
      expect(set.subsetProps(0).maxWeight).to.eql(4);
      expect(set.subsetProps(3).maxWeight).to.eql(6);
      expect(set.subsetProps(5).maxWeight).to.eql(0);
    });
  });

  describe("subset properties initialization", function () {
    it("should initialize using an object", function () {
      type SubsetProps = {
        prop: number;
      };

      const set = new DisjointSet<SubsetProps>(5, undefined, { prop: 1 });

      expect(set.subsetProps(1)).to.eql({ prop: 1 });
      expect(set.subsetProps(3)).to.eql({ prop: 1 });
    });

    it("should initialize using a function", function () {
      const set = new DisjointSet(6, undefined, function (i) {
        return { prop: i };
      });

      expect(set.subsetProps(1)).to.eql({ prop: 1 });
      expect(set.subsetProps(3)).to.eql({ prop: 3 });
    });
  });

  describe("without a subset properties reducer", function () {
    it("should group elements correctly", function () {
      const set = new DisjointSet(5);

      expect(set.union.bind(set, 0, 1)).to.not.throw(Error);
      expect(set.union.bind(set, 0, 3)).to.not.throw(Error);
      expect(set.union.bind(set, 2, 4)).to.not.throw(Error);

      expect(set.isConnected(1, 3)).to.be.true;
      expect(set.isConnected(2, 4)).to.be.true;
      expect(set.isConnected(0, 2)).to.be.false;

      expect(set.subset(0)).to.eql([0, 1, 3]);
      expect(set.subset(4)).to.eql([2, 4]);
    });

    it("should have empty props for all subsets", function () {
      const set = new DisjointSet(5);

      expect(set.subsetProps(0)).to.eql({});
      expect(set.union.bind(set, 1, 3, { w: 10 })).to.not.throw(Error);
      expect(set.subsetProps(0)).to.eql({});
    });
  });

  describe("without initial subset properties", function () {
    it("should default to {}", function () {
      const set = new DisjointSet(5, (s1, s2, e) =>
        Object.assign({}, s1, s2, e)
      );
      expect(set.subsetProps(0)).to.eql({});
    });

    it("should reduce subset props", function () {
      const set = new DisjointSet<
        Record<string, number>,
        Record<string, number>
      >(
        5,
        (
          s1: Record<string, number>,
          s2: Record<string, number>,
          e?: Record<string, number>
        ): Record<string, number> => Object.assign({}, s1, s2, e)
      );
      set.union(0, 1, { w: 10 });
      set.union(0, 3, { u: 2 });
      set.union(1, 4, { w: 5 });
      expect(set.subsetProps(1)).to.eql({ u: 2, w: 5 });
    });
  });
});
