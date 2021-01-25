import React from "react";
import {
  ActionGroup,
  Button,
  FormGroup,
  TextArea,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { UseFormMethods } from "react-hook-form";

import { FormAccess } from "../components/form-access/FormAccess";
import { RoleFormType } from "./RealmRoleTabs";

export type RealmRoleFormProps = {
  form: UseFormMethods<RoleFormType>;
  save: (role: RoleFormType) => void;
  editMode: boolean;
};

export const RealmRoleForm = ({ form, save, editMode }: RealmRoleFormProps) => {
  const { t } = useTranslation("roles");
  return (
    <FormAccess
      isHorizontal
      onSubmit={form.handleSubmit(save)}
      role="manage-realm"
      className="pf-u-mt-lg"
    >
      <FormGroup
        label={t("roleName")}
        fieldId="kc-name"
        isRequired
        validated={form.errors.name ? "error" : "default"}
        helperTextInvalid={t("common:required")}
      >
        <TextInput
          ref={form.register({ required: !editMode })}
          type="text"
          id="kc-name"
          name="name"
          isReadOnly={editMode}
        />
      </FormGroup>
      <FormGroup
        label={t("description")}
        fieldId="kc-description"
        validated={
          form.errors.description
            ? ValidatedOptions.error
            : ValidatedOptions.default
        }
        helperTextInvalid={form.errors.description?.message}
      >
        <TextArea
          name="description"
          ref={form.register({
            maxLength: {
              value: 255,
              message: t("common:maxLength", { length: 255 }),
            },
          })}
          type="text"
          validated={
            form.errors.description
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
          id="kc-role-description"
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="primary" type="submit">
          {t("common:save")}
        </Button>
        <Button variant="link">
          {editMode ? t("common:reload") : t("common:cancel")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
