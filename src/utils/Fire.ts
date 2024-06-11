import { initializeApp } from "firebase/app";
import { auth, firebaseConfig } from "../config/firebase";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

class Fire {
    static shared: Fire;

    constructor() {
        initializeApp(firebaseConfig);
    }

    addPost = async ({ text, localUri }: any) => {
        const { remoteUri, mediaType } = await this.uploadMediaAsync(localUri);
        const userId = this.uid;

        if (!userId) {
            throw new Error("User is not authenticated");
        }

        try {
            const userDoc = await getDoc(doc(this.firestore, "users", userId));
            if (!userDoc.exists()) {
                throw new Error("User data not found");
            }
            const userData = userDoc.data();
            const docRef = await addDoc(collection(this.firestore, "posts"), {
                text,
                uid: this.uid,
                timestamp: this.timestamp,
                media: remoteUri,
                mediaType: mediaType,
                userAvatar: userData?.avatar || null,
                userName: userData?.name || 'Unknown',
                userEmail: userData?.email || 'Unknown'
            });
            return docRef;
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    uploadMediaAsync = async (uri: string): Promise<{ remoteUri: string, mediaType: string }> => {
        const mediaType = this.getMediaType(uri);
        const extension = mediaType === 'video' ? 'mp4' : 'jpg';
        const path = `media/${this.uid}/${Date.now()}.${extension}`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            const storage = getStorage();
            const storageRef = ref(storage, path);
            let upload = uploadBytesResumable(storageRef, file);

            upload.on("state_changed",
                snapshot => { },
                err => rej(err),
                async () => {
                    const url = await getDownloadURL(upload.snapshot.ref);
                    res({ remoteUri: url, mediaType: mediaType });
                }
            );
        });
    };

    uploadPhotoAsync = async (uri: string, fileName: string) => {
        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            const storage = getStorage();
            const storageRef = ref(storage, fileName);
            let upload = uploadBytesResumable(storageRef, file);

            upload.on("state_changed",
                snapshot => { },
                err => rej(err),
                async () => {
                    const url = await getDownloadURL(upload.snapshot.ref);
                    res(url);
                }
            );
        });
    };

    createUser = async (user: any) => {
        let remoteUri = null;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const userId = userCredential.user.uid;

            const db = getFirestore();
            const userDocRef = doc(collection(db, "users"), userId);

            await setDoc(userDocRef, {
                id: userId,
                name: user.name,
                email: user.email,
                avatar: null
            });

            if (user.avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${userId}`);
                await setDoc(userDocRef, { avatar: remoteUri }, { merge: true });
            }
        } catch (error) {
            console.error("Error creating user: ", error);
        }
    };

    getMediaType = (uri: string) => {
        const extension = uri.split('.').pop();
        if (extension && ['jpg', 'jpeg', 'png', 'gif'].includes(extension.toLowerCase())) {
            return 'image';
        } else if (extension && ['mp4', 'mov', 'avi', 'mkv'].includes(extension.toLowerCase())) {
            return 'video';
        }
        return 'unknown';
    };

    signOut = () => {
        auth.signOut();
    };

    get firestore() {
        return getFirestore();
    }

    get uid() {
        const currentUser = getAuth().currentUser;
        return currentUser ? currentUser.uid : null;
    }

    get timestamp() {
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;