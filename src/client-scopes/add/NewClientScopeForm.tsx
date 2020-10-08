import React, { useContext, useState } from "react";
import {
  ActionGroup,
  AlertVariant,
  Button,
  Form,
  FormGroup,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

import { ClientScopeRepresentation } from "../models/client-scope";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { HttpClientContext } from "../../context/http-service/HttpClientContext";
import { RealmContext } from "../../context/realm-context/RealmContext";
import { useAlerts } from "../../components/alert/Alerts";
import { useLoginProviders } from "../../context/server-info/ServerInfoProvider";

export const NewClientScopeForm = () => {
  const { t } = useTranslation("client-scopes");
  const { register, control, handleSubmit } = useForm<
    ClientScopeRepresentation
  >();

  const httpClient = useContext(HttpClientContext)!;
  const { realm } = useContext(RealmContext);
  const providers = useLoginProviders();

  const [open, isOpen] = useState(false);
  const { addAlert } = useAlerts();

  const save = async (clientScopes: ClientScopeRepresentation) => {
    try {
      const keyValues = Object.keys(clientScopes.attributes!).map((key) => {
        const newKey = key.replace(/_/g, ".");
        return { [newKey]: clientScopes.attributes![key] };
      });
      clientScopes.attributes = Object.assign({}, ...keyValues);

      await httpClient.doPost(
        `/admin/realms/${realm}/client-scopes`,
        clientScopes
      );
      addAlert(t("createClientScopeSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(
        `${t("createClientScopeError")} '${error}'`,
        AlertVariant.danger
      );
    }
  };

  return (
    <PageSection variant="light">
      <Form isHorizontal onSubmit={handleSubmit(save)}>
        <FormGroup
          label={
            <>
              {t("name")}
            </>
          }
      labelIcon={
          <HelpItem item="clientScope.name" itemFor="kc-name" />
      }
          fieldId="kc-name"
          isRequired
        >
          <TextInput
            ref={register({ required: true })}
            type="text"
            id="kc-name"
            name="name"
          />
        </FormGroup>
        <FormGroup
          label={
            <>
              {t("description")} 
            </>
          }
          labelIcon={<HelpItem item="clientScope.description" itemFor="kc-description" />}
          fieldId="kc-description"
        >
          <TextInput
            ref={register}
            type="text"
            id="kc-description"
            name="description"
          />
        </FormGroup>
        <FormGroup
          label={
            <>
              {t("protocol")} 
            </>
          }
          labelIcon={<HelpItem item="clientScope.protocol" itemFor="kc-protocol" />}
          fieldId="kc-protocol"
        >
          <Controller
            name="protocol"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <Select
                id="kc-protocol"
                required
                onToggle={() => isOpen(!open)}
                onSelect={(_, value, isPlaceholder) => {
                  onChange(isPlaceholder ? "" : (value as string));
                  isOpen(false);
                }}
                selections={value}
                variant={SelectVariant.single}
                aria-label={t("selectEncryptionType")}
                placeholderText={t("common:selectOne")}
                isOpen={open}
              >
                {providers.map((option) => (
                  <SelectOption
                    selected={option === value}
                    key={option}
                    value={option}
                  />
                ))}
              </Select>
            )}
          />
        </FormGroup>
        <FormGroup
          hasNoPaddingTop
          label={
            <>
              {t("displayOnConsentScreen")}{" "}
              
            </>
          }
          labelIcon={<HelpItem item="clientScope.displayOnConsentScreen" itemFor="kc-display.on.consent.screen" />}
          fieldId="kc-display.on.consent.screen"
        >
          <Controller
            name="attributes.display_on_consent_screen"
            control={control}
            defaultValue={false}
            render={({ onChange, value }) => (
              <Switch
                id="kc-display.on.consent.screen"
                label={t("common:on")}
                labelOff={t("common:off")}
                isChecked={value}
                onChange={onChange}
              />
            )}
          />
        </FormGroup>
        <FormGroup
          label={
            <>
              {t("consentScreenText")}{" "}
              
            </>
          }
          labelIcon={<HelpItem item="clientScope.consentScreenText" itemFor="kc-consent-screen-text" />}
          fieldId="kc-consent-screen-text"
        >
          <TextInput
            ref={register}
            type="text"
            id="kc-consent-screen-text"
            name="attributes.consent_screen_text"
          />
        </FormGroup>
        <FormGroup
          label={
            <>
              {t("guiOrder")}
            </>
          }
          labelIcon={ <HelpItem item="clientScope.guiOrder" itemFor="kc-gui-order" />}
          fieldId="kc-gui-order"
        >
          <TextInput
            ref={register}
            type="number"
            id="kc-gui-order"
            name="attributes.gui_order"
          />
        </FormGroup>
        <ActionGroup>
          <Button variant="primary" type="submit">
            {t("common:save")}
          </Button>
          <Button variant="link">{t("common:cancel")}</Button>
        </ActionGroup>
      </Form>
    </PageSection>
  );
};
