import { useMemo, useState, useCallback, useRef } from "react";
import { Input, Switch, Button, message } from 'antd';
import { sentence, paragraph } from 'txtgen/dist/txtgen.esm'
import 'antd/dist/antd.css'

import List from "../List";
import { ListController } from '../List/List'

import "./list.css";
import { ComponentStory, ComponentMeta } from '@storybook/react';

const staticHeightitemStyle = {
    boxSizing: 'border-box',
    height: 50,
    borderBottom: '1px solid rgb(240, 240, 240)',
} as React.CSSProperties;

const dynamicHeightItemStyle = {
    boxSizing: 'border-box',
    borderBottom: '1px solid rgb(240, 240, 240)',
    padding: '12px 22px',
} as React.CSSProperties;

const differentHeightItemStyle = {
    boxSizing: 'border-box',
    borderBottom: '1px solid rgb(240, 240, 240)',
} as React.CSSProperties;
// import { ListBaseDemo } from './ListBaseDemo';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example/List',
    component: List,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof List>;

interface IDataItem {
    id: string,
    title: string
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof List> = (args) => {
    const [dataNum, setDataNum] = useState('10000')
    const [inputValue, setInputValue] = useState('10000');
    const listController = useRef<ListController<IDataItem>>()
    const inputStyle = { width: 300, marginRight: 8 }


    function createData(nums: number) {
        const actualDataNum = nums || 10000;
        const data = new Array(actualDataNum).fill("").map((item, index) => {
            return {
                id: `${index}`,
                title: `${index}:  ${sentence()}`
            }
        })
        return data
    }

    const data = useMemo(() => {
        return createData(Number(dataNum));
    }, [dataNum]);

    const getListItemHeight = useCallback(item => {
        return 50;
    }, [])

    const getListItemStyle = useCallback(() => {
        return staticHeightitemStyle
    }, [])

    const randerItem = useCallback((listItem) => {
        return (
            <div className="demo-list-item" style={getListItemStyle()}>
                {`${listItem.title}`}
            </div>
        )
    }, [getListItemStyle])

    const onInputValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }, [])

    const onConfirm = useCallback(() => {
        setDataNum(inputValue)
    }, [inputValue])

    const getController = (props: ListController<IDataItem>) => {
        listController.current = props
    }

    return (
        <>
            <h2 className="story-h2">基础用法</h2>
            <Input placeholder='请输入数据条数, 回车或点击按钮确认' value={inputValue} onChange={onInputValueChange} onPressEnter={onConfirm} style={inputStyle} />
            <Button onClick={onConfirm}>确认</Button>
            <div className="list-container">
                <List
                    data={data}
                    renderItem={randerItem}
                    containerHeight={500}
                    itemHeight={getListItemHeight}
                    getController={getController}
                />
            </div>
        </>
    )
};
export const Basic = Template.bind({});
Basic.parameters = {
    docs: {
        source: {
            code: `
const [dataNum, setDataNum] = useState('10000')
const [inputValue, setInputValue] = useState('10000');
const listController = useRef<ListController<IDataItem>>()
const inputStyle = { width: 300, marginRight: 8 }


function createData(nums: number) {
    const actualDataNum = nums || 10000;
    const data = new Array(actualDataNum).fill("").map((item, index) => {
        return {
            id: ${'${index}'},
            title: ${'${index}:  ${sentence()}'}
        }
    })
    return data
}

const data = useMemo(() => {
    return createData(Number(dataNum));
}, [dataNum]);

const getListItemHeight = useCallback(item => {
    return 50;
}, [])

const getListItemStyle = useCallback(() => {
    return { height: getListItemHeight() };
}, [])

const randerItem = useCallback((listItem) => {
    return (
        <div style={getListItemStyle()}>
            {listItem.title}
        </div>
    )
}, [getListItemStyle])

const onInputValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
}, [])

const onConfirm = useCallback(() => {
    setDataNum(inputValue)
}, [inputValue])

const getController = (props: ListController<IDataItem>) => {
    listController.current = props
}

return (
    <List
        data={data}
        renderItem={randerItem}
        containerHeight={500}
        itemHeight={getListItemHeight}
        getController={getController}
    />
)
            `,
            language: 'typescript'
        }
    }
}

const TemplateForDifferentItemHeight: ComponentStory<typeof List> = (args) => {
    const [dataNum, setDataNum] = useState('10000')
    const [inputValue, setInputValue] = useState('10000');
    const listController = useRef<ListController<IDataItem>>()
    const inputStyle = { width: 300, marginRight: 8 }


    function createData(nums: number) {
        const actualDataNum = nums || 10000;
        const data = new Array(actualDataNum).fill("").map((item, index) => {
            return {
                id: `${index}`,
                title: `${index}:  ${sentence()}`
            }
        })
        return data
    }

    const data = useMemo(() => {
        return createData(Number(dataNum));
    }, [dataNum]);

    const getListItemHeight = useCallback(item => {
        return Number(item.id) % 2 === 0 ? 50 : 100
    }, [])

    const getListItemStyle = useCallback((item) => {
        return {
            ...differentHeightItemStyle,
            height: getListItemHeight(item),
        }
    }, [])

    const randerItem = useCallback((listItem) => {
        return (
            <div className="demo-list-item" style={getListItemStyle(listItem)}>
                {`${listItem.title}`}
            </div>
        )
    }, [getListItemStyle])

    const onInputValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }, [])

    const onConfirm = useCallback(() => {
        setDataNum(inputValue)
    }, [inputValue])

    const getController = (props: ListController<IDataItem>) => {
        listController.current = props
    }

    return (
        <>
            <h2 className="story-h2">数据项高度不一致</h2>
            <Input placeholder='请输入数据条数, 回车或点击按钮确认' value={inputValue} onChange={onInputValueChange} onPressEnter={onConfirm} style={inputStyle} />
            <Button onClick={onConfirm}>确认</Button>
            <div className="list-container">
                <List
                    data={data}
                    renderItem={randerItem}
                    containerHeight={500}
                    itemHeight={getListItemHeight}
                    getController={getController}
                />
            </div>
        </>
    )
};
export const DifferentItemHeight = TemplateForDifferentItemHeight.bind({});

DifferentItemHeight.parameters = {
    docs: {
        source: {
            code: `
const [dataNum, setDataNum] = useState('10000')
const [inputValue, setInputValue] = useState('10000');
const listController = useRef<ListController<IDataItem>>()
const inputStyle = { width: 300, marginRight: 8 }


function createData(nums: number) {
    const actualDataNum = nums || 10000;
    const data = new Array(actualDataNum).fill("").map((item, index) => {
        return {
            id: ${'${index}'},
            title: ${'${index}:  ${sentence()}'}
        }
    })
    return data
}

const data = useMemo(() => {
    return createData(Number(dataNum));
}, [dataNum]);

const getListItemHeight = useCallback(item => {
    return Number(item.id) % 2 === 0 ? 50 : 100
}, [])

const getListItemStyle = useCallback((item) => {
    return {
        height: getListItemHeight(item),
    }
}, [])

const randerItem = useCallback((listItem) => {
    return (
        <div style={getListItemStyle(listItem)}>
            {listItem.title}
        </div>
    )
}, [getListItemStyle])

const onInputValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
}, [])

const onConfirm = useCallback(() => {
    setDataNum(inputValue)
}, [inputValue])

const getController = (props: ListController<IDataItem>) => {
    listController.current = props
}

return (
    <List
        data={data}
        renderItem={randerItem}
        containerHeight={500}
        itemHeight={getListItemHeight}
        getController={getController}
    />
)
            `
        }
    },
    design: {
        name: 'Different ItemHeight'
    }
}

const BufferTemplate: ComponentStory<typeof List> = (args) => {
    const listController = useRef<ListController<IDataItem>>()

    function createData(nums: number) {
        const actualDataNum = nums || 10000;
        const data = new Array(actualDataNum).fill("").map((item, index) => {
            return {
                id: `${index}`,
                title: `${index}:  ${sentence()}`
            }
        })
        return data
    }

    const data = useMemo(() => {
        return createData(1000);
    }, []);

    const getListItemHeight = useCallback(item => {
        return 50;
    }, [])

    const getListItemStyle = useCallback(() => {
        return staticHeightitemStyle
    }, [])

    const randerItem = useCallback((listItem) => {
        return (
            <div className="demo-list-item" style={getListItemStyle()}>
                {`${listItem.title}`}
            </div>
        )
    }, [getListItemStyle])

    const getController = (props: ListController<IDataItem>) => {
        listController.current = props
    }

    return (
        <>
            <h2>缓冲区</h2>
            <div className="list-container">
                <List
                    data={data}
                    renderItem={randerItem}
                    containerHeight={500}
                    itemHeight={getListItemHeight}
                    getController={getController}
                    buffer={10}
                />
            </div>
        </>

    )
};
export const Buffer = BufferTemplate.bind({});
Buffer.parameters = {
    docs: {
        source: {
            code: `
const listController = useRef<ListController<IDataItem>>()

function createData(nums: number) {
    const actualDataNum = nums || 10000;
    const data = new Array(actualDataNum).fill("").map((item, index) => {
        return {
            id: ${"${index}"},
            title: ${"${index}:  ${sentence()}"}
        }
    })
    return data
}

const data = useMemo(() => {
    return createData(1000);
}, []);

const getListItemHeight = useCallback(item => {
    return 50;
}, [])

const getListItemStyle = useCallback(() => {
    return staticHeightitemStyle
}, [])

const randerItem = useCallback((listItem) => {
    return (
        <div style={getListItemStyle()}>
            {listItem.title}
        </div>
    )
}, [getListItemStyle])

const getController = (props: ListController<IDataItem>) => {
    listController.current = props
}

return (
    <div className="list-container">
        <List
            data={data}
            renderItem={randerItem}
            containerHeight={500}
            itemHeight={getListItemHeight}
            getController={getController}
            buffer={10}
        />
    </div>
)
            `
        }
    }
}

const DynamicItemHeightTemplate: ComponentStory<typeof List> = (args) => {
    const listController = useRef<ListController<IDataItem>>()

    function createData(nums: number) {
        const actualDataNum = nums || 10000;
        const data = new Array(actualDataNum).fill("").map((item, index) => {
            return {
                id: `${index}`,
                title: `${index}:  ${paragraph(Math.floor(Math.random() * 10 + 3))}`
            }
        })
        return data
    }

    const data = useMemo(() => {
        return createData(10000);
    }, []);

    const getListItemHeight = useCallback(item => {
        return 50;
    }, [])

    const getListItemStyle = useCallback(() => {
        return dynamicHeightItemStyle
    }, [])

    const randerItem = useCallback((listItem) => {
        return (
            <div className="demo-list-item" style={getListItemStyle()}>
                {`${listItem.title}`}
            </div>
        )
    }, [getListItemStyle])

    const getController = (props: ListController<IDataItem>) => {
        listController.current = props
    }

    return (
        <>
            <h2>数据项动态高度</h2>
            <div className="list-container">
                <List
                    data={data}
                    renderItem={randerItem}
                    containerHeight={500}
                    itemHeight={getListItemHeight}
                    shouldCollectHeight={true}
                    getController={getController}
                    buffer={10}
                />
            </div>
        </>

    )
};
DynamicItemHeightTemplate.parameters = {
    docs: {
        source: {
            code: `
const listController = useRef<ListController<IDataItem>>()

function createData(nums: number) {
    const actualDataNum = nums || 10000;
    const data = new Array(actualDataNum).fill("").map((item, index) => {
        return {
            id: ${"${index}"},
            title: ${"${index}:  ${sentence()}"}
        }
    })
    return data
}

const data = useMemo(() => {
    return createData(1000);
}, []);

const getListItemHeight = useCallback(item => {
    return 50;
}, [])

const getListItemStyle = useCallback(() => {
    return staticHeightitemStyle
}, [])

const randerItem = useCallback((listItem) => {
    return (
        <div style={getListItemStyle()}>
            {listItem.title}
        </div>
    )
}, [getListItemStyle])

const getController = (props: ListController<IDataItem>) => {
    listController.current = props
}

return (
    <div className="list-container">
        <List
            data={data}
            renderItem={randerItem}
            containerHeight={500}
            itemHeight={getListItemHeight}
            getController={getController}
            buffer={10}
        />
    </div>
)
            `
        }
    }
}
export const DynamicItemHeight = DynamicItemHeightTemplate.bind({});

const ScrollToNodeTemplate: ComponentStory<typeof List> = (args) => {
    const listController = useRef<ListController<IDataItem>>()
    const inputStyle = { width: 300, marginRight: 8 }

    function createData(nums: number) {
        const actualDataNum = nums || 10000;
        const data = new Array(actualDataNum).fill("").map((item, index) => {
            return {
                id: `${index}`,
                title: `${index}:  ${sentence()}`
            }
        })
        return data
    }

    const data = useMemo(() => {
        return createData(1000);
    }, []);

    const getListItemHeight = useCallback(item => {
        return 50;
    }, [])

    const getListItemStyle = useCallback(() => {
        return staticHeightitemStyle
    }, [])

    const randerItem = useCallback((listItem) => {
        return (
            <div className="demo-list-item" style={getListItemStyle()}>
                {`${listItem.title}`}
            </div>
        )
    }, [getListItemStyle])

    const getController = (props: ListController<IDataItem>) => {
        listController.current = props
    }

    const scrollToNode = useCallback((e) => {
        const key = e.target.value;
        if (listController.current) {
            const targetNode = data.find(item => item.id === key);
            if (targetNode) {
                listController.current.scrollTo(targetNode);
            } else {
                message.error('NodeNotFound');
            }
        }
    }, []);

    return (
        <>
            <h2>滚动到指定节点</h2>
            <Input placeholder='请输入数据条数, 回车或点击按钮确认' onPressEnter={scrollToNode} style={inputStyle} />
            <Button onClick={scrollToNode}>确认</Button>
            <div className="list-container">
                <List
                    data={data}
                    renderItem={randerItem}
                    containerHeight={500}
                    itemHeight={getListItemHeight}
                    getController={getController}
                    buffer={10}
                />
            </div>
        </>

    )
};
ScrollToNodeTemplate.parameters = {
    docs: {
        source: {
            code: `
const listController = useRef<ListController<IDataItem>>()

function createData(nums: number) {
    const actualDataNum = nums || 10000;
    const data = new Array(actualDataNum).fill("").map((item, index) => {
        return {
            id: ${"${index}"},
            title: ${"${index}:  ${sentence()}"}
        }
    })
    return data
}

const data = useMemo(() => {
    return createData(1000);
}, []);

const getListItemHeight = useCallback(item => {
    return 50;
}, [])

const getListItemStyle = useCallback(() => {
    return staticHeightitemStyle
}, [])

const randerItem = useCallback((listItem) => {
    return (
        <div style={getListItemStyle()}>
            {listItem.title}
        </div>
    )
}, [getListItemStyle])

const scrollToNode = useCallback((e) => {
    const key = e.target.value;
    if (listController.current) {
        const targetNode = data.find(item => item.id === key);
        if (targetNode) {
            listController.current.scrollTo(targetNode);
        } else {
            message.error('This is an error message');
        }
    }
}, []);

const getController = (props: ListController<IDataItem>) => {
    listController.current = props
}

return (
    <>
        <Input placeholder='请输入数据条数, 回车或点击按钮确认' onPressEnter={scrollToNode} style={inputStyle} />
        <Button onClick={scrollToNode}>确认</Button>
        <div className="list-container">
            <List
                data={data}
                renderItem={randerItem}
                containerHeight={500}
                itemHeight={getListItemHeight}
                getController={getController}
                buffer={10}
            />
        </div>
    </>
) 
            `
        },
    }
}
export const scrollToNode = ScrollToNodeTemplate.bind({});