import React, { useEffect, useState } from "react";
import {
  AlertVariant,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
  // Title,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { useForm, Controller, useWatch } from "react-hook-form";
import ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { FormAccess } from "../../components/form-access/FormAccess";
import { useAdminClient } from "../../context/auth/AdminClient";
import { useParams } from "react-router-dom";
import { convertToFormValues } from "../../util";
import { useAlerts } from "../../components/alert/Alerts";
import _ from "lodash";
import { WizardSectionHeader } from "../../components/wizard-section-header/WizardSectionHeader";

export type KerberosSettingsRequiredProps = {
  showSectionHeading?: boolean;
  showSectionDescription?: boolean;
  // form: UseFormMethods;
};

export const KerberosSettingsRequired = ({
  showSectionHeading = false,
  showSectionDescription = false,
}: KerberosSettingsRequiredProps) => {

  const { t } = useTranslation("user-federation");
  const helpText = useTranslation("user-federation-help").t;

  const adminClient = useAdminClient();
  const [isEditModeDropdownOpen, setIsEditModeDropdownOpen] = useState(false);
  const { register, control, setValue } = useForm<ComponentRepresentation>();
  const { id } = useParams<{ id: string }>();

  const allowPassAuth = useWatch({
    control: control,
    name: "config.allowPasswordAuthentication",
  });

  const { addAlert } = useAlerts();

  useEffect(() => {
    (async () => {
      const fetchedComponent = await adminClient.components.findOne({ id });
      if (fetchedComponent) {
        setupForm(fetchedComponent);
      }
    })();
  }, []);

  const setupForm = (component: ComponentRepresentation) => {
    Object.entries(component).map((entry) => {
      setValue(
        "config.allowPasswordAuthentication",
        component.config?.allowPasswordAuthentication
      );
      if (entry[0] === "config") {
        convertToFormValues(entry[1], "config", setValue);
      }
      setValue(entry[0], entry[1]);
    });
  };

  const save = async (component: ComponentRepresentation) => {
    try {
      await adminClient.components.update({ id }, component);
      setupForm(component as ComponentRepresentation);
      addAlert(t("roleSaveSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(`${t("roleSaveError")} '${error}'`, AlertVariant.danger);
    }
  };

  const form = useForm<ComponentRepresentation>();

  return (
    <>
      {showSectionHeading && (
        <WizardSectionHeader
          title={t("requiredSettings")}
          description={helpText("kerberosRequiredSettingsDescription")}
          showDescription={showSectionDescription}
        />
      )}

      {/* Required settings */}
      <FormAccess
        role="manage-realm"
        isHorizontal
        onSubmit={form.handleSubmit(save)}
      >
        <FormGroup
          label={t("consoleDisplayName")}
          labelIcon={
            <HelpItem
              helpText={helpText("consoleDisplayNameHelp")}
              forLabel={t("consoleDisplayName")}
              forID="kc-console-display-name"
            />
          }
          fieldId="kc-console-display-name"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-console-display-name"
            name="name"
            ref={register}
          />
        </FormGroup>

        <FormGroup
          label={t("kerberosRealm")}
          labelIcon={
            <HelpItem
              helpText={helpText("kerberosRealmHelp")}
              forLabel={t("kerberosRealm")}
              forID="kc-kerberos-realm"
            />
          }
          fieldId="kc-kerberos-realm"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-kerberos-realm"
            name="config.kerberosRealm"
            ref={register}
          />
        </FormGroup>

        <FormGroup
          label={t("serverPrincipal")}
          labelIcon={
            <HelpItem
              helpText={helpText("serverPrincipalHelp")}
              forLabel={t("serverPrincipal")}
              forID="kc-server-principal"
            />
          }
          fieldId="kc-server-principal"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-server-principal"
            name="config.serverPrincipal"
            ref={register}
          />
        </FormGroup>

        <FormGroup
          label={t("keyTab")}
          labelIcon={
            <HelpItem
              helpText={helpText("keyTabHelp")}
              forLabel={t("keyTab")}
              forID="kc-key-tab"
            />
          }
          fieldId="kc-key-tab"
          isRequired
        >
          <TextInput
            isRequired
            type="text"
            id="kc-key-tab"
            name="config.keyTab"
            ref={register}
          />
        </FormGroup>

        <FormGroup
          label={t("debug")}
          labelIcon={
            <HelpItem
              helpText={helpText("debugHelp")}
              forLabel={t("debug")}
              forID="kc-debug"
            />
          }
          fieldId="kc-debug"
          hasNoPaddingTop
        >
          {" "}
          <Controller
            name="config.debug"
            defaultValue={false}
            control={control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-debug"}
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
          label={t("allowPasswordAuthentication")}
          labelIcon={
            <HelpItem
              helpText={helpText("allowPasswordAuthenticationHelp")}
              forLabel={t("allowPasswordAuthentication")}
              forID="kc-allow-password-authentication"
            />
          }
          fieldId="kc-allow-password-authentication"
          hasNoPaddingTop
        >
          <Controller
            name="config.allowPasswordAuthentication"
            defaultValue={false}
            control={control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-allow-password-authentication"}
                isDisabled={false}
                onChange={(value) => onChange([`${value}`])}
                isChecked={value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          ></Controller>
        </FormGroup>

        {_.isEqual(allowPassAuth, ["true"]) ? (
          <FormGroup
            label={t("editMode")}
            labelIcon={
              <HelpItem
                helpText={helpText("editModeKerberosHelp")}
                forLabel={t("editMode")}
                forID="kc-edit-mode"
              />
            }
            fieldId="kc-edit-mode"
          >
            {" "}
            <Controller
              name="config.editMode"
              defaultValue={t("common:selectOne")}
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-edit-mode"
                  required
                  onToggle={() =>
                    setIsEditModeDropdownOpen(!isEditModeDropdownOpen)
                  }
                  isOpen={isEditModeDropdownOpen}
                  onSelect={(_, value) => {
                    onChange(value as string);
                    setIsEditModeDropdownOpen(false);
                  }}
                  selections={value}
                  variant={SelectVariant.single}
                >
                  <SelectOption
                    key={0}
                    value={t("common:selectOne")}
                    isPlaceholder
                  />
                  <SelectOption key={1} value="READ_ONLY" />
                  <SelectOption key={2} value="UNSYNCED" />
                </Select>
              )}
            ></Controller>
          </FormGroup>
        ) : (
          <></>
        )}

        <FormGroup
          label={t("updateFirstLogin")}
          labelIcon={
            <HelpItem
              helpText={helpText("updateFirstLoginHelp")}
              forLabel={t("updateFirstLogin")}
              forID="kc-update-first-login"
            />
          }
          fieldId="kc-update-first-login"
          hasNoPaddingTop
        >
          <Controller
            name="config.updateProfileFirstLogin"
            defaultValue={false}
            control={control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-update-first-login"}
                isDisabled={false}
                onChange={(value) => onChange([`${value}`])}
                isChecked={value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          ></Controller>
        </FormGroup>
      </FormAccess>
    </>
  );
};
