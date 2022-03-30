import { usePersistFn } from "ahooks";
import React, { useCallback, memo, useMemo } from "react";
import { IBaseListItem } from "./type";

interface ItemProps<IListItemData> {
    renderItem: (data: IListItemData) => React.ReactElement;
    listItem: IListItemData;
    heightMap: React.MutableRefObject<{ [key: string]: number }>;
    update: React.Dispatch<React.SetStateAction<number>>;
    isLastItem: boolean;
    onItemClick?: (item: IListItemData) => void;
    getItemStyle?: (item: IListItemData) => React.CSSProperties;
}

const nil = {};

export default memo(function ListItem<IListItemData extends IBaseListItem>(
    props: ItemProps<IListItemData>
) {
    const {
        renderItem,
        listItem,
        heightMap,
        isLastItem,
        update,
        getItemStyle,
        onItemClick
    } = props;


    const style = useMemo(() => (getItemStyle ? getItemStyle(listItem) : nil), [
        listItem,
        getItemStyle
    ]);

    const listDidMMount = useCallback((element: HTMLDivElement | null) => {
        if (element) {
            heightMap.current[listItem.id] = element.offsetHeight;
            // console.log(heightMap)
        }
        if (isLastItem) {
        }
        if (isLastItem && element) {
            // console.log(98653, element)
            update((id) => id + 1);
        }
    }, []);

    const onClick = usePersistFn(() => {
        if (onItemClick) {
            onItemClick(listItem);
        }
    });

    return (
        <div style={style} ref={listDidMMount} onClick={onClick}>
            {renderItem(listItem)}
        </div>
    );
}) as <IListItemData>(props: ItemProps<IListItemData>) => React.ReactElement;
