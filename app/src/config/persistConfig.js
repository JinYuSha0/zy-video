import immutableTransform from 'redux-persist-transform-immutable'
import createElectronStorage from "redux-persist-electron-storage"

export default {
    key: 'root',
    whitelist: ['user', 'dataSource'],
    transforms: [immutableTransform()],
    storage: createElectronStorage({
        electronStoreOpts: {
            encryptionKey: 'zyjy8410'
        }
    })
}