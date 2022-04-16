import {
    dealCritical,
    getFullListHeight,
    getItemOffsetBottom,
    getItemOffsetTop
} from "./common";

/**
 *
 * @param scrollTop
 * @param maxScrollTop
 */
test("dealCritical 正确处理边界", () => {
    expect(dealCritical(100, 200)).toBe(100);
    expect(dealCritical(300, 200)).toBe(200);
    expect(dealCritical(0, 200)).toBe(0);
    expect(dealCritical(-20, 90)).toBe(0);
});

/**
 *
 * @param data
 * @param itemHeight: number | ((item: T) => number)
 */
test("getFullListHeight 计算正确", () => {
    const data = [];
    const itemHeight = 30;
    expect(getFullListHeight(data, itemHeight)).toBe(0);

    const data1 = [
        { id: "0" },
        { id: "0-0" },
        { id: "0-0-0" },
        { id: "0-0-1" },
        { id: "0-1" },
        { id: "0-1-0" },
        { id: "0-1-1" }
    ];
    const itemHeight1 = 30;
    expect(getFullListHeight(data1, itemHeight1)).toBe(
        data1.length * itemHeight1
    );

    /**
     * 0         30
     *  0-0      40
     *    0-0-0  50
     *    0-0-1  0
     *  0-1      30
     *    0-1-0  30
     *    0-1-1  100
     */
    const data2 = [
        { id: "0" },
        { id: "0-0" },
        { id: "0-0-0" },
        { id: "0-0-1" },
        { id: "0-1" },
        { id: "0-1-0" },
        { id: "0-1-1" }
    ];
    const idHeightMap = {
        0: 30,
        "0-0": 40,
        "0-0-0": 50,
        "0-0-1": 0,
        "0-1": 30,
        "0-1-0": 30,
        "0-1-1": 100
    };
    const itemHeight2 = (item) => {
        return idHeightMap[item.id];
    };
    expect(getFullListHeight(data2, itemHeight2)).toBe(
        Object.values(idHeightMap).reduce((pre, cur) => pre + cur, 0)
    );
});

/**
 *
 * @param i
 * @param data
 * @param itemHeight: number | ((item: T) => number)
 */
test("getItemOffsetTop 计算正确", () => {
    /**
     * 0         30
     *  0-0      40
     *    0-0-0  50
     *    0-0-1  0
     *  0-1      30
     *    0-1-0  30
     *    0-1-1  100
     */
    const data = [
        { id: "0" },
        { id: "0-0" },
        { id: "0-0-0" },
        { id: "0-0-1" },
        { id: "0-1" },
        { id: "0-1-0" },
        { id: "0-1-1" }
    ];
    const idHeightMap = {
        0: 30,
        "0-0": 40,
        "0-0-0": 50,
        "0-0-1": 0,
        "0-1": 30,
        "0-1-0": 30,
        "0-1-1": 100
    };
    const itemHeight = (item) => {
        return idHeightMap[item.id];
    };
    expect(getItemOffsetTop(0, data, itemHeight)).toBe(0);
    expect(getItemOffsetTop(3, data, itemHeight)).toBe(
        idHeightMap["0"] + idHeightMap["0-0"] + idHeightMap["0-0-0"]
    );
    const totalHeight = Object.values(idHeightMap).reduce(
        (pre, cur) => pre + cur,
        0
    );
    expect(getItemOffsetTop(6, data, itemHeight)).toBe(
        totalHeight - idHeightMap["0-1-1"]
    );
});

/**
 *
 * @param i
 * @param data
 * @param itemHeight: number | ((item: T) => number)
 */
test("getItemOffsetBottom 计算正确", () => {
    /**
     * 0         30
     *  0-0      40
     *    0-0-0  50
     *    0-0-1  0
     *  0-1      30
     *    0-1-0  30
     *    0-1-1  100
     */
    const data = [
        { id: "0" },
        { id: "0-0" },
        { id: "0-0-0" },
        { id: "0-0-1" },
        { id: "0-1" },
        { id: "0-1-0" },
        { id: "0-1-1" }
    ];
    const idHeightMap = {
        0: 30,
        "0-0": 40,
        "0-0-0": 50,
        "0-0-1": 0,
        "0-1": 30,
        "0-1-0": 30,
        "0-1-1": 100
    };
    const itemHeight = (item) => {
        return idHeightMap[item.id];
    };
    expect(getItemOffsetBottom(0, data, itemHeight)).toBe(idHeightMap["0"]);
    expect(getItemOffsetBottom(2, data, itemHeight)).toBe(
        idHeightMap["0"] + idHeightMap["0-0"] + idHeightMap["0-0-0"]
    );
    const totalHeight = Object.values(idHeightMap).reduce(
        (pre, cur) => pre + cur,
        0
    );
    expect(getItemOffsetBottom(6, data, itemHeight)).toBe(totalHeight);
});
