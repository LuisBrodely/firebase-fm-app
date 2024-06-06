import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../config/firebase"
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

class Fire {
    static shared: Fire;

    constructor() {
        initializeApp(firebaseConfig)
    }

    addPost = async ({ text, localUri }: any) => {
        const remoteUri = await this.uploadPhtoAsync(localUri)

        try {
            const docRef = await addDoc(collection(this.firestore, "posts"), {
                text,
                uid: this.uid,
                timestamp: this.timestamp,
                image: remoteUri
            });
            return docRef;
        } catch (err: any) {
            throw new Error(err.message);
        }

    }



    uploadPhtoAsync = async (uri: any) => {
        const path = `photo/${this.uid}/${Date.now()}.jpg`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri)
            const file = await response.blob()

            const storage = getStorage();
            const storageRef = ref(storage, path);
            let upload = uploadBytesResumable(storageRef, file);

            upload.on("state_changed", snapshot => { }, err => {
                rej(err)
            },
                async () => {
                    const url = await getDownloadURL(upload.snapshot.ref)
                    res(url)
                }
            )
        })
    }

    get firestore() {
        return getFirestore()
    }

    get uid() {
        return (getAuth().currentUser || {}).uid
    }

    get timestamp() {
        return Date.now()
    }

}

Fire.shared = new Fire()
export default Fire;