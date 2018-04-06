const assert = require('assert');

const {
  ADD_SEARCH,
  RESULTS,
} = require('../action/constants');
const reduce = require('./searches');

describe('Searches reducer', function () {

  const addSearch = id => function () {
    this.searches = reduce([], {
      type: ADD_SEARCH,
      id
    });
  };

  describe(ADD_SEARCH, function () {
    beforeEach(addSearch('albumId'));

    it('Pushes searches', function () {
      assert.equal(1, this.searches.length);
    });

    it('Creates a request with the same id as the album', function () {
      assert.equal('albumId', this.searches[0].id);
    });

    it('Creates a request with status ADDED', function () {
      assert.equal('ADDED', this.searches[0].status);
    });
  });

  it('returns default state', function () {
    const searches = reduce(undefined, { type: 'nada' });
    assert(!searches.length);
  });
});