import {
  Form,
  FormGroup,
  Page,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsItem,
  PageSection,
  TextInput,
} from "@patternfly/react-core";
import type { Meta } from "@storybook/react";
import React from "react";
import {
  Help,
  HelpHeader,
  useHelp,
} from "../components/help-enabler/HelpHeader";
import { HelpItem } from "../components/help-enabler/HelpItem";

export default {
  title: "Help System Example",
  component: HelpHeader,
} as Meta;

export const HelpSystem = () => (
  <Help>
    <HelpSystemTest />
  </Help>
);

export const HelpItems = () => (
  <HelpItem
    helpText="This explains the related field"
    forLabel="Field label"
    forID="storybook-example-id"
  />
);

export const FormFieldHelp = () => (
  <Form isHorizontal>
    <FormGroup
      label="Label"
      labelIcon={
        <HelpItem
          helpText="This explains the related field"
          forLabel="Field label"
          forID="storybook-form-help"
        />
      }
      fieldId="storybook-form-help"
    >
      <TextInput isRequired type="text" id="storybook-form-help"></TextInput>
    </FormGroup>
  </Form>
);

const HelpSystemTest = () => {
  const { enabled } = useHelp();
  return (
    <Page
      header={
        <PageHeader
          headerTools={
            <PageHeaderTools>
              <PageHeaderToolsItem>
                <HelpHeader />
              </PageHeaderToolsItem>
              <PageHeaderToolsItem>dummy user...</PageHeaderToolsItem>
            </PageHeaderTools>
          }
        />
      }
    >
      <PageSection>Help system is {enabled ? "enabled" : "not on"}</PageSection>
      <PageSection variant="light">
        <FormFieldHelp />
      </PageSection>
    </Page>
  );
};
