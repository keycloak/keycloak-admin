import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  TextInput,
  Form,
  Switch,
  TextArea,
  ActionGroup,
  Button,
  Select,
  SelectVariant,
  SelectOption,
} from "@patternfly/react-core";
import { Controller, useFormContext } from "react-hook-form";

import { ScrollForm } from "../components/scroll-form/ScrollForm";
import { ClientDescription } from "./ClientDescription";
import { CapabilityConfig } from "./add/CapabilityConfig";
import { MultiLineInput } from "../components/multi-line-input/MultiLineInput";
import { FormAccess } from "../components/form-access/FormAccess";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";

type ClientSettingsProps = {
  save: () => void;
  reload: () => void;
};

export const ClientSettings = ({ save, reload }: ClientSettingsProps) => {
  const { register, control, watch } = useFormContext();
  const { t } = useTranslation("clients");

  const [loginThemeOpen, setLoginThemeOpen] = useState(false);
  const loginThemes = useServerInfo().themes!["login"];
  const consentRequired: boolean = watch("consentRequired");
  const displayOnConsentScreen: string = watch(
    "attributes.display-on-consent-screen"
  );

  return (
    <>
      <ScrollForm
        className="pf-u-p-lg"
        sections={[
          t("capabilityConfig"),
          t("generalSettings"),
          t("accessSettings"),
          t("loginSettings"),
        ]}
      >
        <CapabilityConfig />
        <Form isHorizontal>
          <ClientDescription />
        </Form>
        <FormAccess isHorizontal role="manage-clients">
          <FormGroup
            label={t("rootUrl")}
            fieldId="kc-root-url"
            labelIcon={
              <HelpItem
                helpText="clients-help:rootUrl"
                forLabel={t("rootUrl")}
                forID="kc-root-url"
              />
            }
          >
            <TextInput
              type="text"
              id="kc-root-url"
              name="rootUrl"
              ref={register}
            />
          </FormGroup>
          <FormGroup
            label={t("validRedirectUri")}
            fieldId="kc-redirect"
            labelIcon={
              <HelpItem
                helpText="clients-help:validRedirectURIs"
                forLabel={t("validRedirectUri")}
                forID="kc-redirect"
              />
            }
          >
            <MultiLineInput
              name="redirectUris"
              addButtonLabel="clients:addRedirectUri"
            />
          </FormGroup>
          <FormGroup
            label={t("homeURL")}
            fieldId="kc-home-url"
            labelIcon={
              <HelpItem
                helpText="clients-help:homeURL"
                forLabel={t("homeURL")}
                forID="kc-home-url"
              />
            }
          >
            <TextInput
              type="text"
              id="kc-home-url"
              name="baseUrl"
              ref={register}
            />
          </FormGroup>
          <FormGroup
            label={t("webOrigins")}
            fieldId="kc-web-origins"
            labelIcon={
              <HelpItem
                helpText="clients-help:webOrigins"
                forLabel={t("webOrigins")}
                forID="kc-web-origins"
              />
            }
          >
            <MultiLineInput
              name="webOrigins"
              addButtonLabel="clients:addWebOrigins"
            />
          </FormGroup>
          <FormGroup
            label={t("adminURL")}
            fieldId="kc-admin-url"
            labelIcon={
              <HelpItem
                helpText="clients-help:adminURL"
                forLabel={t("adminURL")}
                forID="kc-admin-url"
              />
            }
          >
            <TextInput
              type="text"
              id="kc-admin-url"
              name="adminUrl"
              ref={register}
            />
          </FormGroup>
        </FormAccess>
        <FormAccess isHorizontal role="manage-clients">
          <FormGroup
            label={t("loginTheme")}
            labelIcon={
              <HelpItem
                helpText="clients-help:loginTheme"
                forLabel={t("loginTheme")}
                forID="loginTheme"
              />
            }
            fieldId="loginTheme"
          >
            <Controller
              name="attributes.login_theme"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="loginTheme"
                  onToggle={() => setLoginThemeOpen(!loginThemeOpen)}
                  onSelect={(_, value) => {
                    onChange(value as string);
                    setLoginThemeOpen(false);
                  }}
                  selections={value}
                  variant={SelectVariant.single}
                  aria-label={t("loginTheme")}
                  isOpen={loginThemeOpen}
                >
                  <SelectOption selected={"" === value} key="empty" value="" />
                  <>
                    {loginThemes &&
                      loginThemes.map((theme) => (
                        <SelectOption
                          selected={theme.name === value}
                          key={theme.name}
                          value={theme.name}
                        />
                      ))}
                  </>
                </Select>
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("consentRequired")}
            fieldId="kc-consent"
            hasNoPaddingTop
          >
            <Controller
              name="consentRequired"
              defaultValue={false}
              control={control}
              render={({ onChange, value }) => (
                <Switch
                  id="kc-consent"
                  label={t("common:on")}
                  labelOff={t("common:off")}
                  isChecked={value}
                  onChange={onChange}
                />
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("displayOnClient")}
            fieldId="kc-display-on-client"
            hasNoPaddingTop
          >
            <Controller
              name="attributes.display-on-consent-screen"
              defaultValue={false}
              control={control}
              render={({ onChange, value }) => (
                <Switch
                  id="kc-display-on-client"
                  label={t("common:on")}
                  labelOff={t("common:off")}
                  isChecked={value === "true"}
                  onChange={(value) => onChange("" + value)}
                  isDisabled={!consentRequired}
                />
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("consentScreenText")}
            fieldId="kc-consent-screen-text"
          >
            <TextArea
              id="kc-consent-screen-text"
              name="attributes.consent-screen-text"
              ref={register}
              isDisabled={
                !(consentRequired && displayOnConsentScreen === "true")
              }
            />
          </FormGroup>
          <ActionGroup className="keycloak__form_actions">
            <Button variant="primary" onClick={save}>
              {t("common:save")}
            </Button>
            <Button variant="link" onClick={reload}>
              {t("common:reload")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </ScrollForm>
    </>
  );
};
