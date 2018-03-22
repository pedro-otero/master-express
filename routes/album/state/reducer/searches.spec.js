const assert = require('assert');

const { ADD_SEARCH, ADD_MATCHES } = require('../action/constants');
const searches = require('./searches');

describe('Searches reducer', function () {

  const addSearch = id => function () {
    this.newSearches = searches([], {
      type: ADD_SEARCH,
      id
    });
  };

  describe(ADD_SEARCH, function () {
    beforeEach(addSearch('albumId'));

    it('Pushes searches', function () {
      assert.equal(1, this.newSearches.length);
    });

    it('Creates a request with the same id as the album', function () {
      assert.equal('albumId', this.newSearches[0].id);
    });

    it('Creates a request with status ADDED', function () {
      assert.equal('ADDED', this.newSearches[0].status);
    });
  });

  describe(ADD_MATCHES, function () {
    beforeEach(function () {
      this.newSearches = searches([{
        id: 'albumId',
      }], {
        type: ADD_MATCHES,
        album: {
          id: 'albumId',
          artists: [{ name: 'who' }],
          tracks: {
            items: []
          },
        },
        releases: [{
          id: 1
        }]
      })
    });

    it('puts one match in the search', function () {
      assert.equal(1, this.newSearches[0].matches.length);
    });

    it('matches release to the search by album id', function () {
      assert.equal(1, this.newSearches[0].matches[0]);
    });

    it('sets search as MATCHED', function () {
      assert.equal('MATCHED', this.newSearches[0].status);
    });

    it('sets search\s builtAlbum', function () {
      assert(this.newSearches[0].builtAlbum);
    });
  });
});
