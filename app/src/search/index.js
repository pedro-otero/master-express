const { actions } = require('../redux/state');
const DiscogFinder = require('./discogs');

const spotifyErrorMessages = require('./spotify-errors');

const observer = (logger, output) => ({
  next: ({ type, data: { page, release } }) => ({
    results: () => {
      logger.results({ page });
      output.addResults(page);
    },
    release: () => {
      logger.release({ release });
      output.addRelease(release);
    },
  })[type](),
  error: (error) => {
    logger.error({ error });
    output.clear();
  },
  complete: logger.finish.bind(logger, {}),
});

const actionsWrapper = (id) => {
  let album;
  const pages = [];
  const addSearch = () => actions.addSearch(id);
  const addAlbum = (searchAlbum) => {
    album = searchAlbum;
    actions.addAlbum(album);
  };
  const addResults = (page) => {
    actions.releaseResults(album.id, page);
    pages.push(page);
  };
  const addRelease = release => actions.addCredits(album, release);
  const abort = () => actions.removeSearch(id);
  const clear = () => {
    const releases = pages
      .reduce((result, page) => result.concat(page.results.map(r => r.id)), []);
    actions.removeReleases(releases);
    actions.removeResults(id);
  };
  return {
    addSearch, addAlbum, addResults, addRelease, abort, clear,
  };
};

module.exports = (spotify, db, createLogger) => (id) => {
  const albumRejection = (reason) => {
    const code = String(reason.statusCode);
    if (code in spotifyErrorMessages.http) {
      return Error(spotifyErrorMessages.http[code]);
    }
    return Error(spotifyErrorMessages.general);
  };

  const discogs = new DiscogFinder(db);

  const start = () => new Promise((resolve, reject) => {
    const output = actionsWrapper(id);
    spotify.getApi()
      .then((api) => {
        output.addSearch(id);
        return api.getAlbum(id);
      }, () => reject(Error(spotifyErrorMessages.login)))
      .then(({ body }) => {
        const album = body;
        output.addAlbum(album);
        const logger = createLogger(album);
        discogs.findReleases(album).subscribe(observer(logger, output));
        resolve({ id, progress: 0, bestMatch: null });
      }, (reason) => {
        reject(albumRejection(reason));
        output.abort();
      }).catch(reject);
  });

  return { start };
};
