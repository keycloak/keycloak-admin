import {
  Button,
  FormGroup,
  InputGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { Controller, UseFormMethods } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@patternfly/react-icons";
import { FormAccess } from "../../components/form-access/FormAccess";
import { WizardSectionHeader } from "../../components/wizard-section-header/WizardSectionHeader";

export type LdapSettingsConnectionProps = {
  form: UseFormMethods;
  showSectionHeading?: boolean;
  showSectionDescription?: boolean;
};

export const LdapSettingsConnection = ({
  form,
  showSectionHeading = false,
  showSectionDescription = false,
}: LdapSettingsConnectionProps) => {
  const { t } = useTranslation("user-federation");
  const helpText = useTranslation("user-federation-help").t;

  const [
    isTruststoreSpiDropdownOpen,
    setIsTruststoreSpiDropdownOpen,
  ] = useState(false);

  const [isBindTypeDropdownOpen, setIsBindTypeDropdownOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      {showSectionHeading && (
        <WizardSectionHeader
          title={t("connectionAndAuthenticationSettings")}
          description={helpText(
            "ldapConnectionAndAuthorizationSettingsDescription"
          )}
          showDescription={showSectionDescription}
        />
      )}
      <FormAccess role="manage-realm" isHorizontal>
        <FormGroup
          label={t("connectionURL")}
          labelIcon={
            <HelpItem
              helpText={helpText("consoleDisplayConnectionUrlHelp")}
              forLabel={t("connectionURL")}
              forID="kc-console-connection-url"
            />
          }
          fieldId="kc-console-connection-url"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-console-connection-url"
            name="config.connectionUrl[0]"
            ref={form.register({
              required: {
                value: true,
                message: `${t("validateConnectionUrl")}`,
              },
            })}
          />
          {form.errors.config &&
            form.errors.config.connectionUrl &&
            form.errors.config.connectionUrl[0] && (
              <div className="error">
                {form.errors.config.connectionUrl[0].message}
              </div>
            )}
        </FormGroup>
        <FormGroup
          label={t("enableStartTls")}
          labelIcon={
            <HelpItem
              helpText={helpText("enableStartTlsHelp")}
              forLabel={t("enableStartTls")}
              forID="kc-enable-start-tls"
            />
          }
          fieldId="kc-enable-start-tls"
          hasNoPaddingTop
        >
          <Controller
            name="config.startTls"
            defaultValue={["false"]}
            control={form.control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-enable-start-tls"}
                isDisabled={false}
                onChange={(value) => onChange([`${value}`])}
                isChecked={value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          ></Controller>
        </FormGroup>

        <FormGroup
          label={t("useTruststoreSpi")}
          labelIcon={
            <HelpItem
              helpText={helpText("useTruststoreSpiHelp")}
              forLabel={t("useTruststoreSpi")}
              forID="kc-use-truststore-spi"
            />
          }
          fieldId="kc-use-truststore-spi"
        >
          <Controller
            name="config.useTruststoreSpi[0]"
            defaultValue=""
            control={form.control}
            render={({ onChange, value }) => (
              <Select
                toggleId="kc-use-truststore-spi"
                onToggle={() =>
                  setIsTruststoreSpiDropdownOpen(!isTruststoreSpiDropdownOpen)
                }
                isOpen={isTruststoreSpiDropdownOpen}
                onSelect={(_, value) => {
                  onChange(value as string);
                  setIsTruststoreSpiDropdownOpen(false);
                }}
                selections={value}
                variant={SelectVariant.single}
              >
                <SelectOption key={0} value="always">
                  {t("always")}
                </SelectOption>
                <SelectOption key={1} value="ldapsOnly">
                  {t("onlyLdaps")}
                </SelectOption>
                <SelectOption key={2} value="never">
                  {t("never")}
                </SelectOption>
              </Select>
            )}
          ></Controller>
        </FormGroup>
        <FormGroup
          label={t("connectionPooling")}
          labelIcon={
            <HelpItem
              helpText={helpText("connectionPoolingHelp")}
              forLabel={t("connectionPooling")}
              forID="kc-connection-pooling"
            />
          }
          fieldId="kc-connection-pooling"
          hasNoPaddingTop
        >
          <Controller
            name="config.connectionPooling"
            defaultValue={false}
            control={form.control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-connection-pooling"}
                isDisabled={false}
                onChange={(value) => onChange([`${value}`])}
                isChecked={value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          ></Controller>
        </FormGroup>
        <FormGroup
          label={t("connectionTimeout")}
          labelIcon={
            <HelpItem
              helpText={helpText("connectionTimeoutHelp")}
              forLabel={t("connectionTimeout")}
              forID="kc-console-connection-timeout"
            />
          }
          fieldId="kc-console-connection-timeout"
        >
          <TextInput
            type="text"
            id="kc-console-connection-timeout"
            name="config.connectionTimeout[0]"
            ref={form.register}
          />
        </FormGroup>
        <FormGroup
          label={t("bindType")}
          labelIcon={
            <HelpItem
              helpText={helpText("bindTypeHelp")}
              forLabel={t("bindType")}
              forID="kc-bind-type"
            />
          }
          fieldId="kc-bind-type"
          isRequired
        >
          <Controller
            name="config.authType[0]"
            defaultValue=""
            control={form.control}
            render={({ onChange, value }) => (
              <Select
                toggleId="kc-bind-type"
                required
                onToggle={() =>
                  setIsBindTypeDropdownOpen(!isBindTypeDropdownOpen)
                }
                isOpen={isBindTypeDropdownOpen}
                onSelect={(_, value) => {
                  onChange(value as string);
                  setIsBindTypeDropdownOpen(false);
                }}
                selections={value}
                variant={SelectVariant.single}
              >
                <SelectOption key={3} value="simple" />
                <SelectOption key={4} value="none" />
              </Select>
            )}
          ></Controller>
        </FormGroup>
        <FormGroup
          label={t("bindDn")}
          labelIcon={
            <HelpItem
              helpText={helpText("bindDnHelp")}
              forLabel={t("bindDn")}
              forID="kc-console-bind-dn"
            />
          }
          fieldId="kc-console-bind-dn"
        >
          <TextInput
            type="text"
            id="kc-console-bind-dn"
            name="config.bindDn[0]"
            ref={form.register}
          />
        </FormGroup>
        <FormGroup
          label={t("bindCredentials")}
          labelIcon={
            <HelpItem
              helpText={helpText("bindCredentialsHelp")}
              forLabel={t("bindCredentials")}
              forID="kc-console-bind-credentials"
            />
          }
          fieldId="kc-console-bind-credentials"
          isRequired
        >
          <InputGroup>
            <TextInput
              isRequired
              type={isPasswordVisible ? "text" : "password"}
              id="kc-console-bind-credentials"
              name="config.bindCredential[0]"
              ref={form.register({
                required: {
                  value: true,
                  message: `${t("validateBindCredentials")}`,
                },
              })}
            />
            <Button
              variant="control"
              aria-label="show password button for bind credentials"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {!isPasswordVisible ? <EyeIcon /> : <EyeSlashIcon />}
            </Button>
          </InputGroup>
          {form.errors.config &&
            form.errors.config.bindCredential &&
            form.errors.config.bindCredential[0] && (
              <div className="error">
                {form.errors.config.bindCredential[0].message}
              </div>
            )}
        </FormGroup>
        <FormGroup fieldId="kc-test-button">
          {" "}
          {/* TODO: whatever this button is supposed to do */}
          <Button variant="secondary" id="kc-test-button">
            {t("common:test")}
          </Button>
        </FormGroup>
      </FormAccess>
    </>
  );
};
