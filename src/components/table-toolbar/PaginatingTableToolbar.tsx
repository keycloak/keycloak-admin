import React from "react";
import {
  Pagination,
  ToggleTemplateProps,
  ToolbarItem,
} from "@patternfly/react-core";
import { TableToolbar } from "./TableToolbar";

type TableToolbarProps = {
  count: number;
  first: number;
  max: number;
  onNextClick: (page: number) => void;
  onPreviousClick: (page: number) => void;
  onPerPageSelect: (max: number, first: number) => void;
  searchTypeComponent?: React.ReactNode;
  toolbarItem?: React.ReactNode;
  children: React.ReactNode;
  inputGroupName?: string;
  inputGroupPlaceholder?: string;
  inputGroupOnChange?: (
    newInput: string,
    event: React.FormEvent<HTMLInputElement>
  ) => void;
  inputGroupOnEnter?: (value: string) => void;
};

export const PaginatingTableToolbar = ({
  count,
  first,
  max,
  onNextClick,
  onPreviousClick,
  onPerPageSelect,
  searchTypeComponent,
  toolbarItem,
  children,
  inputGroupName,
  inputGroupPlaceholder,
  inputGroupOnChange,
  inputGroupOnEnter,
}: TableToolbarProps) => {
  const page = Math.round(first / max);
  const pagination = (variant: "top" | "bottom" = "top") => (
    <Pagination
      isCompact
      toggleTemplate={({ firstIndex, lastIndex }: ToggleTemplateProps) => (
        <b>
          {firstIndex} - {lastIndex! - (count < max ? 1 : 0)}
        </b>
      )}
      itemCount={count + page * max + (count <= max ? 1 : 0)}
      page={page + 1}
      perPage={max}
      onNextClick={(_, p) => onNextClick((p - 1) * max)}
      onPreviousClick={(_, p) => onPreviousClick((p - 1) * max)}
      onPerPageSelect={(_, m, f) => onPerPageSelect(f - 1, m)}
      variant={variant}
    />
  );

  if (count === 0) {
    <>{children}</>;
  }
  return (
    <TableToolbar
      searchTypeComponent={searchTypeComponent}
      toolbarItem={
        <>
          {toolbarItem}
          <ToolbarItem variant="pagination">{pagination()}</ToolbarItem>
        </>
      }
      toolbarItemFooter={<ToolbarItem>{pagination("bottom")}</ToolbarItem>}
      inputGroupName={inputGroupName}
      inputGroupPlaceholder={inputGroupPlaceholder}
      inputGroupOnChange={inputGroupOnChange}
      inputGroupOnEnter={inputGroupOnEnter}
    >
      {children}
    </TableToolbar>
  );
};
