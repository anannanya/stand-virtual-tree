import { renderHook } from "@testing-library/react-hooks";
import useVisibleData from "./deal_data";

test("不开启虚拟化", () => {
    const data = [
        { id: "0" },
        { id: "0-0" },
        { id: "0-0-0" },
        { id: "0-0-1" },
        { id: "0-1" },
        { id: "0-1-0" },
        { id: "0-1-1" }
    ];
    const { result } = renderHook(() =>
        useVisibleData({
            scrollTop: 0,
            data,
            containerHeight: 0,
            itemHeight: 30,
            useVirtual: false
        })
    );
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(data.length - 1);
});

test("开启虚拟化", () => {
    const data = [
        { id: "0" },
        { id: "0-0" },
        { id: "0-0-0" },
        { id: "0-0-1" },
        { id: "0-1" },
        { id: "0-1-0" },
        { id: "0-1-1" }
    ];
    const { result } = renderHook(() =>
        useVisibleData({
            scrollTop: 0,
            data,
            containerHeight: 70,
            itemHeight: 30,
            useVirtual: true
        })
    );
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(2);

    const { result: result1 } = renderHook(() =>
        useVisibleData({
            scrollTop: 50,
            data,
            containerHeight: 70,
            itemHeight: 30,
            useVirtual: true
        })
    );
    expect(result1.current.startIndex).toBe(1);
    expect(result1.current.endIndex).toBe(4);
});

test("buffer", () => {
    const data = [
        { id: "0" },
        { id: "0-0" },
        { id: "0-0-0" },
        { id: "0-0-1" },
        { id: "0-1" },
        { id: "0-1-0" },
        { id: "0-1-1" }
    ];
    const buffer = 2;
    const itemHeight = 30;
    const containerHeight = 70;
    // min scrollTop
    const { result } = renderHook(() =>
        useVisibleData({
            scrollTop: 0,
            data,
            containerHeight,
            itemHeight,
            useVirtual: true,
            buffer
        })
    );
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(2 + buffer);

    const { result: result1 } = renderHook(() =>
        useVisibleData({
            scrollTop: 50,
            data,
            containerHeight,
            itemHeight,
            useVirtual: true,
            buffer
        })
    );
    expect(result1.current.startIndex).toBe(0);
    expect(result1.current.endIndex).toBe(4 + buffer);

    // max scrollTop
    const { result: result2 } = renderHook(() =>
        useVisibleData({
            scrollTop: itemHeight * data.length - containerHeight,
            data,
            containerHeight,
            itemHeight,
            useVirtual: true,
            buffer
        })
    );
    expect(result2.current.startIndex).toBe(4 - buffer);
    expect(result2.current.endIndex).toBe(data.length - 1);
});
