import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ActorsPage from '../../pages/actors/ActorsPage';
import HomePage from '../../pages/home/HomePage';
import InitializePage from '../../pages/initialize/InitializePage';


const Body = () => (
    <div style={{ overflow: 'hidden' }}>
        <Switch>
            <Route exact path="/marketplace" component={HomePage} />
            <Route exact path="/marketplace/actors" component={ActorsPage} />
            <Route exact path="/marketplace/initialize" component={InitializePage} />
        </Switch>
    </div>
)

export default Body;