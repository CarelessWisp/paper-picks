import { Platform } from 'react-native';
import { Alert } from 'react-native';

export default function showAlert(title: string, message?: string) {
    if (Platform.OS === 'web') {
        window.alert(`${title}\n${message}`);
    } else {
        Alert.alert(title, message);
    }
}
