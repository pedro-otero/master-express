const {
  ADD_SEARCH,
  ADD_ALBUM,
  ADD_RELEASE,
  ADD_RELEASE_RESULTS,
  PUT_ERRORS,
  REMOVE_SEARCH,
} = require('./constants');

const addSearch = id => ({
  type: ADD_SEARCH,
  id,
});

const addAlbum = album => ({
  type: ADD_ALBUM,
  album,
});

const addRelease = release => ({
  type: ADD_RELEASE,
  release,
});

const releaseResults = (album, page) => ({
  type: ADD_RELEASE_RESULTS,
  album,
  page,
});

const putError = (id, error) => ({
  type: PUT_ERRORS,
  id,
  errors: [error],
});

const removeSearch = (id) => ({
  type: REMOVE_SEARCH,
  id,
});

module.exports = {
  addSearch,
  addAlbum,
  addRelease,
  releaseResults,
  putError,
  removeSearch,
};
