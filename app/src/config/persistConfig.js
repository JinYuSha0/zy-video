import immutableTransform from 'redux-persist-transform-immutable'
import Store from 'electron-store'

const createElectronStorage = ({electronStoreOpts} = {}) => {
    const store = new Store(electronStoreOpts || {})

    return {
        clear: () => {
            return new Promise((resolve) => {
                resolve(store.clear())
            })
        },
        getItem: (key) => {
            return new Promise((resolve) => {
                resolve(store.get(key))
            })
        },
        setItem: (key, item) => {
            return new Promise((resolve) => {
                resolve(store.set(key, item))
            })
        },
        removeItem: (key) => {
            return new Promise((resolve) => {
                resolve(store.delete(key))
            })
        }
    }
}

export const electronStore = createElectronStorage({
    electronStoreOpts: {
        encryptionKey: 'zyjy8410'
    }
})

export default {
    key: 'root',
    whitelist: ['user', 'dataSource'],
    transforms: [immutableTransform()],
    storage: electronStore
}