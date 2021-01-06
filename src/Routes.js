import React from "react";
import { Router, Switch, Route, Link } from "react-router-dom";
import {ConversationsList} from "./components";
import { Messages } from "./components/Messages/Messages";
import history from './history';

export function Routes({ conversations }) {
    return (
        <Router history={history}>
            <div>
                <Link to="/">Home</Link>
                <Switch>
                    <Route exact path="/">
                        <ConversationsList
                            conversations={conversations}
                        />
                    </Route>
                    <Route
                        path="/messages/:conversationSid"
                        render={(props) => (
                            <Messages {...props} conversations={conversations} />
                        )}
                    />
                    <Route>
                        {/* needed for KaiOS */}
                        <ConversationsList
                            conversations={conversations}
                        />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
