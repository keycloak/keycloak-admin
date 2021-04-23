import React from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormGroup, TextInput, ValidatedOptions } from "@patternfly/react-core";

import { HelpItem } from "../../components/help-enabler/HelpItem";
import { RedirectUrl } from "../component/RedirectUrl";
import { TextField } from "../component/TextField";
import { DisplayOrder } from "../component/DisplayOrder";

export const OIDCGeneralSettings = () => {
  const { t } = useTranslation("identity-providers");
  const { t: th } = useTranslation("identity-providers-help");

  const { register, errors } = useFormContext();

  return (
    <>
      <RedirectUrl />

      <FormGroup
        label={t("alias")}
        labelIcon={
          <HelpItem
            helpText={th("alias")}
            forLabel={t("alias")}
            forID="alias"
          />
        }
        fieldId="alias"
        isRequired
        validated={
          errors.errors ? ValidatedOptions.error : ValidatedOptions.default
        }
        helperTextInvalid={t("common:required")}
      >
        <TextInput
          isRequired
          type="text"
          id="alias"
          data-testid="alias"
          name="alias"
          ref={register({ required: true })}
        />
      </FormGroup>

      <TextField field="displayName" label="displayName" />
      <DisplayOrder />
    </>
  );
};
