<<<<<<< HEAD
import React, { FormEvent, Fragment, ReactNode } from "react";
=======
import React, {
  FormEvent,
  Fragment,
  ReactNode,
} from "react";
>>>>>>> filter realm roles on Enter key press, add filter functionality
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  InputGroup,
  TextInput,
  Button,
  ButtonVariant,
  Divider,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";

type TableToolbarProps = {
  toolbarItem?: ReactNode;
  toolbarItemFooter?: ReactNode;
  children: ReactNode;
  searchTypeComponent?: ReactNode;
  inputGroupName?: string;
  inputGroupPlaceholder?: string;
  inputGroupOnChange?: (
    newInput: string,
    event: FormEvent<HTMLInputElement>
  ) => void;
  inputGroupOnEnter?: (value: string) => void;
};

export const TableToolbar = ({
  toolbarItem,
  toolbarItemFooter,
  children,
  searchTypeComponent,
  inputGroupName,
  inputGroupPlaceholder,
  inputGroupOnChange,
  inputGroupOnEnter,
}: TableToolbarProps) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = React.useState<string>("");

  const onSearch = () => {
    if (searchValue !== "") {
      setSearchValue(searchValue);
      inputGroupOnEnter && inputGroupOnEnter(searchValue);
    } else {
      setSearchValue("");
      inputGroupOnEnter && inputGroupOnEnter("");
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleInputChange = (
    value: string,
    event: FormEvent<HTMLInputElement>
  ) => {
    inputGroupOnChange && inputGroupOnChange(value, event);
    setSearchValue(value);
  };

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <Fragment>
            {inputGroupName && (
              <ToolbarItem>
                <InputGroup>
                  {searchTypeComponent}
                  {inputGroupPlaceholder && (
                    <>
                      <TextInput
                        name={inputGroupName}
                        id={inputGroupName}
                        type="search"
                        aria-label={t("search")}
                        placeholder={inputGroupPlaceholder}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                      />
                      <Button
                        variant={ButtonVariant.control}
                        aria-label={t("search")}
                        onClick={onSearch}
                      >
                        <SearchIcon />
                      </Button>
                    </>
                  )}
                </InputGroup>
              </ToolbarItem>
            )}
          </Fragment>
          {toolbarItem}
        </ToolbarContent>
      </Toolbar>
<<<<<<< HEAD
      {filterChips}
=======
>>>>>>> remove filter chips functionality
      <Divider />
      {children}
      <Toolbar>{toolbarItemFooter}</Toolbar>
    </>
  );
};
