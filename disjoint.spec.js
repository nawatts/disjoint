/* eslint-env commonjs, mocha */
const chai = require('chai');
const expect = chai.expect;

const DisjointSet = require('./lib/disjoint');

describe('DisjointSet', function() {

  describe('case 1', function() {
    // Example from http://algs4.cs.princeton.edu/15uf/
    const set = new DisjointSet(10);

    before(function() {
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

    it('should contain 2 subsets', function() {
      expect(set.numSubsets()).to.eql(2);
    });

    it('should group elements correctly', function() {
      expect(set.find(0)).to.eql(set.find(1));
      expect(set.find(0)).to.eql(set.find(2));
      expect(set.find(0)).to.eql(set.find(5));
      expect(set.find(0)).to.eql(set.find(6));
      expect(set.find(0)).to.eql(set.find(7));

      expect(set.find(3)).to.eql(set.find(4));
      expect(set.find(3)).to.eql(set.find(8));
      expect(set.find(3)).to.eql(set.find(9));

      expect(set.find(0)).to.not.eql(set.find(3));
    });
  });
});
