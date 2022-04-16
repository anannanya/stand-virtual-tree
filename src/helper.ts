import { A } from './App'

type scope = [number, number];
type accurate = number;
interface dataProps {
    depth: scope | accurate;
    sisterNum: scope | accurate;
}
interface itemData {
    id: string;
    title: string;
    children: itemData[]
}

export function generateTreeData(props: dataProps) {
    const { depth, sisterNum } = props;
    console.log(234, depth, sisterNum)
    const realDepth = Array.isArray(depth)
        ? Math.ceil(Math.random() * (depth[1] - depth[0]) + depth[0])
        : depth;
    const realSisNum = Array.isArray(sisterNum)
        ? Math.ceil(Math.random() * (sisterNum[1] - sisterNum[0]) + sisterNum[0])
        : sisterNum;
    let rootNode: itemData = {
        id: '0',
        title: `0`,
        children: []
    };
    console.time('www')
    // let count = 0
    // let root = rootNode
    // while (count < depth) {
    //     let children = root.children
    //     for (let i = 0; i < sisterNum; i++) {
    //         root.children[i] = {
    //             id: `${root.id}-${i}`,
    //             title: `${root.id}-${i}: ${sentence()}`,
    //             children: []
    //         }

    //     }
    //     root = children
    //     count++
    // }
    let helpFun = (treeData: A, depth: number, sisterNum: number, fatherId: string) => {
        // console.log(1111)
        if (depth > 0) {
            for (let i = 0; i < sisterNum; i++) {
                treeData.children[i] = {
                    id: `${fatherId}-${i}`,
                    // title: `${fatherId}-${i}: ${sentence()}`,
                    title: `${fatherId}-${i}`,
                    children: []
                };
            }
            depth = depth - 1;
            treeData.children.forEach((item) => {
                helpFun(item, depth, sisterNum, item.id);
            });
        } else {
            return;
        }
    };
    helpFun(rootNode, realDepth, realSisNum, '0');
    console.timeEnd('www')

    console.log(rootNode)
    return rootNode;
}
