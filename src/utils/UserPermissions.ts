import Constants from 'expo-constants'
import * as MediaLibrary from 'expo-media-library'

class UserPermissions {
    static shared: UserPermissions;
    getPhotoPermissions = async () => {
        if (Constants.platform?.ios) {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                alert('We need permissions to access your camera roll');
            }
        }
    }
}

UserPermissions.shared = new UserPermissions();
export default UserPermissions;