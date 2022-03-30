import { A } from './App'

type scope = [number, number];
type accurate = number;
interface dataProps {
    depth: scope | accurate;
    sisterNum: scope | accurate;
}

export function generateTreeData(props: dataProps) {
    const { depth, sisterNum } = props;
    const realDepth = Array.isArray(depth)
        ? Math.ceil(Math.random() * (depth[1] - depth[0]) + depth[0])
        : depth;
    const realSisNum = Array.isArray(sisterNum)
        ? Math.ceil(Math.random() * (sisterNum[1] - sisterNum[0]) + sisterNum[0])
        : sisterNum;
    let rootNode = {
        id: '0',
        title: "0",
        children: []
    };
    let helpFun = (treeData: A, depth: number, sisterNum: number) => {
        if (depth > 0) {
            for (let i = 0; i < sisterNum; i++) {
                treeData.children[i] = {
                    id: `${treeData.id}-${i}`,
                    title: `${Array(Math.floor(Math.random() * 5))
                        .fill(`${Math.random()}\n`)
                        .join()}`,
                    children: []
                };
            }
            depth = depth - 1;
            treeData.children.forEach((item) => {
                helpFun(item, depth, sisterNum);
            });
        } else {
            return;
        }
    };
    helpFun(rootNode, realDepth, realSisNum);
    return rootNode;
}
