export default {
  "realm-settings-help": {
    fromDisplayName: "A user-friendly name for the 'From' address (optional).",
    replyToDisplayName:
      "A user-friendly name for the 'Reply-To' address (optional).",
    envelopeFrom: "An email address used for bounces (optional).",
    password:
      "SMTP password. This field is able to obtain its value from vault, use ${vault.ID} format.",
    frontendUrl:
      "Set the frontend URL for the realm. Use in combination with the default hostname provider to override the base URL for frontend requests for a specific realm.",
    requireSsl:
      "Is HTTPS required? 'None' means HTTPS is not required for any client IP address. 'External requests' means localhost and private IP addresses can access without HTTPS. 'All requests' means HTTPS is required for all IP addresses.",
    userManagedAccess:
      "If enabled, users are allowed to manage their resources and permissions using the Account Management Console.",
    endpoints: "Shows the configuration of the protocol endpoints",
    loginTheme:
      "Select theme for login, OTP, grant, registration and forgot password pages.",
    accountTheme: "Select theme for user account management pages.",
    adminConsoleTheme: "Select theme for admin console.",
    emailTheme: "Select theme for emails that are sent by the server.",
    displayName: "Display name of provider when linked in admin console",
    priority: "Priority of the provider",
    enabled: "Set if the keys are enabled",
    active: "Set if the keys can be used for signing",
    AESKeySize:
      "Size in bytes for the generated AES key. Size 16 is for AES-128, Size 24 for AES-192, and Size 32 for AES-256. WARN: Bigger keys than 128 are not allowed on some JDK implementations.",
    "save-user-events":
      "If enabled, login events are saved to the database, which makes events available to the admin and account management consoles.",
    "save-admin-events":
      "If enabled, admin events are saved to the database, which makes events available to the admin console.",
    expiration:
      "Sets the expiration for events. Expired events are periodically deleted from the database.",
    "admin-clearEvents": "Deletes all admin events in the database.",
    includeRepresentation:
      "Include JSON representation for create and update requests.",
    "user-clearEvents": "Deletes all user events in the database.",
    ellipticCurve: "Elliptic curve used in ECDSA",
    secretSize: "Size in bytes for the generated secret",
    algorithm: "Intended algorithm for the key",
    keystore: "Path to keys file",
    keystorePassword: "Password for the keys",
    keyAlias: "Alias for the private key",
    keyPassword: "Password for the private key",
    privateRSAKey: "Private RSA Key encoded in PEM format",
    x509Certificate: "X509 Certificate encoded in PEM format",
    xFrameOptions:
      "Default value prevents pages from being included by non-origin iframes <1>Learn more</1>",
    contentSecurityPolicy:
      "Default value prevents pages from being included by non-origin iframes <1>Learn more</1>",
    contentSecurityPolicyReportOnly:
      "For testing Content Security Policies <1>Learn more</1>",
    xContentTypeOptions:
      "Default value prevents Internet Explorer and Google Chrome from MIME-sniffing a response away from the declared content-type <1>Learn more</1>",
    xRobotsTag:
      "Prevent pages from appearing in search engines <1>Learn more</1>",
    xXSSProtection:
      "Prevent pages from appearing in search engines <1>Learn more</1>",
    strictTransportSecurity:
      "The Strict-Transport-Security HTTP header tells browsers to always use HTTPS. Once a browser sees this header, it will only visit the site over HTTPS for the time specified (1 year) at max-age, including the subdomains. <1>Learn more</1>",
    failureFactor: "How many failures before wait is triggered.",
    permanentLockout:
      "Lock the user permanently when the user exceeds the maximum login failures.",
    waitIncrement:
      "When failure threshold has been met, how much time should the user be locked out?",
    maxFailureWait: "Max time a user will be locked out.",
    maxDeltaTime: "When will failure count be reset?",
    quickLoginCheckMilliSeconds:
      "If a failure happens concurrently too quickly, lock out the user.",
    minimumQuickLoginWait: "How long to wait after a quick login failure.",
  },
};
