interface DataWithSequenceIndex<D> {
    rawData: D
    sequenceIndex: number
}
class DataNode<D> {
    private _left: DataNode<D> | null
    private _right: DataNode<D> | null
    private _data: D
    private _sequenceIndex: number
    constructor(data: D, sequenceIndex: number) {
        this._data = data
        this._sequenceIndex = sequenceIndex
        this._left = null
        this._right = null
    }
    get data() {
        return this._data
    }
    get sequenceIndex() {
        return this._sequenceIndex
    }
    get left() {
        return this._left
    }
    set left(newNode: DataNode<D> | null) {
        this._left = newNode
    }
    get right() {
        return this._right
    }
    set right(newNode: DataNode<D> | null) {
        this._right = newNode
    }
}
interface GetClosestParams<D> {
    getDistance: (target: D, data: D) => number
    validator?: (target: D, data: D) => boolean
    target: D
}
class DataTree<D> {
    _root: DataNode<D> | null
    constructor(data: Array<D>) {
        const mappedData: Array<DataWithSequenceIndex<D>> = data.map((rawData, index) => ({
            rawData,
            sequenceIndex: index,
        }))
        this._root = this.deploy(mappedData)
    }
    private deploy(data: Array<DataWithSequenceIndex<D>>) {
        if (data.length === 0) {
            return null
        }
        if (data.length === 1) {
            return new DataNode(data[0].rawData, data[0].sequenceIndex)
        }
        const midIndex = Math.floor(data.length / 2)
        const midNode = new DataNode(data[midIndex].rawData, data[midIndex].sequenceIndex)
        midNode.left = this.deploy(data.slice(0, midIndex))
        midNode.right = this.deploy(data.slice(midIndex + 1))
        return midNode
    }
    public getClosest(params: GetClosestParams<D>, currentNode: DataNode<D> | null = this._root): number {
        const { target, validator, getDistance } = params
        if (currentNode && !currentNode.left && !currentNode.right) {
            if (validator) {
                const isValid = validator(target, currentNode.data)
                if (isValid) {
                    return currentNode.sequenceIndex
                }
                return -1
            }
            return currentNode.sequenceIndex
        }
        if (!currentNode) {
            return -1
        }

        const gapWithCurrent = getDistance(target, currentNode.data)
        const leftNode = currentNode.left
        const gapWithLeft = leftNode ? getDistance(target, leftNode.data) : Infinity
        const rightNode = currentNode.right
        const gapWithRight = rightNode ? getDistance(target, rightNode.data) : Infinity
        if (gapWithCurrent < gapWithLeft && gapWithCurrent < gapWithRight) {
            return currentNode.sequenceIndex
        }
        if (gapWithCurrent > gapWithLeft && gapWithLeft < gapWithRight) {
            return this.getClosest(params, leftNode)
        }
        return this.getClosest(params, rightNode)
    }
}
