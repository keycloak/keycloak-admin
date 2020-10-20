import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
  IFormatter,
  IFormatterValueType
} from "@patternfly/react-table";

import { ExternalLink } from "../components/external-link/ExternalLink";
import { RoleRepresentation } from "../model/role-model";
import { AlertVariant, ButtonVariant } from "@patternfly/react-core";
import { HttpClientContext } from "../context/http-service/HttpClientContext";
import { useAlerts } from "../components/alert/Alerts";
import { RealmContext } from "../context/realm-context/RealmContext";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";

type RolesListProps = {
  roles?: RoleRepresentation[];
  refresh: () => void;
};

const columns: (keyof RoleRepresentation)[] = [
  "name",
  "composite",
  "description"
];

export const RolesList = ({ roles, refresh }: RolesListProps) => {
  const { t } = useTranslation("roles");
  const httpClient = useContext(HttpClientContext)!;
  const { realm } = useContext(RealmContext);
  const { addAlert } = useAlerts();
  const [selectedRowId, setSelectedRowId] = useState(-1);

  const emptyFormatter = (): IFormatter => (data?: IFormatterValueType) =>
    data ? data : "—";

  const externalLink = (): IFormatter => (data?: IFormatterValueType) =>
    (data ? <ExternalLink href={data.toString()} /> : undefined) as object;

  const boolFormatter = (): IFormatter => (data?: IFormatterValueType) => {
    const boolVal = data?.toString();

    return (boolVal
      ? boolVal.charAt(0).toUpperCase() + boolVal.slice(1)
      : undefined) as string;
  };
  const data = roles!.map(column => ({
    cells: columns.map(col => column[col]),
    role: column
  }));

  let selectedRoleName;
  if (selectedRowId === data.length) {
    selectedRoleName = data[selectedRowId - 1].role.name;
  } else if (selectedRowId !== -1) {
    selectedRoleName = data[selectedRowId].role.name;
  }

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "roles:roleDeleteConfirm",
    messageKey: t("roles:roleDeleteConfirmDialog", { selectedRoleName }),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await httpClient.doDelete(
          `/admin/realms/${realm}/roles/${data[selectedRowId].role.name}`
        );
        refresh();
        addAlert(t("roleDeletedSuccess"), AlertVariant.success);
      } catch (error) {
        addAlert(`${t("roleDeleteError")} ${error}`, AlertVariant.danger);
      }
    }
  });

  return (
    <>
      <DeleteConfirm />
      <Table
        variant={TableVariant.compact}
        cells={[
          {
            title: t("roleName"),
            cellFormatters: [externalLink(), emptyFormatter()]
          },
          {
            title: t("composite"),
            cellFormatters: [boolFormatter(), emptyFormatter()]
          },
          { title: t("description"), cellFormatters: [emptyFormatter()] }
        ]}
        rows={data}
        actions={[
          {
            title: t("common:Delete"),
            onClick: (_, rowId) => {
              setSelectedRowId(rowId);
              toggleDeleteDialog();
            }
          }
        ]}
        aria-label="Roles list"
      >
        <TableHeader />
        <TableBody />
      </Table>
    </>
  );
};
