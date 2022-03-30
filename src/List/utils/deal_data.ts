import { useMemo, useRef } from "react";
import { IBaseListItem } from "../type";

interface IUseVisibleDataProps<T> {
    scrollTop: number;
    data: T[];
    containerHeight: number;
    itemHeight: number | ((node: T, index: number) => number);
    useVirtual?: boolean;
    overscan?: number;
}

function useVisibleData<T>(props: IUseVisibleDataProps<T>) {
    const {
        scrollTop,
        data,
        containerHeight,
        itemHeight,
        useVirtual = true,
        overscan = 0
    } = props;
    const { startIndex, endIndex } = useMemo(() => {
        let startIndex = -1;
        let endIndex = -1;

        if (!useVirtual) {
            return {
                startIndex: 0,
                endIndex: data.length - 1
            };
        }

        // itemHeight 是固定数字，简单通过索引和固定高度即可计算得到数据
        if (typeof itemHeight === "number") {
            startIndex = Math.floor(scrollTop / itemHeight);
            endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
        } else {
            // itemHeight 是函数，需要遍历数据，拿到 item 高度进行计算
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                const itemOffsetBottom = sum + itemHeight(data[i], i);

                // console.log("dealdata", i, scrollTop, itemHeight(data[i], i))

                if (itemOffsetBottom > scrollTop && startIndex === -1) {
                    startIndex = i;
                    // console.log('startindex', i)
                }

                if (itemOffsetBottom > scrollTop + containerHeight && endIndex === -1) {
                    endIndex = i;
                    break;
                }

                sum = itemOffsetBottom;
            }
        }

        startIndex = startIndex === -1 ? 0 : Math.max(0, startIndex - overscan);
        endIndex =
            endIndex === -1
                ? data.length - 1
                : Math.min(data.length - 1, endIndex + overscan);
        return {
            startIndex,
            endIndex
        };
    }, [scrollTop, data, containerHeight, itemHeight, useVirtual, overscan]);

    // console.log(888, startIndex, endIndex)
    return {
        startIndex,
        endIndex
    };
}

export default useVisibleData;
