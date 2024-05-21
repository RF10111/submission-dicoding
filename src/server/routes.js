// routes.js
const { postPredictHandler, getPredictHistoriesHandler } = require('../server/handler');

const routes = [
  // Rute untuk melakukan prediksi
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000  // Limit image size to 1MB
      }
    }
  },
  // Rute untuk mendapatkan histori prediksi
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getPredictHistoriesHandler
  }
];

module.exports = routes;
