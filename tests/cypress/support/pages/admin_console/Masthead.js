export default class Masthead {
  constructor() {
    this.isMobileMode = false;

    this.menuBtn = "#nav-toggle";
    this.logoBtn = "#masthead-logo";
    this.helpBtn = "#help";

    this.userDrpDwn = "#user-dropdown";
    this.userDrpDwnKebab = "#user-dropdown-kebab";
  }

  isAdminConsole() {
    cy.get(this.logoBtn).should("exist");
    cy.get(this.userDrpDwn).should("exist");

    return this;
  }

  isMobileMode() {
    return this.isMobileMode;
  }

  setMobileMode(isMobileMode) {
    if (isMobileMode) {
      cy.viewport("iphone-6");
    } else {
      cy.viewport();
    }

    this.isMobileMode = isMobileMode;
  }

  toggleGlobalHelp() {
    cy.get("#help").click();
    cy.get("#enableHelp").click({ force: true });
  }

  userDropdown() {
    if (this.isMobileMode) {
      return cy.get(this.userDrpDwnKebab);
    } else {
      return cy.get(this.userDrpDwn);
    }
  }

  signOut() {
    this.userDropdown().click();
    cy.get("#sign-out").click();
  }

  accountManagement() {
    this.userDropdown().click();
    cy.get("#manage-account").click();
  }

  checkNotificationMessage(message) {
    cy.contains(message).should("exist");

    return this;
  }
}
