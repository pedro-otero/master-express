const similarity = require('string-similarity').compareTwoStrings;

module.exports = (album) => {

  const {
    name,
    artists,
    album_type,
    release_date,
    tracks
  } = album;

  const filters = {

    'title': result => !!result.title.match(`.+ - ${name.replace(/(.+) \((.+)\)/, '$1').toUpperCase()}`),

    'exact title': result => similarity(
      result.title,
      (`${artists[0].name.toUpperCase()} - ${name.replace(/(.+) \((.+)\)/, '$1').toUpperCase()}`)) === 1,

    'format': result => result.format.includes(album_type.toUpperCase()),

    'year': result => result.year == release_date.substr(0, 4),

    'tracklist': result => result.tracklist.length == tracks.items.length &&
      tracks.items.map(track => track.name.toUpperCase()).every((track, i) => {
        const titles = [track, result.tracklist[i]]
          .map(title => title.replace(/(.+) \((.+)\)/, '$1 - $2'))
          .map(title => title.split(' - ')[0]);
        return similarity(titles[0], titles[1]) === 1;
      }),

    'release date': result => result.released == release_date

  };

  const convert = result => ({
    id: result.id,
    title: (result.title || '').toUpperCase(),
    format: ((typeof result.format === 'string') ? result.format.split(', ') : (result.format || [])).map(format => format.toUpperCase()),
    tracklist: (result.tracklist || []).map(track => track.title.toUpperCase()),
    released: result.released,
    year: result.year
  });

  const by = currentFilter => result => ({ match: filters[currentFilter](convert(result)) });

  return Object.keys(filters).reduce((instance, filter) => {
    instance[`by${
      filter
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')
    }`] = by(filter);
    return instance;
  }, {});
};