import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import {
  AlertVariant,
  ButtonVariant,
  DropdownItem,
  PageSection,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useFieldArray, useForm } from "react-hook-form";

import { useAlerts } from "../components/alert/Alerts";
import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import Composites from "keycloak-admin/lib/defs/roleRepresentation";
import {
  KeyValueType,
  AttributesForm,
  attributesToArray,
  arrayToAttributes,
} from "../components/attribute-form/AttributeForm";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { RealmRoleForm } from "./RealmRoleForm";
import { useRealm } from "../context/realm-context/RealmContext";
import { AssociatedRolesModal } from "./AssociatedRolesModal";
import { KeycloakTabs } from "../components/keycloak-tabs/KeycloakTabs";
import { AssociatedRolesTab } from "./AssociatedRolesTab";
import { UsersInRoleTab } from "./UsersInRoleTab";

export type RoleFormType = Omit<RoleRepresentation, "attributes"> & {
  attributes: KeyValueType[];
};

export const RealmRoleTabs = () => {
  const { t } = useTranslation("roles");
  const form = useForm<RoleFormType>({ mode: "onChange" });
  const history = useHistory();

  const adminClient = useAdminClient();
  const [role, setRole] = useState<RoleFormType>();

  const { id, clientId } = useParams<{ id: string; clientId: string }>();

  const { url } = useRouteMatch();

  const { realm } = useRealm();

  const [key, setKey] = useState("");

  const refresh = () => {
    setKey(`${new Date().getTime()}`);
  };

  const [additionalRoles, setAdditionalRoles] = useState<RoleRepresentation[]>(
    []
  );

  const { addAlert } = useAlerts();

  const [open, setOpen] = useState(false);
  const convert = (role: RoleRepresentation) => {
    const { attributes, ...rest } = role;
    return {
      attributes: attributesToArray(attributes),
      ...rest,
    };
  };

  useEffect(() => {
    const update = async () => {
      if (id) {
        const fetchedRole = await adminClient.roles.findOneById({ id });
        const allAdditionalRoles = await adminClient.roles.getCompositeRoles({
          id,
        });
        setAdditionalRoles(allAdditionalRoles);

        const convertedRole = convert(fetchedRole);
        Object.entries(convertedRole).map((entry) => {
          form.setValue(entry[0], entry[1]);
        });
        setRole(convertedRole);
      }
    };
    setTimeout(update, 100);
  }, [key]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  //useEffect(() => append({ key: "", value: "" }), [append, role]);

  const save = async () => {
    try {
      const role = form.getValues();
      if (
        role.attributes &&
        role.attributes[role.attributes.length - 1].key === ""
      ) {
        form.setValue(
          "attributes",
          role.attributes.slice(0, role.attributes.length - 1)
        );
      }
      if (!(await form.trigger())) {
        return;
      }
      const { attributes, ...rest } = role;
      const roleRepresentation: RoleRepresentation = rest;
      if (id) {
        if (attributes) {
          roleRepresentation.attributes = arrayToAttributes(attributes);
        }
        if (!clientId) {
          await adminClient.roles.updateById({ id }, roleRepresentation);
        } else {
          await adminClient.clients.updateRole(
            { id: clientId, roleName: role.name! },
            roleRepresentation
          );
        }

        await adminClient.roles.createComposite(
          { roleId: id, realm },
          additionalRoles
        );

        setRole(role);
        form.reset(role);
      } else {
        let createdRole;
        if (!clientId) {
          await adminClient.roles.create(roleRepresentation);
          createdRole = await adminClient.roles.findOneByName({
            name: role.name!,
          });
        } else {
          await adminClient.clients.createRole({
            id: clientId,
            name: role.name,
          });
          if (role.description) {
            await adminClient.clients.updateRole(
              { id: clientId, roleName: role.name! },
              roleRepresentation
            );
          }
          createdRole = await adminClient.clients.findRole({
            id: clientId,
            roleName: role.name!,
          });
        }
        setRole(convert(createdRole));
        history.push(
          url.substr(0, url.lastIndexOf("/") + 1) + createdRole.id + "/details"
        );
      }
      addAlert(t(id ? "roleSaveSuccess" : "roleCreated"), AlertVariant.success);
    } catch (error) {
      addAlert(
        t((id ? "roleSave" : "roleCreate") + "Error", {
          error: error.response?.data?.errorMessage || error,
        }),
        AlertVariant.danger
      );
    }
  };

  const addComposites = async (composites: Composites[]): Promise<void> => {
    const compositeArray = composites;
    setAdditionalRoles([...additionalRoles, ...compositeArray]);

    try {
      await adminClient.roles.createComposite(
        { roleId: id, realm: realm },
        compositeArray
      );
      history.push(url.substr(0, url.lastIndexOf("/") + 1) + "AssociatedRoles");
      refresh();
      addAlert(t("addAssociatedRolesSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(t("addAssociatedRolesError", { error }), AlertVariant.danger);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "roles:roleDeleteConfirm",
    messageKey: t("roles:roleDeleteConfirmDialog", {
      name: role?.name || t("createRole"),
    }),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        if (!clientId) {
          await adminClient.roles.delById({ id });
        } else {
          await adminClient.clients.delRole({
            id: clientId,
            roleName: role!.name as string,
          });
        }
        addAlert(t("roleDeletedSuccess"), AlertVariant.success);
        const loc = url.replace(/\/attributes/g, "");
        history.replace(`${loc.substr(0, loc.lastIndexOf("/"))}`);
      } catch (error) {
        addAlert(`${t("roleDeleteError")} ${error}`, AlertVariant.danger);
      }
    },
  });

  const [
    toggleDeleteAllAssociatedRolesDialog,
    DeleteAllAssociatedRolesConfirm,
  ] = useConfirmDialog({
    titleKey: t("roles:removeAllAssociatedRoles") + "?",
    messageKey: t("roles:removeAllAssociatedRolesConfirmDialog", {
      name: role?.name || t("createRole"),
    }),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.roles.delCompositeRoles({ id }, additionalRoles);
        addAlert(
          t("compositeRoleOff"),
          AlertVariant.success,
          t("compositesRemovedAlertDescription")
        );
        const loc = url.replace(/\/AssociatedRoles/g, "/details");
        history.push(loc);
        refresh();
      } catch (error) {
        addAlert(`${t("roleDeleteError")} ${error}`, AlertVariant.danger);
      }
    },
  });

  const toggleModal = () => setOpen(!open);

  return (
    <>
      <DeleteConfirm />
      <DeleteAllAssociatedRolesConfirm />
      <AssociatedRolesModal
        onConfirm={addComposites}
        existingCompositeRoles={additionalRoles}
        open={open}
        toggleDialog={() => setOpen(!open)}
      />
      <ViewHeader
        titleKey={role?.name || t("createRole")}
        badge={additionalRoles.length > 0 ? t("composite") : ""}
        badgeIsRead={true}
        subKey={id ? "" : "roles:roleCreateExplain"}
        actionsDropdownId="roles-actions-dropdown"
        dropdownItems={
          url.includes("AssociatedRoles")
            ? [
                <DropdownItem
                  key="delete-all-associated"
                  component="button"
                  onClick={() => toggleDeleteAllAssociatedRolesDialog()}
                >
                  {t("roles:removeAllAssociatedRoles")}
                </DropdownItem>,
                <DropdownItem
                  key="delete-role"
                  component="button"
                  onClick={() => toggleDeleteDialog()}
                >
                  {t("deleteRole")}
                </DropdownItem>,
              ]
            : id
            ? [
                <DropdownItem
                  key="toggle-modal"
                  data-testid="add-roles"
                  component="button"
                  onClick={() => toggleModal()}
                >
                  {t("addAssociatedRolesText")}
                </DropdownItem>,
                <DropdownItem
                  key="delete-role"
                  component="button"
                  onClick={() => toggleDeleteDialog()}
                >
                  {t("deleteRole")}
                </DropdownItem>,
              ]
            : undefined
        }
      />
      <PageSection variant="light">
        {id && (
          <KeycloakTabs isBox>
            <Tab
              eventKey="details"
              title={<TabTitleText>{t("details")}</TabTitleText>}
            >
              <RealmRoleForm
                reset={() => form.reset(role)}
                form={form}
                save={save}
                editMode={true}
              />
            </Tab>
            {additionalRoles.length > 0 ? (
              <Tab
                eventKey="AssociatedRoles"
                title={<TabTitleText>{t("associatedRolesText")}</TabTitleText>}
              >
                <AssociatedRolesTab
                  additionalRoles={additionalRoles}
                  addComposites={addComposites}
                  parentRole={role!}
                  onRemove={() => refresh()}
                />
              </Tab>
            ) : null}
            <Tab
              eventKey="attributes"
              title={<TabTitleText>{t("attributes")}</TabTitleText>}
            >
              <AttributesForm
                form={form}
                save={save}
                array={{ fields, append, remove }}
                reset={() => form.reset(role)}
              />
            </Tab>
            <Tab
              eventKey="users-in-role"
              title={<TabTitleText>{t("usersInRole")}</TabTitleText>}
            >
              <UsersInRoleTab data-cy="users-in-role-tab" />
            </Tab>
          </KeycloakTabs>
        )}
        {!id && (
          <RealmRoleForm
            reset={() => form.reset()}
            form={form}
            save={save}
            editMode={false}
          />
        )}
      </PageSection>
    </>
  );
};
