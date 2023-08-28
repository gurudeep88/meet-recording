import {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';
import Home from './views/Home';
import Leave from './views/Leave';
import Meeting from './views/Meeting';

function App() {
    return (
        <Fragment>
            <Switch>
                <Route exact path="/meet/leave" component={Leave} />
                <Route exact path="/meet/:meetingId" component={Meeting}/>
                <Route exact path="/meet" component={Home} />
            </Switch>
        </Fragment>
    );
}

export default App;
