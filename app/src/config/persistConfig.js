import immutableTransform from 'redux-persist-transform-immutable'
import createElectronStorage from "redux-persist-electron-storage"

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