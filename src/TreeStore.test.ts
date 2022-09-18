import TreeStore from './TreeStore'

const items = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
]

const store = new TreeStore(items)


describe('TreeStore', () => {
    test('getAll', () => {
        const expectedResult = '[{"id":1,"parent":"root"},{"id":2,"parent":1,"type":"test"},{"id":3,"parent":1,"type":"test"},{"id":4,"parent":2,"type":"test"},{"id":5,"parent":2,"type":"test"},{"id":6,"parent":2,"type":"test"},{"id":7,"parent":4,"type":null},{"id":8,"parent":4,"type":null}]'
        const getAllResultString = JSON.stringify(store.getAll())

        expect(getAllResultString).toBe(expectedResult)
    })

    test('getItem', () => {
        const expectedResult = '{"id":7,"parent":4,"type":null}'
        const getItemResultString = JSON.stringify(store.getItem(7))

        expect(getItemResultString).toBe(expectedResult)
    })

    describe('getChildren', () => {
        test('With id 4', () => {
            const expectedResult = '[{"id":7,"parent":4,"type":null},{"id":8,"parent":4,"type":null}]'
            const getChildrenResultString = JSON.stringify(store.getChildren(4))

            expect(getChildrenResultString).toBe(expectedResult)
        })

        test('With id 5', () => {
            const expectedResult = '[]'
            const getChildrenResultString = JSON.stringify(store.getChildren(5))

            expect(getChildrenResultString).toBe(expectedResult)
        })

        test('With id 2', () => {
            const expectedResult = '[{"id":4,"parent":2,"type":"test"},{"id":5,"parent":2,"type":"test"},{"id":6,"parent":2,"type":"test"}]'
            const getChildrenResultString = JSON.stringify(store.getChildren(2))

            expect(getChildrenResultString).toBe(expectedResult)
        })
    })

    test('getAllChildren', () => {
        const expectedResult = '[{"id":4,"parent":2,"type":"test"},{"id":5,"parent":2,"type":"test"},{"id":6,"parent":2,"type":"test"},{"id":7,"parent":4,"type":null},{"id":8,"parent":4,"type":null}]'
        const getAllChildrenResultString = JSON.stringify(store.getAllChildren(2))

        expect(getAllChildrenResultString).toBe(expectedResult)
    })

    test('getAllParents', () => {
        const expectedResult = '[{"id":4,"parent":2,"type":"test"},{"id":2,"parent":1,"type":"test"},{"id":1,"parent":"root"}]'
        const getAllParentsResultString = JSON.stringify(store.getAllParents(7))

        expect(getAllParentsResultString).toBe(expectedResult)
    })
})
