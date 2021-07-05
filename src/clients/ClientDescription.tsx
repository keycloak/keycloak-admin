import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  TextArea,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";

import { HelpItem } from "../components/help-enabler/HelpItem";

import { FormAccess } from "../components/form-access/FormAccess";
import type { ClientForm } from "./ClientDetails";

export const ClientDescription = () => {
  const { t } = useTranslation("clients");
  const { register, errors } = useFormContext<ClientForm>();
  return (
    <FormAccess role="manage-clients" unWrap>
      <FormGroup
        labelIcon={
          <HelpItem
            helpText="clients-help:clientId"
            forLabel={t("common:clientId")}
            forID="kc-client-id"
          />
        }
        label={t("common:clientId")}
        fieldId="kc-client-id"
        helperTextInvalid={t("common:required")}
        validated={
          errors.clientId ? ValidatedOptions.error : ValidatedOptions.default
        }
        isRequired
      >
        <TextInput
          type="text"
          id="kc-client-id"
          {...register("clientId", { required: true })}
          validated={
            errors.clientId ? ValidatedOptions.error : ValidatedOptions.default
          }
        />
      </FormGroup>
      <FormGroup
        labelIcon={
          <HelpItem
            helpText="clients-help:clientName"
            forLabel={t("common:name")}
            forID="kc-name"
          />
        }
        label={t("common:name")}
        fieldId="kc-name"
      >
        <TextInput type="text" id="kc-name" {...register("name")} />
      </FormGroup>
      <FormGroup
        labelIcon={
          <HelpItem
            helpText="clients-help:description"
            forLabel={t("common:description")}
            forID="kc-description"
          />
        }
        label={t("common:description")}
        fieldId="kc-description"
        validated={
          errors.description ? ValidatedOptions.error : ValidatedOptions.default
        }
        helperTextInvalid={errors.description?.message}
      >
        <TextArea
          type="text"
          id="kc-description"
          {...register("description", {
            maxLength: {
              value: 255,
              message: t("common:maxLength", { length: 255 }),
            },
          })}
          validated={
            errors.description
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        />
      </FormGroup>
    </FormAccess>
  );
};
