import React, { ReactElement, ReactNode, useState } from "react";
import {
  Button,
  ButtonVariant,
  Modal,
  ModalVariant
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

export const useConfirmDialog = (
  props: ConfirmDialogProps
): [() => void, () => ReactElement] => {
  const [show, setShow] = useState(false);

  function toggleDialog() {
    // eslint-disable-next-line no-shadow
    setShow(show => !show);
  }

  const Dialog = () => (
    <ConfirmDialogModal
      key="confirmDialog"
      {...props}
      open={show}
      toggleDialog={toggleDialog}
    />
  );
  return [toggleDialog, Dialog];
};

export interface ConfirmDialogModalProps extends ConfirmDialogProps {
  open: boolean;
  toggleDialog: () => void;
}

export type ConfirmDialogProps = {
  titleKey: string;
  messageKey?: string;
  cancelButtonLabel?: string;
  continueButtonLabel?: string;
  continueButtonVariant?: ButtonVariant;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: ReactNode;
};

export const ConfirmDialogModal = ({
  titleKey,
  messageKey,
  cancelButtonLabel,
  continueButtonLabel,
  continueButtonVariant,
  onConfirm,
  onCancel,
  children,
  open = true,
  toggleDialog
}: ConfirmDialogModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t(titleKey)}
      isOpen={open}
      onClose={toggleDialog}
      variant={ModalVariant.small}
      actions={[
        <Button
          id="modal-confirm"
          key="confirm"
          variant={continueButtonVariant || ButtonVariant.primary}
          onClick={() => {
            onConfirm();
            toggleDialog();
          }}
        >
          {t(continueButtonLabel || "common:continue")}
        </Button>,
        <Button
          id="modal-cancel"
          key="cancel"
          variant={ButtonVariant.secondary}
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
            toggleDialog();
          }}
        >
          {t(cancelButtonLabel || "common:cancel")}
        </Button>
      ]}
    >
      {!messageKey && children}
      {messageKey && t(messageKey)}
    </Modal>
  );
};
