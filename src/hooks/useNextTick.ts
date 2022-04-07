import { useEffect, useRef, useState } from "react";

export default function useNextTick() {
    const [updateId, setUpdateId] = useState('0')
    const callbackMap = useRef<{ [key: string]: Function | undefined }>({})

    const setUpdate = (id: string, callback: () => void) => {
        setUpdateId(id)
        if (callbackMap.current) {
            callbackMap.current[id] = callback
        }
    }

    useEffect(() => {
        const fn = callbackMap.current[updateId]
        if (typeof fn === 'function') {
            fn()
        }
        return () => {
            callbackMap.current[updateId] = undefined
        }
    }, [updateId])

    return {
        updateId,
        setUpdate
    }
}