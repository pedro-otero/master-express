const express = require('express');
const router = express.Router();

const { store, actions } = require('./state');
const match = require('./search/comparators/filters');
const buildAlbum = require('./build');
const matchAlbum = require('./match');

function searchAlbum(spotifyApi, spotifyAlbumId, discogify) {

  const doCatch = e => {
    console.log(e);
    return;
  };

  spotifyApi
    .then(api => {
      actions.addSearch(spotifyAlbumId);
      return api.getAlbum(spotifyAlbumId);
    })
    .then(response => {
      const album = response.body;
      actions.addAlbum(album);
      return album;
    })
    .then(album => {
      discogify.findReleases(album).catch(doCatch);
    })
    .catch(doCatch);
}

router.get('/:spotifyAlbumId', function (req, res) {

  const { discogify, spotifyApi } = req.app.locals;
  const { spotifyAlbumId } = req.params;

  const search = store.getState().searches.find(item => item.id === spotifyAlbumId);

  if (search) {
    const results = {
      masters: store.getState().results.masters
        .filter(result => result.album === spotifyAlbumId)
        .reduce((all, current) => all.concat(current.page.results), [])
        .map(item => item.id),
      releases: store.getState().results.releases
        .filter(result => result.album === spotifyAlbumId)
        .reduce((all, current) => all.concat(current.page.results), [])
        .map(item => item.id),
    };
    const releases = store.getState().releases
      .filter(release => results.masters.includes(release.master_id))
      .concat(store.getState().releases
        .filter(release => results.releases.includes(release.id)));
    const album = store.getState().albums.find(album => album.id === spotifyAlbumId);
    const filtered = match(album).by('tracklist')(releases);
    const release = matchAlbum(album, filtered);
    const builtAlbum = buildAlbum(album, release);
    res.json(Object.assign(search, {
      built: filtered.map(release => buildAlbum(album, release)),
      bestMatch: builtAlbum
    }));
  } else {
    searchAlbum(spotifyApi, spotifyAlbumId, discogify);
    res.status(201).json({ id: spotifyAlbumId, status: 'CREATED' });
  }
  return;
});

module.exports = router;