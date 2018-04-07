const SpotifyWebApi = require('spotify-web-api-node');
const winston = require('winston');

const spotifyConfig = require('../../spotify-config.json');

const spotifyApi = new SpotifyWebApi({
  clientId: spotifyConfig.keys.consumer,
  clientSecret: spotifyConfig.keys.secret,
  redirectUri: spotifyConfig.urls.redirect,
});

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
  ],
});

const api = new Promise((resolve, reject) => {
  spotifyApi.clientCredentialsGrant().then((response) => {
    if (response.statusCode === 200) {
      const token = response.body.access_token;
      spotifyApi.setAccessToken(token);
      logger.info('Spotify client authenticated succesfully');
      resolve(spotifyApi);
    } else {
      logger.error(`ERRROR AUTHENTICATING ${JSON.stringify(response)}`);
      reject(response);
    }
  });
});

module.exports = api;
