import { FormGroup, Switch } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { useForm, Controller } from "react-hook-form";
import { convertToFormValues } from "../../util";
import ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { FormAccess } from "../../components/form-access/FormAccess";
import { useAdminClient } from "../../context/auth/AdminClient";
import { useParams } from "react-router-dom";

export const LdapSettingsAdvanced = () => {
  const { t } = useTranslation("user-federation");
  const helpText = useTranslation("user-federation-help").t;
  const adminClient = useAdminClient();
  const { control, setValue } = useForm<ComponentRepresentation>();
  const { id } = useParams<{ id: string }>();

  const setupForm = (component: ComponentRepresentation) => {
    Object.entries(component).map((entry) => {
      if (entry[0] === "config") {
        convertToFormValues(entry[1], "config", setValue);
      } else {
        setValue(entry[0], entry[1]);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const fetchedComponent = await adminClient.components.findOne({ id });
      if (fetchedComponent) {
        setupForm(fetchedComponent);
      }
    })();
  }, []);

  /*
  **Advanced settings**
  usePasswordModifyExtendedOp: ["true"]
  validatePasswordPolicy: ["true"]
  trustEmail: ["true"]
*/

  return (
    <>
      <FormAccess role="manage-realm" isHorizontal>
        <FormGroup
          label={t("enableLdapv3Password")}
          labelIcon={
            <HelpItem
              helpText={helpText("enableLdapv3PasswordHelp")}
              forLabel={t("enableLdapv3Password")}
              forID="kc-enable-ldapv3-password"
            />
          }
          fieldId="kc-enable-ldapv3-password"
          hasNoPaddingTop
        >
          <Controller
            name="config.usePasswordModifyExtendedOp"
            defaultValue={false}
            control={control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-enable-ldapv3-password"}
                isChecked={value[0] === "true"}
                isDisabled={false}
                onChange={onChange}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          ></Controller>
        </FormGroup>

        <FormGroup
          label={t("validatePasswordPolicy")}
          labelIcon={
            <HelpItem
              helpText={helpText("validatePasswordPolicyHelp")}
              forLabel={t("validatePasswordPolicy")}
              forID="kc-validate-password-policy"
            />
          }
          fieldId="kc-validate-password-policy"
          hasNoPaddingTop
        >
          <Controller
            name="config.validatePasswordPolicy"
            defaultValue={false}
            control={control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-validate-password-policy"}
                isChecked={value[0] === "true"}
                isDisabled={false}
                onChange={onChange}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          ></Controller>
        </FormGroup>

        <FormGroup
          label={t("trustEmail")}
          labelIcon={
            <HelpItem
              helpText={helpText("trustEmailHelp")}
              forLabel={t("trustEmail")}
              forID="kc-trust-email"
            />
          }
          fieldId="kc-trust-email"
          hasNoPaddingTop
        >
          <Controller
            name="config.trustEmail"
            defaultValue={false}
            control={control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-trust-email"}
                isChecked={value[0] === "true"}
                isDisabled={false}
                onChange={onChange}
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
