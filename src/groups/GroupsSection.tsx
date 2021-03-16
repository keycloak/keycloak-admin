import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DropdownItem,
  PageSection,
  PageSectionVariants,
  AlertVariant,
  Tab,
  TabTitleText,
  Tabs,
} from "@patternfly/react-core";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";

import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAdminClient } from "../context/auth/AdminClient";
import { useAlerts } from "../components/alert/Alerts";
import { useRealm } from "../context/realm-context/RealmContext";

import { useSubGroups } from "./SubGroupsContext";
import { GroupTable } from "./GroupTable";
import { getLastId } from "./groupIdUtils";
import { Members } from "./Members";
import { GroupAttributes } from "./GroupAttributes";

import "./GroupsSection.css";

export const GroupsSection = () => {
  const { t } = useTranslation("groups");
  const [activeTab, setActiveTab] = useState(0);

  const adminClient = useAdminClient();
  const { subGroups } = useSubGroups();
  const { addAlert } = useAlerts();
  const { realm } = useRealm();

  const history = useHistory();
  const id = getLastId(location.pathname);

  const deleteGroup = async (group: GroupRepresentation) => {
    try {
      await adminClient.groups.del({
        id: group.id!,
      });
      addAlert(t("groupDelete"), AlertVariant.success);
    } catch (error) {
      addAlert(t("groupDeleteError", { error }), AlertVariant.danger);
    }
    return true;
  };

  return (
    <>
      <ViewHeader
        titleKey="groups:groups"
        subKey="groups:groupsDescription"
        dropdownItems={[
          <DropdownItem
            data-testid="searchGroup"
            key="searchGroup"
            onClick={() => history.push(`/${realm}/groups/search`)}
          >
            {t("searchGroup")}
          </DropdownItem>,
          <DropdownItem
            data-testid="renameGroup"
            key="renameGroup"
            onClick={() => addAlert("Not implemented")}
          >
            {t("renameGroup")}
          </DropdownItem>,
          <DropdownItem
            data-testid="deleteGroup"
            key="deleteGroup"
            onClick={() => deleteGroup({ id })}
          >
            {t("deleteGroup")}
          </DropdownItem>,
        ]}
      />
      <PageSection variant={PageSectionVariants.light}>
        {subGroups.length > 0 && (
          <Tabs
            activeKey={activeTab}
            isSecondary
            onSelect={(_, key) => setActiveTab(key as number)}
            isBox
          >
            <Tab
              data-testid="groups"
              eventKey={0}
              title={<TabTitleText>{t("childGroups")}</TabTitleText>}
            >
              <GroupTable />
            </Tab>
            <Tab
              data-testid="members"
              eventKey={1}
              title={<TabTitleText>{t("members")}</TabTitleText>}
            >
              <Members />
            </Tab>
            <Tab
              data-testid="attributes"
              eventKey={2}
              title={<TabTitleText>{t("attributes")}</TabTitleText>}
            >
              <GroupAttributes />
            </Tab>
          </Tabs>
        )}
        {subGroups.length === 0 && <GroupTable />}
      </PageSection>
    </>
  );
};
