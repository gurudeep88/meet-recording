import {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';
import Home from './views/Home';
import Leave from './views/Leave';
import Meeting from './views/Meeting';

import ReactGA from 'react-ga4';		
ReactGA.initialize('G-R8QNV9RCFF');		
ReactGA.send("pageview");

function App() {
    return (
        <Fragment>
            <Switch>
                <Route exact path="/leave" component={Leave} />
                <Route exact path="/:meetingId" component={Meeting}/>
                <Route exact path="/" component={Home} />
            </Switch>
        </Fragment>
    );
}

export default App;
