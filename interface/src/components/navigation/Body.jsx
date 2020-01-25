import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ActorsPage from '../../pages/actors/ActorsPage';
import HomePage from '../../pages/home/HomePage';
import InitializePage from '../../pages/initialize/InitializePage';
import CreateTaskPage from '../../pages/tasks/CreateTaskPage';


const Body = () => (
    <div style={{ overflow: 'hidden' }}>
        <Switch>
            <Route exact path="/marketplace" component={HomePage} />
            <Route exact path="/marketplace/actors" component={ActorsPage} />
            <Route exact path="/marketplace/initialize" component={InitializePage} />
            <Route exact path="/marketplace/tasks/create" component={CreateTaskPage} />
        </Switch>
    </div>
)

export default Body;