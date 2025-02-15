import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useFormikContext } from "formik";
import React from "react";
import { FormattedMessage } from "react-intl";

import { FormikConnectionFormValues } from "components/connection/ConnectionForm/formConfig";
import { Header } from "components/SimpleTableComponents";
import { Button } from "components/ui/Button";
import { CheckBox } from "components/ui/CheckBox";
import { Text } from "components/ui/Text";
import { InfoTooltip, TooltipLearnMoreLink } from "components/ui/Tooltip";

import { NamespaceDefinitionType } from "core/request/AirbyteClient";
import { useBulkEditService } from "hooks/services/BulkEdit/BulkEditService";
import { useConnectionFormService } from "hooks/services/ConnectionForm/ConnectionFormService";
import { useExperiment } from "hooks/services/Experiment";
import { useModalService } from "hooks/services/Modal";
import { links } from "utils/links";

import styles from "./StreamsConfigTableHeader.module.scss";
import {
  DestinationNamespaceFormValueType,
  DestinationNamespaceModal,
} from "../../DestinationNamespaceModal/DestinationNamespaceModal";
import {
  DestinationStreamNamesFormValueType,
  DestinationStreamNamesModal,
  StreamNameDefinitionValueType,
} from "../../DestinationStreamNamesModal/DestinationStreamNamesModal";
import { CellText, CellTextProps } from "../CellText";

const HeaderCell: React.FC<React.PropsWithChildren<CellTextProps>> = ({ children, ...tableCellProps }) => (
  <CellText {...tableCellProps} withOverflow>
    <Text size="sm" className={styles.headerCellText}>
      {children}
    </Text>
  </CellText>
);

export const StreamsConfigTableHeader: React.FC = () => {
  const { mode } = useConnectionFormService();
  const { openModal, closeModal } = useModalService();
  const { onCheckAll, selectedBatchNodeIds, allChecked } = useBulkEditService();
  const formikProps = useFormikContext<FormikConnectionFormValues>();
  const isColumnSelectionEnabled = useExperiment("connection.columnSelection", false);

  const destinationNamespaceChange = (value: DestinationNamespaceFormValueType) => {
    formikProps.setFieldValue("namespaceDefinition", value.namespaceDefinition);

    if (value.namespaceDefinition === NamespaceDefinitionType.customformat) {
      formikProps.setFieldValue("namespaceFormat", value.namespaceFormat);
    }
  };

  const destinationStreamNamesChange = (value: DestinationStreamNamesFormValueType) => {
    formikProps.setFieldValue(
      "prefix",
      value.streamNameDefinition === StreamNameDefinitionValueType.Prefix ? value.prefix : ""
    );
  };

  return (
    <Header className={classNames(styles.headerContainer)} data-testid="catalog-tree-table-header">
      <CellText size="fixed" className={styles.checkboxCell}>
        {mode !== "readonly" && (
          <CheckBox
            checkboxSize="sm"
            onChange={onCheckAll}
            indeterminate={selectedBatchNodeIds.length > 0 && !allChecked}
            checked={allChecked}
          />
        )}
      </CellText>
      <HeaderCell size="fixed" className={styles.syncCell}>
        <FormattedMessage id="sources.sync" />
      </HeaderCell>
      {isColumnSelectionEnabled && (
        <HeaderCell size="fixed" className={styles.fieldsCell}>
          <FormattedMessage id="form.fields" />
        </HeaderCell>
      )}
      <HeaderCell>
        <FormattedMessage id="form.namespace" />
        <InfoTooltip>
          <FormattedMessage id="connectionForm.sourceNamespace.info" />
        </InfoTooltip>
      </HeaderCell>
      <HeaderCell>
        <FormattedMessage id="form.streamName" />
        <InfoTooltip>
          <FormattedMessage id="connectionForm.sourceStreamName.info" />
        </InfoTooltip>
      </HeaderCell>
      <HeaderCell size="fixed" className={styles.syncModeCell}>
        <FormattedMessage id="form.syncMode" />
        <InfoTooltip>
          <FormattedMessage id="connectionForm.syncType.info" />
          <TooltipLearnMoreLink url={links.syncModeLink} />
        </InfoTooltip>
      </HeaderCell>
      <HeaderCell>
        <FormattedMessage id="form.cursorField" />
        <InfoTooltip>
          <FormattedMessage id="connectionForm.cursor.info" />
        </InfoTooltip>
      </HeaderCell>
      <HeaderCell>
        <FormattedMessage id="form.primaryKey" />
        <InfoTooltip>
          <FormattedMessage id="connectionForm.primaryKey.info" />
        </InfoTooltip>
      </HeaderCell>
      <CellText size="fixed" className={styles.arrowCell} />
      <HeaderCell>
        <FormattedMessage id="form.namespace" />
        <Button
          type="button"
          variant="clear"
          onClick={() =>
            openModal({
              size: "lg",
              title: <FormattedMessage id="connectionForm.modal.destinationNamespace.title" />,
              content: () => (
                <DestinationNamespaceModal
                  initialValues={{
                    namespaceDefinition: formikProps.values.namespaceDefinition,
                    namespaceFormat: formikProps.values.namespaceFormat,
                  }}
                  onCloseModal={closeModal}
                  onSubmit={destinationNamespaceChange}
                />
              ),
            })
          }
        >
          <FontAwesomeIcon icon={faGear} />
        </Button>
      </HeaderCell>
      <HeaderCell>
        <FormattedMessage id="form.streamName" />
        <Button
          type="button"
          variant="clear"
          onClick={() =>
            openModal({
              size: "sm",
              title: <FormattedMessage id="connectionForm.modal.destinationStreamNames.title" />,
              content: () => (
                <DestinationStreamNamesModal
                  initialValues={{
                    prefix: formikProps.values.prefix,
                  }}
                  onCloseModal={closeModal}
                  onSubmit={destinationStreamNamesChange}
                />
              ),
            })
          }
        >
          <FontAwesomeIcon icon={faGear} />
        </Button>
      </HeaderCell>
    </Header>
  );
};
