import { useRouteLoaderData } from "react-router-dom";
import { GAMES_ROUTE_ID } from "../../App";
import { ListChildComponentProps, VariableSizeList } from "react-window";
import {
  Autocomplete,
  ListSubheader,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { Card } from "../../helpers";
import { NAME_WIDTH_PCT } from "./SinglePlayerDeckCards";

export default function CardNamesAutocomplete({
  card,
  handleChange,
}: {
  card: Card;
  handleChange: (value: string | null) => void;
}) {
  const cardNames = useRouteLoaderData(GAMES_ROUTE_ID) as string[];

  const LISTBOX_PADDING = 8; // px

  function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    };

    if (Object.prototype.hasOwnProperty.call(dataSet, "group")) {
      return (
        <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
          {dataSet.group}
        </ListSubheader>
      );
    }

    return (
      <Typography component="span" {...dataSet[0]} noWrap style={inlineStyle}>
        {dataSet}
      </Typography>
    );
  }

  const OuterElementContext = React.createContext({});

  const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function useResetCache(data: any) {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
      if (ref.current != null) {
        ref.current.resetAfterIndex(0, true);
      }
    }, [data]);
    return ref;
  }
  const ListboxComponent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLElement>
  >(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData: React.ReactElement[] = [];
    (children as React.ReactElement[]).forEach(
      (item: React.ReactElement & { children?: React.ReactElement[] }) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
      }
    );

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
      noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child: React.ReactElement) => {
      if (Object.prototype.hasOwnProperty.call(child, "group")) {
        return 48;
      }

      return itemSize;
    };

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  });

  return (
    <Autocomplete
      value={card.name}
      sx={{ width: `${NAME_WIDTH_PCT}%` }}
      renderInput={(params) => <TextField {...params} />}
      options={cardNames}
      ListboxComponent={ListboxComponent}
      onChange={(_, value) => handleChange(value)}
    />
  );
}
