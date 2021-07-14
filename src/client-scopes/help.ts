export default {
  "client-scopes-help": {
    name: "Name of the client scope. Must be unique in the realm. Name should not contain space characters as it is used as value of scope parameter",
    description: "Description of the client scope",
    protocol:
      "Which SSO protocol configuration is being supplied by this client scope",
    type: "Client scopes, which will be added as default scopes to each created client",
    displayOnConsentScreen:
      "If on, and this client scope is added to some client with consent required, the text specified by 'Consent Screen Text' will be displayed on consent screen. If off, this client scope will not be displayed on the consent screen",
    consentScreenText:
      "Text that will be shown on the consent screen when this client scope is added to some client with consent required. Defaults to name of client scope if it is not filled",
    includeInTokenScope:
      "If on, the name of this client scope will be added to the access token property 'scope' as well as to the Token Introspection Endpoint response. If off, this client scope will be omitted from the token and from the Token Introspection Endpoint response.",
    guiOrder:
      "Specify order of the provider in GUI (such as in Consent page) as integer",
    prefix: "A prefix for each Realm Role (optional).",
    multiValued:
      "Indicates if attribute supports multiple values. If true, the list of all values of this attribute will be set as claim. If false, just first value will be set as claim",
    tokenClaimName:
      "Name of the claim to insert into the token. This can be a fully qualified name like 'address.street'. In this case, a nested json object will be created. To prevent nesting and use dot literally, escape the dot with backslash (\\.).",
    claimJsonType:
      "JSON type that should be used to populate the json claim in the token. long, int, boolean, String and JSON are valid values.",
    protocolMapper: "Protocol...",
    mapperName: "Name of the mapper",
    role: "Role name you want changed. Click 'Select Role' button to browse roles, or just type it in the textbox. To reference an application role the syntax is appname.approle, i.e. myapp.myrole",
    newRoleName:
      "The new role name.  The new name format corresponds to where in the access token the role will be mapped to.  So, a new name of 'myapp.newname' will map the role to that position in the access token.  A new name of 'newname' will map the role to the realm roles in the token.",
  },
};
