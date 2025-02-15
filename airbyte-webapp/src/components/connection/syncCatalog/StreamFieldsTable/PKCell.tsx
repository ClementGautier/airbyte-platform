import { CellContext } from "@tanstack/react-table";
import React from "react";
import { FormattedMessage } from "react-intl";

import { CheckBox } from "components/ui/CheckBox";
import { Tooltip, TooltipLearnMoreLink } from "components/ui/Tooltip";

import { links } from "utils/links";

import { TableStream } from "./StreamFieldsTable";

interface PKCellProps extends CellContext<TableStream, boolean | undefined> {
  isPKDefinitionSupported: boolean;
  isPrimaryKey: (path: string[]) => boolean;
  onPkSelect: (pkPath: string[]) => void;
}

export const PKCell: React.FC<PKCellProps> = ({ getValue, row, isPKDefinitionSupported, isPrimaryKey, onPkSelect }) => {
  if (!isPKDefinitionSupported) {
    return null;
  }

  const isSelectedPrimaryKey = isPrimaryKey(row.original.path);

  const checkbox = (
    <CheckBox
      checked={isSelectedPrimaryKey}
      onChange={() => onPkSelect(row.original.path)}
      disabled={!getValue()}
      data-testid="field-primary-key-checkbox"
    />
  );

  return isSelectedPrimaryKey && !getValue() ? (
    <Tooltip placement="bottom" control={checkbox}>
      <FormattedMessage id="form.field.sourceDefinedPK" />
      <TooltipLearnMoreLink url={links.sourceDefinedPKLink} />
    </Tooltip>
  ) : (
    checkbox
  );
};
