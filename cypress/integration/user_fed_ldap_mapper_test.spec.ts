import LoginPage from "../support/pages/LoginPage";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import ListingPage from "../support/pages/admin_console/ListingPage";
import GroupModal from "../support/pages/admin_console/manage/groups/GroupModal";
import ProviderPage from "../support/pages/admin_console/manage/providers/ProviderPage";
import Masthead from "../support/pages/admin_console/Masthead";
import ModalUtils from "../support/util/ModalUtils";
import { keycloakBefore } from "../support/util/keycloak_before";

const loginPage = new LoginPage();
const masthead = new Masthead();
const sidebarPage = new SidebarPage();
const listingPage = new ListingPage();
const groupModal = new GroupModal();

const providersPage = new ProviderPage();
const modalUtils = new ModalUtils();

const provider = "ldap";
const allCapProvider = provider.toUpperCase();

const ldapName = "ldap-mappers-testing";
const ldapVendor = "Active Directory";

const connectionUrl = "ldap://";
const firstBindType = "simple";
const firstBindDn = "user-1";
const firstBindCreds = "password1";

const firstUsersDn = "user-dn-1";
const firstUserLdapAtt = "uid";
const firstRdnLdapAtt = "uid";
const firstUuidLdapAtt = "entryUUID";
const firstUserObjClasses = "inetOrgPerson, organizationalPerson";

const addProviderMenu = "Add new provider";
const providerCreatedSuccess = "User federation provider successfully created";
const mapperCreatedSuccess = "Mapping successfully created";
const providerDeleteSuccess = "The user federation provider has been deleted.";
const providerDeleteTitle = "Delete user federation provider?";
// const savedSuccessMessage = "User federation provider successfully saved";
const mapperDeletedSuccess = "Mapping successfully deleted";
const mapperDeleteTitle = "Delete mapping?";
// const disableModalTitle = "Disable user federation provider?";

const groupName = "my-mappers-group";

// mapperType variables
const msadUserAcctMapper = "msad-user-account-control-mapper";
const msadLdsUserAcctMapper = "msad-lds-user-account-control-mapper";
const userAttLdapMapper = "user-attribute-ldap-mapper";
const hcAttMapper = "hardcoded-attribute-mapper";
const certLdapMapper = "certificate-ldap-mapper";
const fullNameLdapMapper = "full-name-ldap-mapper";
const hcLdapGroupMapper = "hardcoded-ldap-group-mapper";
const hcLdapAttMapper = "hardcoded-ldap-attribute-mapper";
// const groupLdapMapper = "group-ldap-mapper";
// const roleMapper = "role-ldap-mapper";
// const hcLdapRoleMapper = "hardcoded-ldap-role-mapper";

const creationDateMapper = "creation date";
const emailMapper = "email";
const lastNameMapper = "last name";
const modifyDateMapper = "modify date";
const usernameMapper = "username";
const firstNameMapper = "first name";





describe("User Fed LDAP mapper tests", () => {
  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    sidebarPage.goToUserFederation();
  });

  it("Create LDAP provider from empty state", () => {
    // if tests don't start at empty state, e.g. user has providers configured locally,
    // create a new card from the card view instead
    cy.get("body").then(($body) => {
      if ($body.find(`[data-testid=ldap-card]`).length > 0) {
        providersPage.clickNewCard(provider);
      } else {
        providersPage.clickMenuCommand(addProviderMenu, allCapProvider);
      }
    });
    providersPage.fillLdapRequiredGeneralData(ldapName, ldapVendor);
    providersPage.fillLdapRequiredConnectionData(
      connectionUrl,
      firstBindType,
      firstBindDn,
      firstBindCreds
    );
    providersPage.fillLdapRequiredSearchingData(
      firstUsersDn,
      firstUserLdapAtt,
      firstRdnLdapAtt,
      firstUuidLdapAtt,
      firstUserObjClasses
    );

    providersPage.save(provider);

    masthead.checkNotificationMessage(providerCreatedSuccess);
    sidebarPage.goToUserFederation();
  });

  // create a new group
  it("Create group", () => {
    sidebarPage.goToGroups();
    groupModal
      .open("empty-primary-action")
      .fillGroupForm(groupName)
      .clickCreate();

    masthead.checkNotificationMessage("Group created");
  });

  // delete default mappers
  it("Delete default mappers", () => {
    providersPage.clickExistingCard(ldapName);
    providersPage.goToMappers();

    listingPage.itemExist(creationDateMapper).deleteItem(creationDateMapper);
    modalUtils.checkModalTitle(mapperDeleteTitle).confirmModal();
    masthead.checkNotificationMessage(mapperDeletedSuccess);
    listingPage.itemExist(creationDateMapper, false);
  
    listingPage.itemExist(emailMapper).deleteItem(emailMapper);
    modalUtils.checkModalTitle(mapperDeleteTitle).confirmModal();
    masthead.checkNotificationMessage(mapperDeletedSuccess);
    listingPage.itemExist(emailMapper, false);

    listingPage.itemExist(lastNameMapper).deleteItem(lastNameMapper);
    modalUtils.checkModalTitle(mapperDeleteTitle).confirmModal();
    masthead.checkNotificationMessage(mapperDeletedSuccess);
    listingPage.itemExist(lastNameMapper, false);

    listingPage.itemExist(modifyDateMapper).deleteItem(modifyDateMapper);
    modalUtils.checkModalTitle(mapperDeleteTitle).confirmModal();
    masthead.checkNotificationMessage(mapperDeletedSuccess);
    listingPage.itemExist(modifyDateMapper, false);

    listingPage.itemExist(usernameMapper).deleteItem(usernameMapper);
    modalUtils.checkModalTitle(mapperDeleteTitle).confirmModal();
    masthead.checkNotificationMessage(mapperDeletedSuccess);
    listingPage.itemExist(usernameMapper, false);

    listingPage.itemExist(firstNameMapper).deleteItem(firstNameMapper);
    modalUtils.checkModalTitle(mapperDeleteTitle).confirmModal();
    masthead.checkNotificationMessage(mapperDeletedSuccess);
    listingPage.itemExist(firstNameMapper, false);

    // listingPage.itemExist(msadLdsUserAcctMapper).deleteItem(msadLdsUserAcctMapper);
    // modalUtils.checkModalTitle(mapperDeleteTitle).confirmModal();
    // masthead.checkNotificationMessage(mapperDeletedSuccess);
    // listingPage.itemExist(msadLdsUserAcctMapper, false);
  });

  // create one of every kind (8) mappers
  it("Create user account control mapper", () => {
    providersPage.clickExistingCard(ldapName);
    providersPage.goToMappers();

    providersPage.createNewMapper(msadUserAcctMapper);
    providersPage.save("ldap-mapper");

    masthead.checkNotificationMessage(mapperCreatedSuccess);
    listingPage.itemExist(msadUserAcctMapper, true);
  });

  it("Create msad lds user account control mapper", () => {
    providersPage.clickExistingCard(ldapName);
    providersPage.goToMappers();

    providersPage.createNewMapper(msadLdsUserAcctMapper);
    providersPage.save("ldap-mapper");

    masthead.checkNotificationMessage(mapperCreatedSuccess);
    listingPage.itemExist(msadLdsUserAcctMapper, true);
  });

  it("Create user attribute ldap mapper", () => {
    providersPage.clickExistingCard(ldapName);
    providersPage.goToMappers();

    providersPage.createNewMapper(userAttLdapMapper);
    providersPage.save("ldap-mapper");

    masthead.checkNotificationMessage(mapperCreatedSuccess);
    listingPage.itemExist(userAttLdapMapper, true);
  });

  it("Create hardcoded attribute mapper", () => {
    providersPage.clickExistingCard(ldapName);
    providersPage.goToMappers();

    providersPage.createNewMapper(hcAttMapper);
    providersPage.save("ldap-mapper");

    masthead.checkNotificationMessage(mapperCreatedSuccess);
    listingPage.itemExist(hcAttMapper, true);
  });

  it("Create certificate ldap mapper", () => {
    providersPage.clickExistingCard(ldapName);
    providersPage.goToMappers();

    providersPage.createNewMapper(certLdapMapper);
    providersPage.save("ldap-mapper");

    masthead.checkNotificationMessage(mapperCreatedSuccess);
    listingPage.itemExist(certLdapMapper, true);
  });

  it("Create full name ldap mapper", () => {
    providersPage.clickExistingCard(ldapName);
    providersPage.goToMappers();

    providersPage.createNewMapper(fullNameLdapMapper);
    providersPage.save("ldap-mapper");

    masthead.checkNotificationMessage(mapperCreatedSuccess);
    listingPage.itemExist(fullNameLdapMapper, true);
  });

  it("Create hardcoded ldap group mapper", () => {
    providersPage.clickExistingCard(ldapName);
    providersPage.goToMappers();

    providersPage.createNewMapper(hcLdapGroupMapper);
    providersPage.save("ldap-mapper");

    masthead.checkNotificationMessage(mapperCreatedSuccess);
    listingPage.itemExist(hcLdapGroupMapper, true);
  });

  it("Create hardcoded ldap attribute mapper", () => {
    providersPage.clickExistingCard(ldapName);
    providersPage.goToMappers();

    providersPage.createNewMapper(hcLdapAttMapper);
    providersPage.save("ldap-mapper");

    masthead.checkNotificationMessage(mapperCreatedSuccess);
    listingPage.itemExist(hcLdapAttMapper, true);
  });

    // update and cancel mapper
    it("Update and cancel mapper", () => {
    //   providersPage.clickExistingCard(ldapName);
    //   providersPage.goToMappers();
  
    //   listingPage.clickRowDetails();
  
    //   providersPage.createNewMapper();
    //   providersPage.save("ldap-mapper");
  
    //   masthead.checkNotificationMessage(mapperCreatedSuccess);
    //   listingPage.itemExist(, true);
    });
  
    // update and save mapper
    it("Update and save mapper", () => {
    //   providersPage.clickExistingCard(ldapName);
    //   providersPage.goToMappers();
  
  
    //   providersPage.createNewMapper();
    //   providersPage.save("ldap-mapper");
  
    //   masthead.checkNotificationMessage(mapperCreatedSuccess);
    //   listingPage.itemExist(, true);
    });
  
    // delete mapper
    it("Delete mapper", () => {
      providersPage.clickExistingCard(ldapName);
      providersPage.goToMappers();
  
      listingPage.deleteItem(msadLdsUserAcctMapper);
      modalUtils.checkModalTitle(mapperDeleteTitle).confirmModal();
      masthead.checkNotificationMessage(mapperDeletedSuccess);
      listingPage.itemExist(msadLdsUserAcctMapper, false);
    });

  // *** test cleanup ***
  it("Cleanup - delete group", () => {
    sidebarPage.goToGroups();
    listingPage.deleteItem(groupName);
    masthead.checkNotificationMessage("Group deleted");
  });

  it("Cleanup - delete LDAP provider", () => {
    providersPage.deleteCardFromMenu(provider, ldapName);
    modalUtils.checkModalTitle(providerDeleteTitle).confirmModal();
    masthead.checkNotificationMessage(providerDeleteSuccess);
  });

});
