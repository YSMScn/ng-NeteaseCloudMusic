const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 8080;
app.use(express.static('dist'));
app.use('/**', createProxyMiddleware({ target: "http://localhost:3000", changeOrigin: true }));
app.listen(PORT, function(err) {
  if (err) {
    console.log('err :', err);
  } else {
    console.log('Listen at http://localhost:' + PORT);
  }
});
