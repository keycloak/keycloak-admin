import {
  ActionGroup,
  AlertVariant,
  Button,
  Form,
  PageSection,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";

import { KerberosSettingsRequired } from "./kerberos/KerberosSettingsRequired";
import { KerberosSettingsCache } from "./kerberos/KerberosSettingsCache";
import { useHistory } from "react-router-dom";
import { useRealm } from "../context/realm-context/RealmContext";
import { useParams } from "react-router-dom";
import { convertToFormValues } from "../util";
import { useAlerts } from "../components/alert/Alerts";
import { useAdminClient } from "../context/auth/AdminClient";
import ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { useForm } from "react-hook-form";

export const UserFederationKerberosSettings = () => {
  const { t } = useTranslation("user-federation");
  const form = useForm<ComponentRepresentation>({ mode: "onChange" });
  const history = useHistory();
  const adminClient = useAdminClient();
  const { realm } = useRealm();

  const { id } = useParams<{ id: string }>();

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
      form.setValue(
        "config.allowPasswordAuthentication",
        component.config?.allowPasswordAuthentication
      );
      if (entry[0] === "config") {
        convertToFormValues(entry[1], "config", form.setValue);
      }
      form.setValue(entry[0], entry[1]);
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

  return (
    <>
      <PageSection variant="light">
        <KerberosSettingsRequired form={form} save={save} showSectionHeading />
      </PageSection>
      <PageSection variant="light" isFilled>
        <KerberosSettingsCache form={form} save={save} showSectionHeading />
        <Form onSubmit={form.handleSubmit(save)}>
          <ActionGroup>
            <Button variant="primary" type="submit">
              {t("common:save")}
            </Button>
            <Button
              variant="link"
              onClick={() => history.push(`/${realm}/user-federation`)}
            >
              {t("common:cancel")}
            </Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </>
  );
};
