import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant
} from '@patternfly/react-table';
import { useTranslation } from "react-i18next";
import { GroupRepresentation } from "./models/groups";

type GroupsListProps = {
  list: GroupRepresentation[];
  onSelect: (event: React.MouseEvent<HTMLElement>, isSelect: boolean, rowId: number ) => void;
  onDelete: (event: React.MouseEvent<HTMLElement>, rowId: number) => void;
}

export const GroupsList = ({ list, onSelect, onDelete }: GroupsListProps ) => {

  const { t } = useTranslation("group");

  const tableHeader = [ { title: t("Group name") }, { title: t("Members") }];
  
  const actions = [
    {
      title: t("Move to"),
      onClick: () => console.log('TO DO: Add move to functionality')
    },
    {
      title: t("Delete"),
      onClick: onDelete
    }
  ];

  return (
    <Table
      actions={actions}
      variant={TableVariant.compact}
      onSelect={onSelect}
      canSelectAll={false}
      aria-label="Selectable Table"
      cells={tableHeader}
      rows={list}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};
