const compareTracklist = require('./comparators/tracklist');
const buildAlbum = require('./build');

module.exports = function (albumId, store) {
  const state = () => store.getState();

  const releaseResults = () => state().results
    .filter(result => result.album === albumId)
    .reduce((all, item) => all.concat(item.page.results), []);

  const getRetrievedReleases = () => releaseResults()
    .map(result => state().releases
      .find(item => item.id === result.id));

  const getAlbum = () => state().albums.find(album => album.id === albumId);

  const orderReleases = () => getRetrievedReleases().reduce((all, release) => {
    if (all.length) {
      const current = compareTracklist(getAlbum().tracks.items, release.tracklist);
      const first = compareTracklist(getAlbum().tracks.items, all[0].tracklist);
      if (current > first) {
        return [release, ...all];
      } else if (current > 0) {
        return all.concat(release);
      }
      return all;
    }
    return [release];
  }, []);

  return {
    getAlbum,

    getReleaseSearchResults: () => releaseResults(),

    getRetrievedReleases,

    getBestMatch: () => buildAlbum(getAlbum(), orderReleases()[0]),

    getAllMatches: () => orderReleases().map(release => buildAlbum(getAlbum(), release)),
  };
};
