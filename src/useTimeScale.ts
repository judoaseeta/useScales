import { useCallback, useMemo } from 'react'
import { NumberValue, ScaleTime, scaleTime } from 'd3-scale'

interface UseTimeScaleProps<D> {
    type: 'time'
    data?: Array<D>
    domainAccessor: (rawData: Array<D>) => [Date, Date]
    range: [number, number]
    rangeRound?: Iterable<NumberValue>
    nice?: boolean
    niceCount?: number
    clamp?: true
}

interface ReturnTypeOfUseTimeScale {
    scale: ScaleTime<number, number> | null
    getValueOfCoord: (coord: number) => Date | null
}
export type UseTimeScale = <D>(props: UseTimeScaleProps<D>) => ReturnTypeOfUseTimeScale
export const UseTimeScale: UseTimeScale = (props) => {
    const scale = useMemo(() => {
        if (props.data) {
            const domain = props.domainAccessor(props.data)
            const scale = scaleTime().domain(domain).range(props.range)

            if (props.rangeRound) {
                scale.rangeRound(props.rangeRound)
            }
            if (props.nice) {
                if (props.niceCount) {
                    scale.nice(props.niceCount)
                } else {
                    scale.nice()
                }
            }
            if (props.clamp) {
                scale.clamp()
            }
            return scale
        }
        return null
    }, [props])
    const getValueOfCoord = useCallback(
        (coord: number) => {
            if (scale) {
                return scale.invert(coord)
            }
            return null
        },
        [scale],
    )
    return {
        scale,
        getValueOfCoord,
    }
}
