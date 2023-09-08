const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = (app) => {
  app.use('http://localhost:3000', createProxyMiddleware({ target: 'http://218.232.175.4:49156', changeOrigin: true }));

}

