import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PageSection } from "@patternfly/react-core";

import { RolesList } from "./RoleList";
import { RealmContext } from "../context/realm-context/RealmContext";
import { AdminClient } from "../auth/AdminClient";
import { PaginatingTableToolbar } from "../components/table-toolbar/PaginatingTableToolbar";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";

export const RealmRolesSection = () => {
  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const { t } = useTranslation("roles");
  const history = useHistory();
  const httpClient = useContext(AdminClient)!;
  const [roles, setRoles] = useState<RoleRepresentation[]>();
  const { realm } = useContext(RealmContext);

  const params: { [name: string]: string | number } = { first, max };
  const loader = async () => await httpClient.roles.find(params);

      { params: params }
    setRoles(result.data);

  useEffect(() => {
    loader();
  }, [first, max]);

  return (
    <>
      <ViewHeader titleKey="roles:title" subKey="roles:roleExplain" />
      <PageSection variant="light">
        {roles && roles.length > 0 ? (
          <PaginatingTableToolbar
            count={roles!.length}
            first={first}
            max={max}
            onNextClick={setFirst}
            onPreviousClick={setFirst}
            onPerPageSelect={(first, max) => {
              setFirst(first);
              setMax(max);
            }}
            toolbarItem={
              <>
                <Button onClick={() => history.push("/add-role")}>
                  {t("createRole")}
                </Button>
              </>
            }
          >
            <RolesList roles={roles} refresh={loader} />
          </PaginatingTableToolbar>
        ) : (
          <ListEmptyState
            hasIcon={true}
            message={t("noRolesInThisRealm")}
            instructions={t("noRolesInThisRealmInstructions")}
            primaryActionText={t("createRole")}
            onPrimaryAction={() => history.push("/add-role")}
          />
        )}
      </PageSection>
    </>
  );
};
