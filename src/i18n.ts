import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import backend from "i18next-http-backend";

import common from "./common-messages.json";
import help from "./common-help.json";
import dashboard from "./dashboard/messages.json";
import clients from "./clients/messages.json";
import clientsHelp from "./clients/help.json";
import clientScopes from "./client-scopes/messages.json";
import clientScopesHelp from "./client-scopes/help.json";
import groups from "./groups/messages.json";
import realm from "./realm/messages.json";
import roles from "./realm-roles/messages.json";
import users from "./user/messages.json";
import usersHelp from "./user/help.json";
import sessions from "./sessions/messages.json";
import events from "./events/messages.json";
import realmSettings from "./realm-settings/messages.json";
import realmSettingsHelp from "./realm-settings/help.json";
import authentication from "./authentication/messages.json";
import storybook from "./stories/messages.json";
import userFederation from "./user-federation/messages.json";
import userFederationHelp from "./user-federation/help.json";
import identityProviders from "./identity-providers/messages.json";
import identityProvidersHelp from "./identity-providers/help.json";

const initOptions = {
  defaultNS: "common",
  resources: {
    en: {
      ...common,
      ...help,
      ...dashboard,
      ...clients,
      ...clientsHelp,
      ...clientScopes,
      ...clientScopesHelp,
      ...groups,
      ...realm,
      ...roles,
      ...groups,
      ...users,
      ...usersHelp,
      ...sessions,
      ...userFederation,
      ...events,
      ...realmSettings,
      ...realmSettingsHelp,
      ...authentication,
      ...identityProviders,
      ...identityProvidersHelp,
      ...userFederation,
      ...userFederationHelp,
      ...storybook,
    },
  },
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
};

i18n
  .use(initReactI18next)
  // .use(backend)
  .init(initOptions);

export default i18n;
