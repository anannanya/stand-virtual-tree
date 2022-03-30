import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePersistFn } from "ahooks";

import "./index.css";
import dealData from "./utils/deal_data";
import ListItem from "./ListItem";
import { IBaseListItem } from "./type";
import { getFullListHeight, getItemOffsetTop, dealCritical } from "./utils/common";

export interface ListController<IListItemData> {
    scrollTo: (item: IListItemData) => void;
}

export interface IListProps<IListItemData> {
    data: IListItemData[];
    renderItem: (data: IListItemData) => React.ReactElement;
    containerHeight: number;
    itemHeight: ((item: IListItemData) => number) | number;
    shouldCollectHeight?: boolean;
    className?: string;

    // callback
    onItemClick?: (item: IListItemData) => void;
    // getter
    getItemStyle?: (item: IListItemData) => React.CSSProperties;
    getController?: (controller: ListController<IListItemData>) => void;
}

export default function List<IListItemData extends IBaseListItem>(
    props: IListProps<IListItemData>
) {
    const {
        data,
        renderItem,
        containerHeight,
        itemHeight,
        getItemStyle,
        shouldCollectHeight,
        getController,
        onItemClick
    } = props;
    const boxContain = useRef<HTMLUListElement | null>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [updateId, setUpdateId] = useState(0);
    const heightMap = useRef<{ [key: string]: number }>({});

    const getItemHeight = useCallback((item: IListItemData) => {
        let actualItemheight;
        if (shouldCollectHeight) {
            actualItemheight = heightMap.current[item.id];
        }
        if (!actualItemheight) {
            actualItemheight =
                typeof itemHeight === "function" ? itemHeight(item) : itemHeight;
        }
        // console.log(333, actualItemheight)
        return actualItemheight;
    }, [shouldCollectHeight, updateId]);

    const { startIndex, endIndex } = dealData({
        data,
        scrollTop,
        itemHeight: getItemHeight,
        containerHeight
    });

    const fullListHeight = getFullListHeight(data, getItemHeight);

    const offsetHeight = useMemo(
        () => getItemOffsetTop(startIndex, data, getItemHeight),
        [startIndex, data, getItemHeight]
    );

    const maxScrollTop = fullListHeight - containerHeight;

    const visibleData = useMemo(() => data.slice(startIndex, endIndex + 1), [
        data,
        startIndex,
        endIndex
    ]);

    const onScroll = usePersistFn(() => {
        if (!boxContain.current) return;
        const newScrollTop = Math.ceil(boxContain.current.scrollTop);
        // console.log('gundong', newScrollTop, scrollTop)
        if (newScrollTop !== scrollTop) setScrollTop(boxContain.current.scrollTop);
    });

    const scrollTo = usePersistFn((item: IListItemData | string) => {
        if (typeof item === 'object') {
            const targetIndex = data.findIndex(({ id }) => item.id === id);
            // console.log(23344, targetIndex)
            if (targetIndex > -1 && boxContain.current) {
                let targetScrollTop = getItemOffsetTop(targetIndex, data, getItemHeight);
                targetScrollTop = dealCritical(targetScrollTop, maxScrollTop);
                console.log(23344, targetScrollTop)
                setScrollTop(targetScrollTop);
                boxContain.current.scrollTop = targetScrollTop;
            }
        } else {
            let targetScrollTop = Number(item);
            targetScrollTop = dealCritical(targetScrollTop, maxScrollTop)
            setScrollTop(targetScrollTop);
            if (boxContain.current) {
                boxContain.current.scrollTop = targetScrollTop;
            }
        }

    });

    useEffect(() => {
        if (getController) {
            getController({
                scrollTo
            });
        }
    }, [getController]);

    const fillerStyle = useMemo(
        () => ({
            height: fullListHeight - offsetHeight,
            marginTop: offsetHeight,
            width: "100%"
        }),
        [fullListHeight, offsetHeight]
    );

    const containerStyle = useMemo(
        () => ({
            height: containerHeight
        }),
        [containerHeight]
    );

    const { className } = props;
    return (
        <ul
            ref={boxContain}
            onScroll={onScroll}
            style={containerStyle}
            className={className}
        >
            <div className="phantom" style={fillerStyle}>
                <div>
                    {visibleData.map((listItem, index) => {
                        return (
                            <ListItem<IListItemData>
                                renderItem={renderItem}
                                listItem={listItem}
                                heightMap={heightMap}
                                getItemStyle={getItemStyle}
                                update={setUpdateId}
                                key={listItem.id}
                                isLastItem={index === visibleData.length - 1}
                                onItemClick={onItemClick}
                            />
                        );
                    })}
                </div>
            </div>
        </ul>
    );
}
