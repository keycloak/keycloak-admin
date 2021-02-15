import React, { useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertVariant, Button, ButtonVariant } from "@patternfly/react-core";

import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { formattedLinkTableCell } from "../components/external-link/FormattedLink";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter, boolFormatter } from "../util";

type RolesListProps = {
  paginated?: boolean;
  parentRoleId?: string;
};

export const RolesList = ({
  loader,
  paginated = true,
  parentRoleId,
}: RolesListProps) => {
  const { t } = useTranslation("roles");
  const history = useHistory();
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const { url } = useRouteMatch();

  const loader = async (first?: number, max?: number, search?: string) => {
    const params: { [name: string]: string | number } = {
      first: first!,
      max: max!,
    };
    if (search) {
      params.search = search;
    }
    return await adminClient.roles.find({ ...params });
  };

  const [selectedRole, setSelectedRole] = useState<RoleRepresentation>();

  const RoleDetailLink = (role: RoleRepresentation) => (
    <>
      <Link key={role.id} to={`${url}/${role.id}/details`}>
        {role.name}
      </Link>
    </>
  );

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "roles:roleDeleteConfirm",
    messageKey: t("roles:roleDeleteConfirmDialog", {
      selectedRoleName: selectedRole ? selectedRole!.name : "",
    }),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        if (!parentRoleId) {
          await adminClient.roles.delById({
            id: selectedRole!.id!,
          });
        } else {
          await adminClient.roles.delCompositeRoles({ id: parentRoleId }, [
            selectedRole!,
          ]);
        }
        setSelectedRole(undefined);
        addAlert(t("roleDeletedSuccess"), AlertVariant.success);
      } catch (error) {
        addAlert(`${t("roleDeleteError")} ${error}`, AlertVariant.danger);
      }
    },
  });

  const goToCreate = () => history.push(`${url}/add-role`);
  return (
    <>
      <DeleteConfirm />
      <KeycloakDataTable
        key={selectedRole ? selectedRole.id : "roleList"}
        loader={loader}
        ariaLabelKey="roles:roleList"
        searchPlaceholderKey="roles:searchFor"
        isPaginated={paginated}
        toolbarItem={
          <>
            <Button onClick={goToCreate}>{t("createRole")}</Button>
          </>
        }
        actions={[
          {
            title: t("common:delete"),
            onRowClick: (role) => {
              setSelectedRole(role);
              toggleDeleteDialog();
            },
          },
        ]}
        columns={[
          {
            name: "name",
            displayKey: "roles:roleName",
            cellRenderer: RoleDetailLink,
            cellFormatters: [formattedLinkTableCell(), emptyFormatter()],
          },
          {
            name: "composite",
            displayKey: "roles:composite",
            cellFormatters: [boolFormatter(), emptyFormatter()],
          },
          {
            name: "description",
            displayKey: "common:description",
            cellFormatters: [emptyFormatter()],
          },
        ]}
        emptyState={
          <ListEmptyState
            hasIcon={true}
            message={t("noRolesInThisRealm")}
            instructions={t("noRolesInThisRealmInstructions")}
            primaryActionText={t("createRole")}
            onPrimaryAction={goToCreate}
          />
        }
      />
    </>
  );
};
