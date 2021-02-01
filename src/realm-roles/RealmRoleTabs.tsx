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
import { useForm } from "react-hook-form";

import { useAlerts } from "../components/alert/Alerts";
import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import Composites from "keycloak-admin/lib/defs/roleRepresentation";
import { KeyValueType, RoleAttributes } from "./RoleAttributes";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { RealmRoleForm } from "./RealmRoleForm";
import { useRealm } from "../context/realm-context/RealmContext";
import { AssociatedRolesModal } from "./AssociatedRolesModal";
import { KeycloakTabs } from "../components/keycloak-tabs/KeycloakTabs";
import { AssociatedRolesTab } from "./AssociatedRolesTab";

const arrayToAttributes = (attributeArray: KeyValueType[]) => {
  const initValue: { [index: string]: string[] } = {};
  return attributeArray.reduce((acc, attribute) => {
    acc[attribute.key] = [attribute.value];
    return acc;
  }, initValue);
};

const attributesToArray = (attributes: { [key: string]: string }): any => {
  if (!attributes || Object.keys(attributes).length == 0) {
    return [
      {
        key: "",
        value: "",
      },
    ];
  }
  return Object.keys(attributes).map((key) => ({
    key: key,
    value: attributes[key],
  }));
};

export const RealmRoleTabs = () => {
  const { t } = useTranslation("roles");
  const form = useForm<RoleRepresentation>({ mode: "onChange" });
  const history = useHistory();
  // const [name, setName] = useState("");

  const adminClient = useAdminClient();
  const { realm } = useRealm();
  const [role, setRole] = useState<RoleRepresentation>();
  const { url } = useRouteMatch();

  const [key, setKey] = useState("");

  const refresh = () => {
    setKey(`${new Date().getTime()}`);
  };

  const [additionalRoles, setAdditionalRoles] = useState<RoleRepresentation[]>(
    []
  );
  const { addAlert } = useAlerts();

  const [open, setOpen] = useState(false);

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
        setAdditionalRoles(allAdditionalRoles);

        setName(fetchedRole.name!);
        setupForm(fetchedRole);
        setRole(fetchedRole);
      } else {
        setName(t("createRole"));
      }
    };
    setTimeout(update, 100);
  }, [key]);

  const setupForm = (role: RoleRepresentation) => {
    Object.entries(role).map((entry) => {
      if (entry[0] === "attributes") {
        form.setValue(entry[0], attributesToArray(entry[1]));
      } else {
        form.setValue(entry[0], entry[1]);
      }
    });
  };

  // reset form to default values
  const reset = () => {
    setupForm(role!);
  };

  const save = async (updatedRole: RoleRepresentation) => {
    try {
      if (id) {
        if (updatedRole.attributes) {
          // react-hook-form will use `KeyValueType[]` here we convert it back into an indexed property of string[]
          updatedRole.attributes = arrayToAttributes(
            (updatedRole.attributes as unknown) as KeyValueType[]
          );
        }

        await adminClient.roles.createComposite(
          { roleId: id, realm },
          additionalRoles
        );

        setRole(role);
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
          error: error.response.data?.errorMessage || error,
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
    messageKey: t("roles:roleDeleteConfirmDialog", { name }),
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
        history.replace(`/${realm}/roles`);
      } catch (error) {
        addAlert(`${t("roleDeleteError")} ${error}`, AlertVariant.danger);
      }
    },
  });

  const toggleModal = () => setOpen(!open);

  return (
    <>
      <DeleteConfirm />
      <AssociatedRolesModal
        onConfirm={addComposites}
        existingCompositeRoles={additionalRoles}
        open={open}
        toggleDialog={() => setOpen(!open)}
      />
      <ViewHeader
        titleKey={name}
        subKey={id ? "" : "roles:roleCreateExplain"}
        actionsDropdownId="roles-actions-dropdown"
        dropdownItems={
          id
            ? [
                <DropdownItem
                  key="action"
                  component="button"
                  onClick={() => toggleDeleteDialog()}
                >
                  {t("deleteRole")}
                </DropdownItem>,
                <DropdownItem
                  key="toggle-modal"
                  id="add-roles"
                  component="button"
                  onClick={() => toggleModal()}
                >
                  {t("addAssociatedRolesText")}
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
                reset={reset}
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
                <AssociatedRolesTab additionalRoles={additionalRoles} />
              </Tab>
            ) : null}
            <Tab
              eventKey="attributes"
              title={<TabTitleText>{t("attributes")}</TabTitleText>}
            >
              <RoleAttributes form={form} save={save} reset={reset} />
            </Tab>
          </KeycloakTabs>
        )}
        {!id && (
          <RealmRoleForm
            reset={reset}
            form={form}
            save={save}
            editMode={false}
          />
        )}
      </PageSection>
    </>
  );
};