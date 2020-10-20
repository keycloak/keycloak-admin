import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant
} from "@patternfly/react-table";
import { Button, AlertVariant } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { GroupRepresentation } from "./models/groups";
import { UsersIcon } from "@patternfly/react-icons";
import { HttpClientContext } from "../context/http-service/HttpClientContext";
import { RealmContext } from "../context/realm-context/RealmContext";
import { useAlerts } from "../components/alert/Alerts";

export type GroupsListProps = {
  list?: GroupRepresentation[];
  refresh: () => void;
};

type FormattedData = {
  cells: JSX.Element[];
  selected: boolean;
};

export const GroupsList = ({ list, refresh }: GroupsListProps) => {
  const { t } = useTranslation("groups");
  const httpClient = useContext(HttpClientContext)!;
  const columnGroupName: keyof GroupRepresentation = "name";
  const columnGroupNumber: keyof GroupRepresentation = "membersLength";
  const { realm } = useContext(RealmContext);
  const { addAlert } = useAlerts();
  const [formattedData, setFormattedData] = useState<FormattedData[]>([]);

  const formatData = (data: GroupRepresentation[]) =>
    data.map((group: { [key: string]: any }, index) => {
      const groupName = group[columnGroupName];
      const groupNumber = group[columnGroupNumber];
      return {
        cells: [
          <Button variant="link" key={index}>
            {groupName}
          </Button>,
          <div className="keycloak-admin--groups__member-count" key={index}>
            <UsersIcon key={`user-icon-${index}`} />
            {groupNumber}
          </div>
        ],
        selected: false
      };
    });

  useEffect(() => {
    setFormattedData(formatData(list!));
  }, [list]);

  function onSelect(
    _: React.FormEvent<HTMLInputElement>,
    isSelected: boolean,
    rowId: number
  ) {
    let localRow;
    if (rowId === undefined) {
      localRow = formattedData.map((row: { [key: string]: any }) => {
        row.selected = isSelected;
        return row;
      });
    } else {
      localRow = [...formattedData];
      localRow[rowId].selected = isSelected;
      setFormattedData(localRow);
    }
  }

  const tableHeader = [{ title: t("groupName") }, { title: t("members") }];
  const actions = [
    {
      title: t("moveTo"),
      // eslint-disable-next-line no-console
      onClick: () => console.log("TO DO: Add move to functionality")
    },
    {
      title: t("common:Delete"),
      onClick: async (
        _: React.MouseEvent<Element, MouseEvent>,
        rowId: number
      ) => {
        try {
          await httpClient.doDelete(
            `/admin/realms/${realm}/groups/${list![rowId].id}`
          );
          refresh();
          addAlert(t("Group deleted"), AlertVariant.success);
        } catch (error) {
          addAlert(`${t("clientDeleteError")} ${error}`, AlertVariant.danger);
        }
      }
    }
  ];

  return (
    <>
      {formattedData && (
        <Table
          actions={actions}
          variant={TableVariant.compact}
          onSelect={onSelect}
          canSelectAll={false}
          aria-label={t("tableOfGroups")}
          cells={tableHeader}
          rows={formattedData}
        >
          <TableHeader />
          <TableBody />
        </Table>
      )}
    </>
  );
};
