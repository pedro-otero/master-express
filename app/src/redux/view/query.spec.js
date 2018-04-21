const assert = require('assert');

const Query = require('./query');

describe('Query', () => {
  const test = (id, cause, progress) => {
    context(cause, () => {
      before(function () {
        this.query = Query(this.store)(id);
      });

      it('has correct id', function () {
        assert.equal(this.query.id, id);
      });

      it(`has progress = ${progress}`, function () {
        assert.equal(this.query.progress, progress);
      });
    });
  };

  test('query-progress-0-no-retrieved-releases', 'progress 0 because no retrieved releases', 0);
  test('progress-0-no-search-results', 'progress 0 because of no search results', 0);
  test('partial-one-page-50%', 'partial, one page, 50%', 50);
  test('partial-2p-1-fully-loaded-67%', 'partial, two pages, one fully loaded, 67%', 67);
  test('partial-2p-1-fully-loaded-second-partially-75%', 'partial, two pages, one fully loaded, second partially, 75%', 75);
  test('full', 'full', 100);

  it('picks the best match', function () {
    const query = Query(this.store)('query-pick-best-match');
    assert.equal(query.bestMatch.tracks[0].producers[0], 'some guy');
  });

  it('safely finds no match', function () {
    const query = Query(this.store)('query-no-match');
    assert.equal(query.bestMatch, null);
  });

  it('returns null if there is no album data', function () {
    const query = Query(this.store)('nothing');
    assert(query === null);
  });
});
