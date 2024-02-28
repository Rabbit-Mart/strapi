import * as React from 'react';

import {
  Box,
  Combobox,
  ComboboxOption,
  Flex,
  Icon,
  IconButton,
  Status,
  TextButton,
  Tooltip,
  Typography,
  VisuallyHidden,
} from '@strapi/design-system';
import { Link } from '@strapi/design-system/v2';
import { pxToRem, useFocusInputField, useNotification } from '@strapi/helper-plugin';
import { Cross, Drag, Refresh } from '@strapi/icons';
import { Contracts } from '@strapi/plugin-content-manager/_internal/shared';
import { useIntl } from 'react-intl';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';

import { type InputProps, useField, useForm } from '../../../../components/Form';
import { useDoc } from '../../../../hooks/useDocument';
import { useGetRelationsQuery, useLazySearchRelationsQuery } from '../../../../services/relations';
import { getTranslation } from '../../../../utils/translations';

import type { EditFieldLayout } from '../../../../hooks/useDocumentLayout';
import type { Attribute } from '@strapi/types';

/* -------------------------------------------------------------------------------------------------
 * RelationsField
 * -----------------------------------------------------------------------------------------------*/
const RELATIONS_TO_DISPLAY = 5;

interface RelationsFieldProps
  extends Omit<Extract<EditFieldLayout, { type: 'relation' }>, 'size' | 'hint'>,
    Pick<InputProps, 'hint'> {
  mainField?: string;
}

const RelationsField = React.forwardRef<HTMLDivElement, RelationsFieldProps>((props, ref) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const { id, model } = useDoc();
  const { formatMessage } = useIntl();

  const { data, isLoading, isFetching } = useGetRelationsQuery(
    {
      model,
      targetField: props.name,
      // below we don't run the query if there is no id.
      id: id!,
      pagination: {
        pageSize: RELATIONS_TO_DISPLAY,
        page: currentPage,
      },
    },
    {
      skip: !id,
    }
  );

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const field = useField(props.name);

  const isFetchingMoreRelations = isLoading || isFetching;

  console.log(data, field.value);

  return (
    <Flex
      ref={ref}
      direction="column"
      gap={3}
      justifyContent="space-between"
      alignItems="stretch"
      wrap="wrap"
    >
      <Flex direction="column" alignItems="start" gap={2} width="100%">
        <RelationsInput id={id} model={model} {...props} />
        {data ? (
          <TextButton
            disabled={isFetchingMoreRelations}
            onClick={handleLoadMore}
            loading={isFetchingMoreRelations}
            startIcon={<Refresh />}
            // prevent the label from line-wrapping
            shrink={0}
          >
            {formatMessage({
              id: getTranslation('relation.loadMore'),
              defaultMessage: 'Load More',
            })}
          </TextButton>
        ) : null}
      </Flex>
      {/* <RelationsList
        data={[
          { id: '12345', label: 'cat-1', publishedAt: null },
          { id: '67890', label: 'cat-2', publishedAt: new Date().toISOString() },
        ]}
        disabled={props.disabled}
        name={props.name}
        isLoading={isFetchingMoreRelations}
        relationType={props.attribute.relation}
      /> */}
    </Flex>
  );
});

/* -------------------------------------------------------------------------------------------------
 * RelationsInput
 * -----------------------------------------------------------------------------------------------*/

interface RelationsInputProps extends Omit<RelationsFieldProps, 'type'> {
  id?: string;
  model: string;
}

const RelationsInput = ({
  disabled,
  hint,
  id,
  label,
  model,
  name,
  mainField,
  placeholder,
  required,
}: RelationsInputProps) => {
  const [textValue, setTextValue] = React.useState<string | undefined>('');
  const [searchParams, setSearchParams] = React.useState({
    _q: '',
    page: 1,
  });
  const toggleNotification = useNotification();

  const { formatMessage } = useIntl();
  const fieldRef = useFocusInputField(name);
  const field = useField(name);
  const addFieldRow = useForm('RelationInput', (state) => state.addFieldRow);

  const [searchForTrigger, { data, isLoading }] = useLazySearchRelationsQuery();

  React.useEffect(() => {
    searchForTrigger({
      model,
      targetField: name,
      params: {
        id: id ?? '',
        pageSize: 10,
        ...searchParams,
      },
    });
  }, [id, model, name, searchForTrigger, searchParams]);

  const handleSearch = async (search: string) => {
    setSearchParams((s) => ({ ...s, _q: search, page: 1 }));
  };

  const hasNextPage = data?.pagination ? data.pagination.page < data.pagination.pageCount : false;

  const options = data?.results ?? [];

  const handleChange = (relationId?: string) => {
    if (!relationId) {
      return;
    }

    const relation = options.find((opt) => opt.id === relationId);

    if (!relation) {
      // This is very unlikely to happen, but it ensures we don't have any data for.
      console.error(
        "You've tried to add a relation with an id that does not exist in the options you can see, this is likely a bug with Strapi. Please open an issue."
      );

      toggleNotification({
        message: formatMessage({
          id: getTranslation('relation.error-adding-relation'),
          defaultMessage: 'An error occurred while trying to add the relation.',
        }),
        type: 'warning',
      });

      return;
    }

    addFieldRow(`${name}.connect`, { id: relation.id });
  };

  const handleLoadMore = () => {
    if (!data || !data.pagination) {
      return;
    } else if (data.pagination.page < data.pagination.pageCount) {
      setSearchParams((s) => ({ ...s, page: s.page + 1 }));
    }
  };

  return (
    <Combobox
      ref={fieldRef}
      autocomplete="none"
      error={field.error}
      name={name}
      hint={hint}
      required={required}
      label={label}
      disabled={disabled}
      placeholder={
        placeholder ||
        formatMessage({
          id: getTranslation('relation.add'),
          defaultMessage: 'Add relation',
        })
      }
      hasMoreItems={hasNextPage}
      loading={isLoading}
      onOpenChange={() => {
        handleSearch(textValue ?? '');
      }}
      noOptionsMessage={() =>
        formatMessage({
          id: getTranslation('relation.notAvailable'),
          defaultMessage: 'No relations available',
        })
      }
      loadingMessage={formatMessage({
        id: getTranslation('relation.isLoading'),
        defaultMessage: 'Relations are loading',
      })}
      onLoadMore={handleLoadMore}
      textValue={textValue}
      onChange={handleChange}
      onTextValueChange={(text) => {
        setTextValue(text);
      }}
      onInputChange={(event) => {
        handleSearch(event.currentTarget.value);
      }}
    >
      {options.map((opt) => {
        return (
          <Option
            key={opt.id}
            textValue={mainField ? opt[mainField] : opt.id.toString()}
            {...opt}
          />
        );
      })}
    </Combobox>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Option
 * -----------------------------------------------------------------------------------------------*/

interface OptionProps extends Contracts.Relations.RelationResult {
  textValue: string;
}

const Option = (props: OptionProps) => {
  const { formatMessage } = useIntl();

  const status = props.publishedAt ? 'published' : 'draft';

  const statusVariant =
    status === 'draft' ? 'primary' : status === 'published' ? 'success' : 'alternative';

  return (
    <ComboboxOption value={props.id.toString()} textValue={props.textValue}>
      <Flex gap={2} justifyContent="space-between">
        <Typography ellipsis>{props.textValue}</Typography>
        <Status showBullet={false} size={'S'} variant={statusVariant}>
          <Typography as="span" variant="omega" fontWeight="bold">
            {status === 'draft'
              ? formatMessage({
                  id: getTranslation('components.Select.draft-info-title'),
                  defaultMessage: 'Draft',
                })
              : formatMessage({
                  id: getTranslation('components.Select.publish-info-title'),
                  defaultMessage: 'Published',
                })}
          </Typography>
        </Status>
      </Flex>
    </ComboboxOption>
  );
};

/* -------------------------------------------------------------------------------------------------
 * RelationsList
 * -----------------------------------------------------------------------------------------------*/
const RELATION_ITEM_HEIGHT = 50;
const RELATION_GUTTER = 4;

interface RelationsListProps extends Pick<RelationsFieldProps, 'disabled' | 'name'> {
  data: Array<Pick<Contracts.Relations.RelationResult, 'id' | 'publishedAt'> & { label: string }>;
  isLoading?: boolean;
  relationType: Attribute.Relation['relation'];
}

const RelationsList = ({ data, disabled, name, isLoading, relationType }: RelationsListProps) => {
  const ariaDescriptionId = React.useId();
  const { formatMessage } = useIntl();
  const listRef = React.useRef<FixedSizeList>(null);
  const outerListRef = React.useRef<HTMLUListElement>(null);
  const [overflow, setOverflow] = React.useState<'top' | 'bottom' | 'top-bottom'>();
  const [liveText, setLiveText] = React.useState('');

  React.useEffect(() => {
    if (data.length <= RELATIONS_TO_DISPLAY) {
      return setOverflow(undefined);
    }

    const handleNativeScroll = (e: Event) => {
      const el = e.target as HTMLUListElement;
      const parentScrollContainerHeight = (el.parentNode as HTMLDivElement).scrollHeight;
      const maxScrollBottom = el.scrollHeight - el.scrollTop;

      if (el.scrollTop === 0) {
        return setOverflow('bottom');
      }

      if (maxScrollBottom === parentScrollContainerHeight) {
        return setOverflow('top');
      }

      return setOverflow('top-bottom');
    };

    const outerListRefCurrent = outerListRef?.current;

    if (!isLoading && data.length > 0 && outerListRefCurrent) {
      outerListRef.current.addEventListener('scroll', handleNativeScroll);
    }

    return () => {
      if (outerListRefCurrent) {
        outerListRefCurrent.removeEventListener('scroll', handleNativeScroll);
      }
    };
  }, [isLoading, data.length]);

  const getItemPos = (index: number) => `${index + 1} of ${data.length}`;

  const handleRelationReorder = (oldIndex: number, newIndex: number) => {
    const item = data[oldIndex];

    setLiveText(
      formatMessage(
        {
          id: getTranslation('dnd.reorder'),
          defaultMessage: '{item}, moved. New position in list: {position}.',
        },
        {
          item: item.mainField ?? item.id,
          position: getItemPos(newIndex),
        }
      )
    );
  };

  const handleGrabItem = (index: number) => {
    const item = data[index];

    setLiveText(
      formatMessage(
        {
          id: getTranslation('dnd.grab-item'),
          defaultMessage: `{item}, grabbed. Current position in list: {position}. Press up and down arrow to change position, Spacebar to drop, Escape to cancel.`,
        },
        {
          item: item.mainField ?? item.id,
          position: getItemPos(index),
        }
      )
    );
  };

  const handleDropItem = (index: number) => {
    const item = data[index];

    setLiveText(
      formatMessage(
        {
          id: getTranslation('dnd.drop-item'),
          defaultMessage: `{item}, dropped. Final position in list: {position}.`,
        },
        {
          item: item.mainField ?? item.id,
          position: getItemPos(index),
        }
      )
    );
  };

  const handleCancel = (index: number) => {
    const item = data[index];

    setLiveText(
      formatMessage(
        {
          id: getTranslation('dnd.cancel-item'),
          defaultMessage: '{item}, dropped. Re-order cancelled.',
        },
        {
          item: item.mainField ?? item.id,
        }
      )
    );
  };

  /**
   * These relation types will only ever have one item
   * in their list, so you can't reorder a single item!
   */
  const canReorder = ![
    'oneWay',
    'oneToOne',
    'manyToOne',
    'oneToManyMorph',
    'oneToOneMorph',
  ].includes(relationType);

  const dynamicListHeight =
    data.length > RELATIONS_TO_DISPLAY
      ? Math.min(data.length, RELATIONS_TO_DISPLAY) * (RELATION_ITEM_HEIGHT + RELATION_GUTTER) +
        RELATION_ITEM_HEIGHT / 2
      : Math.min(data.length, RELATIONS_TO_DISPLAY) * (RELATION_ITEM_HEIGHT + RELATION_GUTTER);

  return (
    <ShadowBox overflowDirection={overflow}>
      <VisuallyHidden id={ariaDescriptionId}>
        {formatMessage({
          id: getTranslation('dnd.instructions'),
          defaultMessage: `Press spacebar to grab and re-order`,
        })}
      </VisuallyHidden>
      <VisuallyHidden aria-live="assertive">{liveText}</VisuallyHidden>
      {/* @ts-expect-error – width is expected, but we've not needed to pass it before. */}
      <FixedSizeList
        height={dynamicListHeight}
        ref={listRef}
        outerRef={outerListRef}
        itemCount={data.length}
        itemSize={RELATION_ITEM_HEIGHT + RELATION_GUTTER}
        itemData={{
          data,
          ariaDescribedBy: ariaDescriptionId,
          name,
          canDrag: canReorder,
          disabled,
          handleCancel,
          handleDropItem,
          handleGrabItem,
          onRelationDisconnect: () => console.log('remove me pls'),
          handleRelationReorder,
        }}
        itemKey={(index) => data[index].id}
        innerElementType="ol"
      >
        {ListItem}
      </FixedSizeList>
    </ShadowBox>
  );
};

const ShadowBox = styled(Box)<{ overflowDirection?: 'top-bottom' | 'top' | 'bottom' }>`
  position: relative;
  overflow: hidden;
  flex: 1;

  &:before,
  &:after {
    position: absolute;
    width: 100%;
    height: 4px;
    z-index: 1;
  }

  &:before {
    /* TODO: as for DS Table component we would need this to be handled by the DS theme */
    content: '';
    background: linear-gradient(rgba(3, 3, 5, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
    top: 0;
    opacity: ${({ overflowDirection }) =>
      overflowDirection === 'top-bottom' || overflowDirection === 'top' ? 1 : 0};
    transition: opacity 0.2s ease-in-out;
  }

  &:after {
    /* TODO: as for DS Table component we would need this to be handled by the DS theme */
    content: '';
    background: linear-gradient(0deg, rgba(3, 3, 5, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
    bottom: 0;
    opacity: ${({ overflowDirection }) =>
      overflowDirection === 'top-bottom' || overflowDirection === 'bottom' ? 1 : 0};
    transition: opacity 0.2s ease-in-out;
  }
`;

/* -------------------------------------------------------------------------------------------------
 * ListItem
 * -----------------------------------------------------------------------------------------------*/

const ListItem = ({ data, index, style }: ListItemProps) => {
  const {
    ariaDescribedBy,
    canDrag,
    disabled,
    handleCancel,
    handleDropItem,
    handleGrabItem,
    iconButtonAriaLabel,
    name,
    labelDisconnectRelation,
    onRelationDisconnect,
    publicationStateTranslations,
    relations,
    updatePositionOfRelation,
  } = data;
  const { publicationState, href, mainField, id } = relations[index];
  const statusColor = publicationState === 'draft' ? 'secondary' : 'success';

  return (
    <Box
      style={style}
      as="li"
      ref={dropRef}
      aria-describedby={ariaDescribedBy}
      cursor={canDrag ? 'all-scroll' : 'default'}
    >
      {isDragging ? (
        <RelationItemPlaceholder />
      ) : (
        <Flex
          paddingTop={2}
          paddingBottom={2}
          paddingLeft={canDrag ? 2 : 4}
          paddingRight={4}
          hasRadius
          borderColor="neutral200"
          background={disabled ? 'neutral150' : 'neutral0'}
          justifyContent="space-between"
          ref={canDrag ? composedRefs : undefined}
          data-handler-id={handlerId}
          {...props}
        >
          <FlexWrapper gap={1}>
            {canDrag ? (
              <IconButton
                forwardedAs="div"
                role="button"
                tabIndex={0}
                aria-label={iconButtonAriaLabel}
                borderWidth={0}
                onKeyDown={handleKeyDown}
                disabled={disabled}
              >
                <Drag />
              </IconButton>
            ) : null}
            <ChildrenWrapper justifyContent="space-between">
              <Box minWidth={0} paddingTop={1} paddingBottom={1} paddingRight={4}>
                <Tooltip description={mainField ?? `${id}`}>
                  {href ? (
                    <LinkEllipsis to={href}>{mainField ?? id}</LinkEllipsis>
                  ) : (
                    <Typography textColor={disabled ? 'neutral600' : 'primary600'} ellipsis>
                      {mainField ?? id}
                    </Typography>
                  )}
                </Tooltip>
              </Box>
              {publicationState && (
                <Status variant={statusColor} showBullet={false} size="S">
                  <Typography fontWeight="bold" textColor={`${statusColor}700`}>
                    {publicationStateTranslations[publicationState]}
                  </Typography>
                </Status>
              )}
            </ChildrenWrapper>
          </FlexWrapper>
          <Box paddingLeft={4}>
            <DisconnectButton
              data-testid={`remove-relation-${id}`}
              disabled={disabled}
              type="button"
              onClick={() => onRelationDisconnect(relations[index])}
              aria-label={labelDisconnectRelation}
            >
              <Icon width="12px" as={Cross} />
            </DisconnectButton>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

const DisconnectButton = styled.button`
  svg path {
    fill: ${({ theme, disabled }) =>
      disabled ? theme.colors.neutral600 : theme.colors.neutral500};
  }

  &:hover svg path,
  &:focus svg path {
    fill: ${({ theme, disabled }) => !disabled && theme.colors.neutral600};
  }
`;

const LinkEllipsis = styled(Link)`
  display: block;

  & > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
`;

const RelationItemPlaceholder = () => (
  <Box
    paddingTop={2}
    paddingBottom={2}
    paddingLeft={4}
    paddingRight={4}
    hasRadius
    borderStyle="dashed"
    borderColor="primary600"
    borderWidth="1px"
    background="primary100"
    height={`calc(100% - ${RELATION_GUTTER}px)`}
  />
);

export { RelationsField as RelationsInput };
