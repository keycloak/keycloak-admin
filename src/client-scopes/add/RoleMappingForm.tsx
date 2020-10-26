import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  FormGroup,
  PageSection,
  Select,
  SelectVariant,
  TextInput,
  SelectOption,
  ActionGroup,
  Button,
  SelectGroup,
  Split,
  SplitItem,
  Divider,
} from "@patternfly/react-core";

import { useAlerts } from "../../components/alert/Alerts";
import { RealmContext } from "../../context/realm-context/RealmContext";
import { HttpClientContext } from "../../context/http-service/HttpClientContext";

import { ViewHeader } from "../../components/view-header/ViewHeader";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import {
  ClientRepresentation,
  RoleRepresentation,
} from "../../realm/models/Realm";
import { ProtocolMapperRepresentation } from "../models/client-scope";

export type RoleMappingFormProps = {
  clientScopeId: string;
};

export const RoleMappingForm = ({ clientScopeId }: RoleMappingFormProps) => {
  const httpClient = useContext(HttpClientContext)!;
  const { realm } = useContext(RealmContext);
  const history = useHistory();
  const { addAlert } = useAlerts();

  const { t } = useTranslation("client-scopes");
  const { register, handleSubmit, control, errors } = useForm();

  const [roleOpen, setRoleOpen] = useState(false);
  const [roles, setRoles] = useState<RoleRepresentation[]>([]);

  const [clientsOpen, setClientsOpen] = useState(false);
  const [clients, setClients] = useState<ClientRepresentation[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientRepresentation>();
  const [clientRoles, setClientRoles] = useState<RoleRepresentation[]>();

  useEffect(() => {
    (async () => {
      const response = await httpClient.doGet<RoleRepresentation[]>(
        `/admin/realms/${realm}/roles`
      );
      setRoles(response.data!);
      const clientResponse = await httpClient.doGet<ClientRepresentation[]>(
        `/admin/realms/${realm}/clients`
      );
      const clients = clientResponse.data!;
      clients.map(
        (client) =>
          (client.toString = function () {
            return this.name;
          })
      );
      setClients(clients);
    })();
  });

  useEffect(() => {
    (async () => {
      const client = selectedClient as ClientRepresentation;
      if (client && client.name !== "realmRoles") {
        const response = await httpClient.doGet<RoleRepresentation[]>(
          `/admin/realms/master/clients/${client.id}/roles`
        );

        setClientRoles(response.data!);
      }
    })();
  }, [selectedClient]);

  const save = async (mapping: ProtocolMapperRepresentation) => {
    try {
      await httpClient.doPost(
        `/admin/realms/${realm}/client-scopes/${clientScopeId}/protocol-mappers/models`,
        mapping
      );
      addAlert(t("mapperCreateSuccess"));
    } catch (error) {
      addAlert(t("mapperCreateError", error));
    }
  };

  const createSelectGroup = (clients: ClientRepresentation[]) => {
    return [
      <SelectGroup key="role" label={t("roleGroup")}>
        <SelectOption
          key="realmRoles"
          value={
            {
              name: "realmRoles",
              toString: () => t("realmRoles"),
            } as ClientRepresentation
          }
        >
          {t("realmRoles")}
        </SelectOption>
      </SelectGroup>,
      <Divider key="divider" />,
      <SelectGroup key="group" label={t("clientGroup")}>
        {clients.map((client) => (
          <SelectOption key={client.id} value={client}>
            {client.name}
          </SelectOption>
        ))}
      </SelectGroup>,
    ];
  };

  const roleSelectOptions = () => {
    const createItem = (role: RoleRepresentation) => (
      <SelectOption key={role.id} value={role}>
        {role.name}
      </SelectOption>
    );
    if (clientRoles) {
      return clientRoles.map((role) => createItem(role));
    } else {
      return roles.map((role) => createItem(role));
    }
  };

  return (
    <>
      <ViewHeader
        titleKey="client-scopes:addMapper"
        subKey="client-scopes:addMapperExplain"
      />
      <PageSection variant="light">
        <Form isHorizontal onSubmit={handleSubmit(save)}>
          <FormGroup
            label={t("protocolMapper")}
            labelIcon={
              <HelpItem
                helpText="client-scopes-help:protocolMapper"
                forLabel={t("protocolMapper")}
                forID="protocolMapper"
              />
            }
            fieldId="protocolMapper"
          >
            <TextInput
              ref={register()}
              type="text"
              id="protocolMapper"
              name="protocolMapper"
              isReadOnly
            />
          </FormGroup>
          <FormGroup
            label={t("name")}
            labelIcon={
              <HelpItem
                helpText="client-scopes-help:mapperName"
                forLabel={t("name")}
                forID="name"
              />
            }
            fieldId="name"
            isRequired
            validated={errors.name ? "error" : "default"}
            helperTextInvalid={t("common:required")}
          >
            <TextInput
              ref={register({ required: true })}
              type="text"
              id="name"
              name="name"
            />
          </FormGroup>
          <FormGroup
            label={t("role")}
            labelIcon={
              <HelpItem
                helpText="client-scopes-help:role"
                forLabel={t("role")}
                forID="role"
              />
            }
            validated={errors["config.role"] ? "error" : "default"}
            helperTextInvalid={t("common:required")}
            fieldId="role"
          >
            <Split hasGutter>
              <SplitItem>
                <Select
                  toggleId="role"
                  onToggle={() => setClientsOpen(!clientsOpen)}
                  isOpen={clientsOpen}
                  variant={SelectVariant.typeahead}
                  typeAheadAriaLabel={t("selectASourceOfRoles")}
                  placeholderText={t("selectASourceOfRoles")}
                  isGrouped
                  onFilter={(evt) => {
                    const textInput = evt.target.value;
                    if (textInput === "") {
                      return createSelectGroup(clients);
                    } else {
                      return createSelectGroup(
                        clients.filter((client) =>
                          client.name
                            .toLowerCase()
                            .includes(textInput.toLowerCase())
                        )
                      );
                    }
                  }}
                  selections={selectedClient}
                  onClear={() => setSelectedClient(undefined)}
                  onSelect={(_, value) => {
                    if (value) {
                      setSelectedClient(value as ClientRepresentation);
                      setClientsOpen(false);
                    }
                  }}
                >
                  {createSelectGroup(clients)}
                </Select>
              </SplitItem>
              <SplitItem>
                <Controller
                  name="config.role"
                  defaultValue=""
                  control={control}
                  rules={{ required: true }}
                  render={({ onChange, value }) => (
                    <Select
                      onToggle={() => setRoleOpen(!roleOpen)}
                      isOpen={roleOpen}
                      variant={SelectVariant.typeahead}
                      placeholderText={
                        selectedClient && selectedClient.name !== "realmRoles"
                          ? t("clientRoles")
                          : t("selectARole")
                      }
                      isDisabled={!selectedClient}
                      typeAheadAriaLabel={t("selectARole")}
                      selections={value.name}
                      onSelect={(_, value) => {
                        onChange(value);
                        setRoleOpen(false);
                      }}
                      onClear={() => onChange("")}
                    >
                      {roleSelectOptions()}
                    </Select>
                  )}
                />
              </SplitItem>
            </Split>
          </FormGroup>
          <FormGroup
            label={t("newRoleName")}
            labelIcon={
              <HelpItem
                helpText="client-scopes-help:newRoleName"
                forLabel={t("newRoleName")}
                forID="newRoleName"
              />
            }
            fieldId="newRoleName"
          >
            <TextInput
              ref={register()}
              type="text"
              id="newRoleName"
              name="config.new_role_name"
            />
          </FormGroup>
          <ActionGroup>
            <Button variant="primary" type="submit">
              {t("common:save")}
            </Button>
            <Button variant="link" onClick={() => history.push("..")}>
              {t("common:cancel")}
            </Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </>
  );
};
