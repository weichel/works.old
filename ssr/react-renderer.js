const React = require('react');
const renderToString = require('react-dom/server').renderToString;
const matchPath = require('react-router').matchPath;
const path = require('path');
const fs = require('fs');

const App = require('../src/App').default;

exports = module.exports;

exports.render = (routes) => {
  return (req, res, next) => {

    let match = routes.find(route => matchPath(req.path, {
      path: route,
      exact: true,
    }));

    const is404 = req._possible404;

    if (match || is404) {
      const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

      fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
          console.error('err', err);
          return res.status(404).end(); // WARNING: This 404 will be handled by Express server and won't be your React 404 component.
        }

        const location = req.url;

        if (is404) {
          res.writeHead(404, { 'Content-Type': 'text/html' })
          console.log(`SSR of unrouted path ${req.path} (404 ahead)`)
        }
        else {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          console.log(`SSR of ${req.path}`);
        }

        const store = configureStore(initialState);
        const jsx = <App store={store} location={location}/>
        const reactDom = renderToString(jsx);
        console.log(reactDom);

        return res.end(
          htmlData.replace(
            '<div id="root"></div>',
            `<div id="root">${reactDom}</div>`
          ).replace('__REDUX__',
            JSON.stringify(store.getState()))
        );
      });
    }
    else { req._possible404 = true; return next(); }
  };
};
