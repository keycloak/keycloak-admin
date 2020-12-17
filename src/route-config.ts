import { TFunction } from "i18next";
import { AccessType } from "keycloak-admin/lib/defs/whoAmIRepresentation";

import { AuthenticationSection } from "./authentication/AuthenticationSection";
import { ClientScopeForm } from "./client-scopes/form/ClientScopeForm";
import { ClientScopesSection } from "./client-scopes/ClientScopesSection";
import { NewClientForm } from "./clients/add/NewClientForm";
import { ClientsSection } from "./clients/ClientsSection";
import { ImportForm } from "./clients/import/ImportForm";
import { EventsSection } from "./events/EventsSection";
import { GroupsSection } from "./groups/GroupsSection";
import { IdentityProvidersSection } from "./identity-providers/IdentityProvidersSection";
import { PageNotFoundSection } from "./PageNotFoundSection";
import { RealmRolesForm } from "./realm-roles/RealmRoleForm";
import { RealmRolesSection } from "./realm-roles/RealmRolesSection";
import { RealmSettingsSection } from "./realm-settings/RealmSettingsSection";
import { NewRealmForm } from "./realm/add/NewRealmForm";
import { SessionsSection } from "./sessions/SessionsSection";
import { UserFederationSection } from "./user-federation/UserFederationSection";
import { UsersSection } from "./user/UsersSection";
import { MappingDetails } from "./client-scopes/details/MappingDetails";
import { ClientDetails } from "./clients/ClientDetails";
import { UserFederationKerberosSettings } from "./user-federation/UserFederationKerberosSettings";
import { UserFederationLdapSettings } from "./user-federation/UserFederationLdapSettings";
import { RoleMappingForm } from "./client-scopes/add/RoleMappingForm";

export type RouteDef = {
  path: string;
  component: () => JSX.Element;
  breadcrumb: TFunction | null;
  access: AccessType;
};

type RoutesFn = (t: TFunction) => RouteDef[];

export const routes: RoutesFn = (t) => [
  {
    path: "/:realm/add-realm",
    component: NewRealmForm,
    breadcrumb: t("realm:createRealm"),
    access: "manage-realm",
  },
  {
    path: "/:realm/clients",
    component: ClientsSection,
    breadcrumb: t("clients:clientList"),
    access: "query-clients",
  },
  {
    path: "/:realm/clients/add-client",
    component: NewClientForm,
    breadcrumb: t("clients:createClient"),
    access: "manage-clients",
  },
  {
    path: "/:realm/clients/import-client",
    component: ImportForm,
    breadcrumb: t("clients:importClient"),
    access: "manage-clients",
  },
  {
    path: "/:realm/clients/:id",
    component: ClientDetails,
    breadcrumb: t("clients:clientSettings"),
    access: "view-clients",
  },
  {
    path: "/:realm/client-scopes/new",
    component: ClientScopeForm,
    breadcrumb: t("client-scopes:createClientScope"),
    access: "manage-clients",
  },
  {
    path: "/:realm/client-scopes/:id",
    component: ClientScopeForm,
    breadcrumb: t("client-scopes:clientScopeDetails"),
    access: "view-clients",
  },
  {
    path: "/:realm/client-scopes/:scopeId/oidc-role-name-mapper",
    component: RoleMappingForm,
    breadcrumb: t("client-scopes:mappingDetails"),
    access: "view-clients",
  },
  {
    path: "/:realm/client-scopes/:scopeId/:id",
    component: MappingDetails,
    breadcrumb: t("client-scopes:mappingDetails"),
    access: "view-clients",
  },
  {
    path: "/:realm/client-scopes/:id",
    component: ClientScopeForm,
    breadcrumb: t("client-scopes:clientScopeDetails"),
    access: "view-clients",
  },
  {
    path: "/:realm/client-scopes",
    component: ClientScopesSection,
    breadcrumb: t("client-scopes:clientScopeList"),
    access: "view-clients",
  },
  {
    path: "/:realm/roles",
    component: RealmRolesSection,
    breadcrumb: t("roles:roleList"),
    access: "view-realm",
  },
  {
    path: "/:realm/roles/add-role",
    component: RealmRolesForm,
    breadcrumb: t("roles:createRole"),
    access: "manage-realm",
  },
  {
    path: "/:realm/roles/:id",
    component: RealmRolesForm,
    breadcrumb: t("roles:roleDetails"),
    access: "view-realm",
  },
  {
    path: "/:realm/users",
    component: UsersSection,
    breadcrumb: t("users:title"),
    access: "query-users",
  },
  {
    path: "/:realm/groups",
    component: GroupsSection,
    breadcrumb: t("groups"),
    access: "query-groups",
  },
  {
    path: "/:realm/sessions",
    component: SessionsSection,
    breadcrumb: t("sessions:title"),
    access: "view-realm",
  },
  {
    path: "/:realm/events",
    component: EventsSection,
    breadcrumb: t("events:title"),
    access: "view-events",
  },
  {
    path: "/:realm/realm-settings",
    component: RealmSettingsSection,
    breadcrumb: t("realmSettings"),
    access: "view-realm",
  },
  {
    path: "/:realm/authentication",
    component: AuthenticationSection,
    breadcrumb: t("authentication"),
    access: "view-realm",
  },
  {
    path: "/:realm/identity-providers",
    component: IdentityProvidersSection,
    breadcrumb: t("identityProviders"),
    access: "view-identity-providers",
  },
  {
    path: "/:realm/user-federation",
    component: UserFederationSection,
    breadcrumb: t("userFederation"),
    access: "view-realm",
  },
  {
    path: "/:realm/user-federation/kerberos",
    component: UserFederationSection,
    breadcrumb: null,
    access: "view-realm",
  },
  {
    path: "/:realm/user-federation/ldap",
    component: UserFederationSection,
    breadcrumb: null,
    access: "view-realm",
  },
  {
    path: "/:realm/user-federation/kerberos/:id",
    component: UserFederationKerberosSettings,
    breadcrumb: t("common:settings"),
    access: "view-realm",
  },
  {
    path: "/:realm/user-federation/ldap/:id",
    component: UserFederationLdapSettings,
    breadcrumb: t("common:settings"),
    access: "view-realm",
  },
  {
    path: "/:realm/",
    component: ClientsSection,
    breadcrumb: t("common:home"),
    access: "anyone",
  },
  {
    path: "*",
    component: PageNotFoundSection,
    breadcrumb: null,
    access: "anyone",
  },
];
