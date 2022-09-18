type ID = string | number

type RowItem = {
    id: ID
    parent: ID
    type?: string | null
}

function sortBy (by: keyof Omit<RowItem, 'type'>) {
    return (a: RowItem, b: RowItem) => (a[by] < b[by] ? -1 : a[by] !== b[by] ? 1 : 0)
}

class NodeHasNotParent extends Error {}
class NodeNotFound extends Error {}

class Node {
    isRoot = false
    children: Node[] = []
    parent: Node | undefined
    row: RowItem | undefined

    constructor (row?: RowItem) {
        if (row) {
            this.row = row
        }
    }

    static createRoot (): Node {
        const root = new Node()
        root.isRoot = true

        return root
    }

    addChild (row: RowItem): Node {
        const newNode = new Node(row)
        newNode.parent = this

        this.children.push(newNode)

        return newNode
    }

    getRow (): RowItem | undefined {
        return this.row
    }

    getChildren (): Node[] {
        return this.children
    }

    getParent () {
        if (!this.parent) {
            throw new NodeHasNotParent(`Element with id "${this.row?.id}" has not parent.`)
        }
        return this.parent
    }

    getAllParents (): RowItem[] {
        const row = this.row ? [this.row] : []
        if (this.parent?.isRoot) {
            return row
        }

        return [...row, ...(this.parent?.getAllParents() || [])]
    }

    getAll (): RowItem[] {
        return [...this.children.flatMap((child) => child.getAll()), ...(this.row ? [this.row] : [])].sort(sortBy('id'))
    }

    getInnerAll (): RowItem[] {
        return this.children.flatMap((child) => child.getAll()).sort(sortBy('id'))
    }
}

export default class TreeStore {
    stateById: { [rowId: ID]: Node } = {}
    root: Node = Node.createRoot()

    constructor (items: RowItem[]) {
        for (const item of items.sort(sortBy('parent'))) {
            if (item.parent === 'root') {
                this.stateById[item.id] = this.root.addChild(item)
                continue
            }

            try {
                this.stateById[item.id] = this.stateById[item.parent].addChild(item)
            } catch (e) {
                throw new NodeNotFound(`Parent with id "${item.parent}" for element with id "${item.id}" not found.`)
            }
        }
    }

    getRootChildren () {
        return this.root.children
    }

    getAll (): RowItem[] {
        return this.root.getAll()
    }

    getItem (id: ID): RowItem | undefined {
        try {
            return this.stateById[id].getRow()
        } catch (e) {
            if (e instanceof TypeError) throw new NodeNotFound(`Element with id "${id}" not found.`)
            throw e
        }
    }

    getChildren (id: ID): (RowItem | undefined)[] {
        try {
            return this.stateById[id].getChildren().map((child) => child.getRow())
        } catch (e) {
            if (e instanceof TypeError) throw new NodeNotFound(`Element with id "${id}" not found.`)
            throw e
        }
    }

    getAllChildren (id: ID): RowItem[] {
        try {
            return this.stateById[id].getInnerAll()
        } catch (e) {
            if (e instanceof TypeError) throw new NodeNotFound(`Element with id "${id}" not found.`)
            throw e
        }
    }

    getAllParents (id: ID): RowItem[] {
        try {
            return this.stateById[id].getParent().getAllParents()
        } catch (e) {
            if (e instanceof NodeHasNotParent) return []
            if (e instanceof TypeError) throw new NodeNotFound(`Element with id "${id}" not found.`)
            throw e
        }
    }
}
