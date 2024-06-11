import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TopTab, TopTabNavigator } from './TopTabStack';
import { StyleSheet, View } from 'react-native';
import { AntDesign, FontAwesome6, Feather } from '@expo/vector-icons';
import Chat from '../screens/Chat';
import PostModal from '../screens/Post';
import Messages from '../screens/Messages';
import Profile from '../screens/Profile';

const BottomTab = createBottomTabNavigator();

export function HomeStack() {
    return (
        <BottomTab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#121212', borderTopWidth: 0, },
                tabBarActiveTintColor: '#FF3040',
                tabBarInactiveTintColor: '#4D4D4D',
                tabBarShowLabel: false,
            }}
        >
            <TopTab.Screen
                name='Home'
                component={TopTabNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <AntDesign name="home" size={24} color="#4D4D4D" />
                            {focused && <View style={styles.activeIndicator} />}
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                name='Search'
                component={Chat}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <AntDesign name="search1" size={24} color="#4D4D4D" />
                            {focused && <View style={styles.activeIndicator} />}
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                name='PostModal'
                component={PostModal}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <FontAwesome6 name="plus" size={24} color="#4D4D4D" />
                            {focused && <View style={styles.activeIndicator} />}
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                name='Chat'
                component={Messages}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Feather name="message-square" size={24} color="#4D4D4D" />
                            {focused && <View style={styles.activeIndicator} />}
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                name='Profile'
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Feather name="user" size={24} color="#4D4D4D" />
                            {focused && <View style={styles.activeIndicator} />}
                        </View>
                    ),
                }}
            />
        </BottomTab.Navigator>
    );
}



const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIndicator: {
        width: 5,
        height: 5,
        borderRadius: 5,
        backgroundColor: '#FF3040',
        position: 'absolute',
        bottom: -12,
    },
});