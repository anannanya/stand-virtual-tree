import { IBaseTreeNodeData } from "../Tree";

export function useFlatten<
    ITreeNodeData extends IBaseTreeNodeData<ITreeNodeData>
>(opts: { data: ITreeNodeData[]; expandedKeys: string[] }) {
    const { data, expandedKeys } = opts;
    // 构造一级节点，存入队列
    const taskQueue = [...data].map((item) => ({ data: item, level: 0 }));
    const flattenedData: ITreeNodeData[] = [];
    const levelMap: Record<string, number> = {};

    while (taskQueue.length > 0) {
        const task = taskQueue.shift();
        if (task) {
            const { data, level } = task;
            flattenedData.push(data);
            levelMap[data.id] = level;
            const isNodeExpanded = expandedKeys.includes(data.id);
            const childs = data.children;
            if (childs && isNodeExpanded) {
                taskQueue.unshift(
                    ...childs.map((item) => ({ data: item, level: level + 1 }))
                );
            }
        }
    }

    return { flattenedData, levelMap };
}