import React, { isValidElement, ReactNode, useContext } from "react";
import { Popover } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { HelpContext } from "./HelpHeader";

type HelpItemProps = {
  helpText: string | ReactNode;
  forLabel: string;
  forID: string;
  noVerticalAlign?: boolean;
  unWrap?: boolean;
  id?: string;
};

export const HelpItem = ({
  helpText,
  forLabel,
  forID,
  id,
  noVerticalAlign = true,
  unWrap = false,
}: HelpItemProps) => {
  const { t } = useTranslation();
  const { enabled } = useContext(HelpContext);
  return (
    <>
      {enabled && (
        <Popover
          bodyContent={
            isValidElement(helpText) ? helpText : t(helpText as string)
          }
        >
          <>
            {!unWrap && (
              <button
                id={id}
                aria-label={t(`helpLabel`, { label: forLabel })}
                onClick={(e) => e.preventDefault()}
                aria-describedby={forID}
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign={noVerticalAlign} />
              </button>
            )}
            {unWrap && <HelpIcon noVerticalAlign={noVerticalAlign} />}
          </>
        </Popover>
      )}
    </>
  );
};
