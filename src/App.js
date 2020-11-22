import React from 'react';
import Home from './components/Home';
import Test from './components/Test';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router';

import './App.css';

const NoMatch = () => (
    <div>
      <h1>404</h1>
      React Page Not Found
    </div>
);

const AppRoutes = () => (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/test" component={Test} exact />


      <Route render={NoMatch} />
    </Switch>
)

export default class App extends React.Component  {
  constructor(props){
    super(props);
    this.props = props;
  };
  render() {
    return (
            this.props.location
                ? (
                    <StaticRouter location={this.props.location} context={{}}>
                      <AppRoutes/>
                    </StaticRouter>
                ) : (
                    <BrowserRouter>
                      <AppRoutes/>
                    </BrowserRouter>
                )
    );
  }
}