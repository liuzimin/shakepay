import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainScreen from '../components/screens/MainScreen/MainScreen';
import WelcomeScreen from '../components/screens/WelcomeScreen/WelcomeScreen';


const RootRouter = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path='/'>
          <WelcomeScreen />
          </Route>
          <Route path='/net-worth'>
            <MainScreen />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default RootRouter;
