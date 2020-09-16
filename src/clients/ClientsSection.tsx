import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, InputGroup, TextInput } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

import { DataLoader } from "../components/data-loader/DataLoader";
import { TableToolbar } from "../components/table-toolbar/TableToolbar";
import { ClientList } from "./ClientList";
import { HttpClientContext } from "../http-service/HttpClientContext";
import { KeycloakContext } from "../auth/KeycloakContext";
import { ClientRepresentation } from "./models/client-model";

export const ClientsSection = () => {
  const { t } = useTranslation("clients");
  const history = useHistory();
  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const httpClient = useContext(HttpClientContext)!;
  const keycloak = useContext(KeycloakContext);

  const loader = async () => {
    return await httpClient
      .doGet("/admin/realms/master/clients", { params: { first, max } })
      .then((r) => r.data as ClientRepresentation[]);
  };

  return (
    <DataLoader loader={loader}>
      {(clients) => (
        <TableToolbar
          count={clients!.length}
          first={first}
          max={max}
          onNextClick={setFirst}
          onPreviousClick={setFirst}
          onPerPageSelect={(f, m) => {
            setFirst(f);
            setMax(m);
          }}
          inputGroup={
            <>
              <InputGroup>
                <TextInput type="text" aria-label="search for client criteria" />
                <Button variant="control" aria-label="search for client">
                  <SearchIcon />
                </Button>
              </InputGroup>
            </>
          }
          toolbarItem={
            <>
              <Button onClick={() => history.push("/add-client")}>
                {t("Create client")}
              </Button>
              <Button
                onClick={() => history.push("/import-client")}
                variant="link"
              >
                {t("Import client")}
              </Button>
            </>
          }
        >
          <ClientList clients={clients} baseUrl={keycloak!.authServerUrl()!} />
        </TableToolbar>
      )}
    </DataLoader>
  );
};
