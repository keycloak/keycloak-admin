import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
  IFormatter,
  IFormatterValueType,
} from '@patternfly/react-table';
import {
  ToolbarContent,
  ToolbarItem,
  Pagination,
  Toolbar,
  InputGroup,
  TextInput,
  Button,
  Badge,
  ToggleTemplateProps,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

import { Client } from './client-model';

type ClientListProps = {
  clients?: Client[];
  baseUrl: string;
  page: number;
  pageSize: number;
  onNextClick: (page: number) => void;
  onPreviousClick: (page: number) => void;
};

const columns: (keyof Client)[] = [
  'clientId',
  'protocol',
  'description',
  'baseUrl',
];

export const ClientList = ({
  baseUrl,
  clients,
  page,
  pageSize,
  onNextClick,
  onPreviousClick,
}: ClientListProps) => {
  const pagination = (count: number, variant: 'top' | 'bottom' = 'top') => (
    <Pagination
      isCompact
      toggleTemplate={({ firstIndex, lastIndex }: ToggleTemplateProps) => (
        <b>
          {firstIndex} - {lastIndex}
        </b>
      )}
      itemCount={count + (page - 1) * pageSize + (count <= pageSize ? 1 : 0)}
      page={page}
      perPage={pageSize}
      onNextClick={(_, p) => onNextClick(p)}
      onPreviousClick={(_, p) => onPreviousClick(p)}
      variant={variant}
    />
  );

  const enabled = (): IFormatter => (data?: IFormatterValueType) => {
    const field = data!.toString();
    const value = field.substring(0, field.indexOf('#'));
    return field.indexOf('true') != -1 ? (
      <>{value}</>
    ) : (
      <>
        {value} <Badge isRead>Disabled</Badge>
      </>
    );
  };

  const emptyFormatter = (): IFormatter => (data?: IFormatterValueType) => {
    return data ? data : '—';
  };

  const replaceBaseUrl = (r: Client) =>
    r.rootUrl &&
    r.rootUrl
      .replace('${authBaseUrl}', baseUrl)
      .replace('${authAdminUrl}', baseUrl) +
      (r.baseUrl ? r.baseUrl.substr(1) : '');

  const data = clients!
    .map((r) => {
      r.clientId = r.clientId + '#' + r.enabled;
      r.baseUrl = replaceBaseUrl(r);
      return r;
    })
    .map((c) => {
      return { cells: columns.map((col) => c[col]) };
    });
  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <InputGroup>
              <TextInput type="text" aria-label="search for client criteria" />
              <Button variant="control" aria-label="search for client">
                <SearchIcon />
              </Button>
            </InputGroup>
          </ToolbarItem>
          <ToolbarItem>
            <Button>Create client</Button>
            <Button variant="link">Import client</Button>
          </ToolbarItem>
          <ToolbarItem variant="pagination">
            {pagination(data.length)}
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table
        variant={TableVariant.compact}
        cells={[
          { title: 'Client ID', cellFormatters: [enabled()] },
          'Type',
          { title: 'Description', cellFormatters: [emptyFormatter()] },
          { title: 'Home URL', cellFormatters: [emptyFormatter()] },
        ]}
        rows={data}
        aria-label="Client list"
      >
        <TableHeader />
        <TableBody />
      </Table>
      <Toolbar>
        <ToolbarItem>{pagination(data.length, 'bottom')}</ToolbarItem>
      </Toolbar>
    </>
  );
};
