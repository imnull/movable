import { useCallback, useEffect, isValidElement, useState, createElement } from 'react'
import './index.scss'
import { createMovable } from '~/libs/movable'
import {
    TPosition, TSize, TEventArgs,
    genTranslate,
    createResizeHandler,
    genWidth,
    genHeight,
} from './helper'

const cloneChildren = (children: any, extProps: Record<string, any>, key: any = null): any => {
    if(Array.isArray(children)) {
        return children.map((children: any, key: number) => cloneChildren(children, extProps, key))
    } else if(isValidElement(children)) {
        const { props, type } = children
        const { ...restProps } = props as any
        const newChildren = createElement(type, { ...restProps, ...extProps, key })
        return newChildren
    } else {
        return children
    }
}

export default (props: {
    children?: any;
    data?: any;
    position?: TPosition;
    size?: TSize;
    debug?: boolean;
    active?: boolean;
    title?: string;
    useRuntime?: boolean;
    onClose?: (args: TEventArgs) => void;
    onMoveStart?: (args: TEventArgs) => void;
    onMoveEnd?: (args: TEventArgs) => void;
    onMoving?: (args: TEventArgs) => void;
    onMinify?: (min: boolean) => void;
    onSelected?: () => void;
    onResize?: (size: TSize) => void;
}) => {
    const {
        title = 'Untitled',
        children,
        position: _position = { x: 0, y: 0 },
        size: _size = { width: 240, height: 240 },
        data = null,
        debug = false,
        active = false,
        useRuntime = false,
        onClose,
        onMoveStart,
        onMoveEnd,
        onMoving,
        onMinify,
        onSelected,
        onResize,
    } = props

    const [target, setTarget] = useState<HTMLElement | null>(null)
    const [pos, setPos] = useState(_position)
    const [move] = useState(createMovable({
        debug,
        onStart() {
            setResizeType('')
            setStart(true)
            typeof onSelected === 'function' && onSelected()
        },
        onMoving({ offset }) {
            setOffset(offset)
        },
        onEnd({ position }) {
            setStart(false)
            setPos(position)
            setOffset({ x: 0, y: 0 })
        }
    }))
    useEffect(() => {
        if (target) {
            const { height } = target.getBoundingClientRect()
            setHeadHeight(height >> 0)
            move.init(target)
            return () => {
                move.dispose()
            }
        }
    }, [target])

    useEffect(() => {
        setPos({ ..._position })
    }, [_position])

    const [tools, setTools] = useState<HTMLElement | null>(null)
    const [min, setMin] = useState(false)
    const [headHeight, setHeadHeight] = useState(0)

    const [start, setStart] = useState(false)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [size, setSize] = useState(_size)

    const [runtimeSize, setRuntimeSize] = useState(_size)
    const [runtimePosition, setRuntimePosition] = useState(_position)

    const [sizeOffset, setSizeOffset] = useState({ x: 0, y: 0 })
    const [resizeType, setResizeType] = useState<'' | 'L' | 'T' | 'R' | 'B' | 'LT' | 'RT' | 'LB' | 'RB'>('')

    /** 事件 */

    useEffect(() => {
        if (start && typeof onMoving === 'function') {
            onMoving({
                position: {
                    x: pos.x + offset.x,
                    y: pos.y + offset.y,
                },
                data
            })
        }
    }, [pos, offset, start, data])

    useEffect(() => {
        const args = { position: { ...pos }, data }
        const method = start ? onMoveStart : onMoveEnd
        typeof method === 'function' && method(args)
    }, [pos, start, data])
    useEffect(() => {
        typeof onMinify === 'function' && onMinify(min)
    }, [min])

    useEffect(() => {
        if (!tools) {
            return
        }
        const mousedown = (e: MouseEvent) => {
            e.stopPropagation()
            typeof onSelected === 'function' && onSelected()
        }
        tools.addEventListener('mousedown', mousedown)
        return () => {
            tools.removeEventListener('mousedown', mousedown)
        }
    }, [tools])

    const handleClose = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        typeof onClose === 'function' && onClose({ position: { ...pos }, data })
    }, [data, pos])

    const handleMin = () => {
        setMin(!min)
    }

    const handleMaxium = () => {

    }

    /** 事件 END */

    const [barL, setBarL] = useState<HTMLElement | null>(null)
    const [mL] = useState(() => {
        return createResizeHandler({
            debug,
            size: [size, setSize],
            position: [pos, setPos],
            sizeOffset: [sizeOffset, setSizeOffset],
            resizeType: ['L', setResizeType],
            runtimeSize: [runtimeSize, setRuntimeSize],
            runtimePosition: [runtimePosition, setRuntimePosition],
            onSelected,
            useRuntime,
        })
    })
    useEffect(() => {
        if (barL) {
            mL.init(barL)
            return () => {
                mL.dispose()
            }
        }
    }, [barL])

    const [barR, setBarR] = useState<HTMLElement | null>(null)
    const [mR] = useState(() => {
        return createResizeHandler({
            debug,
            size: [size, setSize],
            position: [pos, setPos],
            sizeOffset: [sizeOffset, setSizeOffset],
            resizeType: ['R', setResizeType],
            runtimeSize: [runtimeSize, setRuntimeSize],
            runtimePosition: [runtimePosition, setRuntimePosition],
            onSelected,
            useRuntime,
        })
    })
    useEffect(() => {
        if (barR) {
            mR.init(barR)
            return () => {
                mR.dispose()
            }
        }
    }, [barR])

    const [barT, setBarT] = useState<HTMLElement | null>(null)
    const [mT] = useState(() => {
        return createResizeHandler({
            debug,
            size: [size, setSize],
            position: [pos, setPos],
            sizeOffset: [sizeOffset, setSizeOffset],
            resizeType: ['T', setResizeType],
            runtimeSize: [runtimeSize, setRuntimeSize],
            runtimePosition: [runtimePosition, setRuntimePosition],
            onSelected,
            useRuntime,
        })
    })
    useEffect(() => {
        if (barT) {
            mT.init(barT)
            return () => {
                mT.dispose()
            }
        }
    }, [barT])

    const [barB, setBarB] = useState<HTMLElement | null>(null)
    const [mB] = useState(() => {
        return createResizeHandler({
            debug,
            size: [size, setSize],
            position: [pos, setPos],
            sizeOffset: [sizeOffset, setSizeOffset],
            resizeType: ['B', setResizeType],
            runtimeSize: [runtimeSize, setRuntimeSize],
            runtimePosition: [runtimePosition, setRuntimePosition],
            onSelected,
            useRuntime,
        })
    })
    useEffect(() => {
        if (barB) {
            mB.init(barB)
            return () => {
                mB.dispose()
            }
        }
    }, [barB])

    const [cornerLT, setCornerLT] = useState<HTMLElement | null>(null)
    const [mLT] = useState(() => {
        return createResizeHandler({
            debug,
            size: [size, setSize],
            position: [pos, setPos],
            sizeOffset: [sizeOffset, setSizeOffset],
            resizeType: ['LT', setResizeType],
            runtimeSize: [runtimeSize, setRuntimeSize],
            runtimePosition: [runtimePosition, setRuntimePosition],
            onSelected,
            useRuntime,
        })
    })
    useEffect(() => {
        if (cornerLT) {
            mLT.init(cornerLT)
            return () => {
                mLT.dispose()
            }
        }
    }, [cornerLT])

    const [cornerRT, setCornerRT] = useState<HTMLElement | null>(null)
    const [mRT] = useState(() => {
        return createResizeHandler({
            debug,
            size: [size, setSize],
            position: [pos, setPos],
            sizeOffset: [sizeOffset, setSizeOffset],
            resizeType: ['RT', setResizeType],
            runtimeSize: [runtimeSize, setRuntimeSize],
            runtimePosition: [runtimePosition, setRuntimePosition],
            onSelected,
            useRuntime,
        })
    })
    useEffect(() => {
        if (cornerRT) {
            mRT.init(cornerRT)
            return () => {
                mRT.dispose()
            }
        }
    }, [cornerRT])

    const [cornerLB, setCornerLB] = useState<HTMLElement | null>(null)
    const [mLB] = useState(() => {
        return createResizeHandler({
            debug,
            size: [size, setSize],
            position: [pos, setPos],
            sizeOffset: [sizeOffset, setSizeOffset],
            resizeType: ['LB', setResizeType],
            runtimeSize: [runtimeSize, setRuntimeSize],
            runtimePosition: [runtimePosition, setRuntimePosition],
            onSelected,
            useRuntime,
        })
    })
    useEffect(() => {
        if (cornerLB) {
            mLB.init(cornerLB)
            return () => {
                mLB.dispose()
            }
        }
    }, [cornerLB])

    const [cornerRB, setCornerRB] = useState<HTMLElement | null>(null)
    const [mRB] = useState(() => {
        return createResizeHandler({
            debug,
            size: [size, setSize],
            position: [pos, setPos],
            sizeOffset: [sizeOffset, setSizeOffset],
            resizeType: ['RB', setResizeType],
            runtimeSize: [runtimeSize, setRuntimeSize],
            runtimePosition: [runtimePosition, setRuntimePosition],
            onSelected,
            useRuntime,
        })
    })
    useEffect(() => {
        if (cornerRB) {
            mRB.init(cornerRB)
            return () => {
                mRB.dispose()
            }
        }
    }, [cornerRB])

    useEffect(() => {
        [
            mL, mR, mT, mB,
            mLT, mRT, mLB, mRB,
        ].forEach(m => m.updatePosition(pos))
        move.update(pos)
    }, [pos])
    useEffect(() => {
        [
            mL, mR, mT, mB,
            mLT, mRT, mLB, mRB,
        ].forEach(m => m.updateSize(size))
    }, [size])

    useEffect(() => {
        typeof onResize === 'function' && onResize({ ...runtimeSize, height: runtimeSize.height - headHeight })
    }, [runtimeSize, headHeight])

    const [_children, setChildren] = useState<any>(null)
    useEffect(() => {
        const newChildren = cloneChildren(children, {
            size: { ...runtimeSize, height: runtimeSize.height - headHeight },
        })
        setChildren(newChildren)
    }, [children, runtimeSize, headHeight])


    return <div className={active ? "marvin-widget" : "marvin-widget background"} style={{
        transform: genTranslate(pos, offset, size, sizeOffset, resizeType),
        // transform: `translateX(${runtimePosition.x}px) translateY(${runtimePosition.y}px)`,
        width: genWidth(size, sizeOffset, resizeType),
        height: min ? headHeight : genHeight(size, sizeOffset, resizeType),
    }} onMouseDown={e => {
        typeof onSelected === 'function' && onSelected()
    }}>
        <div className="widget-head" ref={setTarget}>
            <div className='title'>{title}</div>
            <div className='tools' ref={setTools}>
                <div className='btn maxium' onClick={handleMaxium}></div>
                <div className='btn minify' onClick={handleMin}></div>
                <div className='btn close' onClick={handleClose}></div>
            </div>
        </div>
        <div className="widget-body">{_children}</div>
        {min ? null : <div className="widget-resize">
            <div className={debug ? "bar debug left" : "bar left"} ref={setBarL}></div>
            <div className={debug ? "bar debug right" : "bar right"} ref={setBarR}></div>
            <div className={debug ? "bar debug top" : "bar top"} ref={setBarT}></div>
            <div className={debug ? "bar debug bottom" : "bar bottom"} ref={setBarB}></div>
            <div className={debug ? "corner debug lt" : "corner lt"} ref={setCornerLT}></div>
            <div className={debug ? "corner debug rt" : "corner rt"} ref={setCornerRT}></div>
            <div className={debug ? "corner debug lb" : "corner lb"} ref={setCornerLB}></div>
            <div className={debug ? "corner debug rb" : "corner rb"} ref={setCornerRB}></div>
        </div>}
    </div >
}