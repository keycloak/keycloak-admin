import React from "react";
import { Page } from "@patternfly/react-core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Header } from "./PageHeader";
import { PageNav } from "./PageNav";
import { Help } from "./components/help-enabler/HelpHeader";

import { RealmContextProvider } from "./components/realm-context/RealmContext";

import { routes } from "./route-config";

export const App = () => {
  return (
    <Router>
      <RealmContextProvider>
        <Help>
          <Page header={<Header />} isManagedSidebar sidebar={<PageNav />}>
            <Switch>
              {routes(() => {}).map((route, i) => (
                <Route key={i} {...route} exact />
              ))}
            </Switch>
          </Page>
        </Help>
      </RealmContextProvider>
    </Router>
  );
};
