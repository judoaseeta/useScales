import { useCallback, useMemo } from 'react'
import { ScaleContinuousNumeric, scaleLinear, scalePow, scaleSqrt, NumberValue, ScaleTime, scaleTime } from 'd3-scale'

export interface UseContinousScaleProps<D> {
    data?: D[]
    type: 'linear' | 'log' | 'power' | 'sqrt'
    range: [number, number]
    rangeRound?: Iterable<NumberValue>
    nice?: boolean
    niceCount?: number
    clamp?: true
    domainAccessor: (rawData: D[]) => [number, number]
}

/**
 * 
 * export function UseCTontinousScale<D>(props: UseTimeScaleWithDomainProps<D> | UseTimeScalePropsWithDomainAccessor<D>): {
    scale: ScaleTime<number, number>
    getValueOfPoint: (point: number) => Date
}
 * 
 */

export type UseContinousScale = <D>(
    props: UseContinousScaleProps<D>,
    data?: Array<D>,
) => {
    scale: ScaleContinuousNumeric<number, number> | null
    getValueOfPoint: (point: number) => number
}

export const UseContinousScale: UseContinousScale = ({ data, ...props }) => {
    const scale: ScaleContinuousNumeric<number, number> | null = useMemo(() => {
        if (data) {
            const domain = props.domainAccessor(data)
            const range = props.range
            let scale: ScaleContinuousNumeric<number, number> | null = null
            if (props.type === 'linear') {
                scale = scaleLinear<number, number>().range(range).domain(domain)
            } else if (props.type === 'power') {
                scale = scalePow<number, number>().range(range).domain(domain)
            } else if (props.type === 'sqrt') {
                scale = scaleSqrt<number, number>().range(range).domain(domain)
            }
            if (scale) {
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
        } else {
            return null
        }
    }, [props])
    const getValueOfPoint = useCallback(
        (point: number) => {
            if (scale) {
                return scale.invert(point)
            } else {
                return -1
            }
        },
        [scale],
    )
    return {
        scale,
        getValueOfPoint,
    }
}
export type UseContinousScaleReturn = ReturnType<UseContinousScale>
