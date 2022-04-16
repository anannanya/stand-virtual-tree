import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import List from "./List";

test("空数据渲染", () => {
    const renderIetm = (item) => <div>123</div>;
    const containerHeight = 70;
    const itemHeight = 30;
    const emptyData = [];
    render(
        <List
            data={emptyData}
            renderItem={renderIetm}
            containerHeight={containerHeight}
            itemHeight={itemHeight}
        />
    );

    const items = screen.queryAllByText("123");
    expect(items).toHaveLength(0);
});

test("固定高度虚拟渲染", () => {
    const renderIetm = (item) => <div>123</div>;
    const containerHeight = 70;
    const itemHeight = 30;
    const data = [
        { id: "0" },
        { id: "0-0" },
        { id: "0-0-0" },
        { id: "0-0-1" },
        { id: "0-1" },
        { id: "0-1-0" },
        { id: "0-1-1" }
    ];
    render(
        <List
            data={data}
            renderItem={renderIetm}
            containerHeight={containerHeight}
            itemHeight={itemHeight}
        />
    );

    const items = screen.queryAllByText("123");
    expect(items).toHaveLength(Math.ceil(containerHeight / itemHeight));
});

test("非固定高度虚拟渲染", () => {
    const renderIetm = (item) => (
        <div data-testid="list-item" data-id={item.id}>
            {item.id}
        </div>
    );
    const containerHeight = 70;
    const itemHeight = (item) => {
        return idHeightMap[item.id];
    };
    /**
     * 0         10
     *  0-0      20
     *    0-0-0  0
     *    0-0-1  30
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
        0: 10,
        "0-0": 20,
        "0-0-0": 0,
        "0-0-1": 30,
        "0-1": 30,
        "0-1-0": 30,
        "0-1-1": 100
    };
    render(
        <List
            data={data}
            renderItem={renderIetm}
            containerHeight={containerHeight}
            itemHeight={itemHeight}
        />
    );

    const items = screen.queryAllByTestId("list-item");
    expect(items).toHaveLength(5);
    expect(items[0].getAttribute("data-id")).toBe("0");
    expect(items[4].getAttribute("data-id")).toBe("0-1");
});
