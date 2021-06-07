import SidebarPage from "../support/pages/admin_console/SidebarPage";
import LoginPage from "../support/pages/LoginPage";
import RealmSettingsPage from "../support/pages/admin_console/manage/realm_settings/RealmSettingsPage";
import Masthead from "../support/pages/admin_console/Masthead";
import ModalUtils from "../support/util/ModalUtils";
import { keycloakBefore } from "../support/util/keycloak_before";
import AdminClient from "../support/util/AdminClient";
import ListingPage from "../support/pages/admin_console/ListingPage";

// describe("Realm settings test", () => {
const loginPage = new LoginPage();
const sidebarPage = new SidebarPage();
  const masthead = new Masthead();
  const modalUtils = new ModalUtils();
const realmSettingsPage = new RealmSettingsPage();

describe("Realm settings", () => {
  const realmName = "Realm_" + (Math.random() + 1).toString(36).substring(7);

  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    sidebarPage.goToRealm(realmName);
  });

  before(async () => {
    await new AdminClient().createRealm(realmName);
  });

  // after(async () => {
  //   await new AdminClient().deleteRealm(realmName);
  // });

  it("Go to general tab", function () {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.toggleSwitch(realmSettingsPage.managedAccessSwitch);
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    realmSettingsPage.toggleSwitch(realmSettingsPage.managedAccessSwitch);
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
  });

  it("Go to login tab", function () {
    sidebarPage.goToRealmSettings();
    cy.getId("rs-login-tab").click();
    realmSettingsPage.toggleSwitch(realmSettingsPage.userRegSwitch);
    realmSettingsPage.toggleSwitch(realmSettingsPage.forgotPwdSwitch);
    realmSettingsPage.toggleSwitch(realmSettingsPage.rememberMeSwitch);
    realmSettingsPage.toggleSwitch(realmSettingsPage.verifyEmailSwitch);
  });

  it("Go to email tab", function () {
    sidebarPage.goToRealmSettings();
    cy.getId("rs-email-tab").click();

    cy.wait(1000);

    realmSettingsPage.addSenderEmail("example@example.com");

    realmSettingsPage.toggleCheck(realmSettingsPage.enableSslCheck);
    realmSettingsPage.toggleCheck(realmSettingsPage.enableStartTlsCheck);

    realmSettingsPage.save(realmSettingsPage.emailSaveBtn);
  });

  it("Go to themes tab", function () {
    cy.wait(5000);
    sidebarPage.goToRealmSettings();
    cy.getId("rs-themes-tab").click();
    realmSettingsPage.selectLoginThemeType("keycloak");
    realmSettingsPage.selectAccountThemeType("keycloak");
    realmSettingsPage.selectAdminThemeType("base");
    realmSettingsPage.selectEmailThemeType("base");

    realmSettingsPage.saveThemes();
    });

    describe("Events tab", () => {
      const listingPage = new ListingPage();

      it("Enable user events", () => {
        sidebarPage.goToRealmSettings();
        cy.getId("rs-realm-events-tab").click();

        realmSettingsPage
          .toggleSwitch(realmSettingsPage.enableEvents)
          .save(realmSettingsPage.eventsUserSave);
        masthead.checkNotificationMessage("Successfully saved configuration");

        realmSettingsPage.clearEvents("user");

        modalUtils
          .checkModalMessage(
            "If you clear all events of this realm, all records will be permanently cleared in the database"
          )
          .confirmModal();

        masthead.checkNotificationMessage("The user events have been cleared");
      });

      it("Add event types", () => {
        sidebarPage.goToRealmSettings();
        cy.getId("rs-realm-events-tab").click();

        const events = ["Client info", "Client info error"];

        cy.intercept("GET", `/auth/admin/realms/${realmName}/events/config`).as(
          "fetchConfig"
        );
        realmSettingsPage.addUserEvents(events).clickAdd();
        masthead.checkNotificationMessage("Successfully saved configuration");
        cy.wait(["@fetchConfig"]);

        for (const event of events) {
          listingPage.searchItem(event, false).itemExist(event);
        }
      });
  });

  it("Go to keys tab", function () {
    cy.wait(5000);

    sidebarPage.goToRealmSettings();

    cy.getId("rs-keys-tab").click();
  });

  it("add Providers", function () {
    cy.wait(5000);
    sidebarPage.goToRealmSettings();

    cy.getId("rs-keys-tab").click();

    cy.wait(10000);

    cy.getId("rs-providers-tab").click();

    realmSettingsPage.toggleAddProviderDropdown();

    cy.getId("option-aes-generated").click();
    realmSettingsPage.enterConsoleDisplayName("test_aes-generated");
    cy.wait(200);
    realmSettingsPage.addProvider();

    realmSettingsPage.toggleAddProviderDropdown();

    cy.getId("option-ecdsa-generated").click();
    realmSettingsPage.enterConsoleDisplayName("test_ecdsa-generated");
    cy.wait(200);
    realmSettingsPage.addProvider();

    realmSettingsPage.toggleAddProviderDropdown();

    cy.getId("option-hmac-generated").click();
    realmSettingsPage.enterConsoleDisplayName("test_hmac-generated");
    cy.wait(200);
    realmSettingsPage.addProvider();

    realmSettingsPage.toggleAddProviderDropdown();

    cy.getId("option-rsa-generated").click();
    realmSettingsPage.enterConsoleDisplayName("test_rsa-generated");
    realmSettingsPage.addProvider();
  });
});
// });

    describe("Events tab", () => {
      const listingPage = new ListingPage();

      it("Enable user events", () => {
        sidebarPage.goToRealmSettings();
        cy.getId("rs-realm-events-tab").click();

        realmSettingsPage
          .toggleSwitch(realmSettingsPage.enableEvents)
          .save(realmSettingsPage.eventsUserSave);
        masthead.checkNotificationMessage("Successfully saved configuration");

        realmSettingsPage.clearEvents("user");

        modalUtils
          .checkModalMessage(
            "If you clear all events of this realm, all records will be permanently cleared in the database"
          )
          .confirmModal();

        masthead.checkNotificationMessage("The user events have been cleared");
      });

      it("Add event types", () => {
        sidebarPage.goToRealmSettings();
        cy.getId("rs-realm-events-tab").click();

        const events = ["Client info", "Client info error"];

        cy.intercept("GET", `/auth/admin/realms/${realmName}/events/config`).as(
          "fetchConfig"
        );
        realmSettingsPage.addUserEvents(events).clickAdd();
        masthead.checkNotificationMessage("Successfully saved configuration");
        cy.wait(["@fetchConfig"]);

        for (const event of events) {
          listingPage.searchItem(event, false).itemExist(event);
        }
      });
    });