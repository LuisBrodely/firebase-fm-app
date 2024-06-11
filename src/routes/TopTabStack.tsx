import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from '../screens/Home';


export const TopTab = createMaterialTopTabNavigator();

export function TopTabNavigator() {
    return (
        <TopTab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#121212',
                    paddingTop: 58
                },
                tabBarActiveTintColor: '#F1F1F1',
                tabBarInactiveTintColor: '#4D4D4D',
                tabBarIndicatorStyle: { backgroundColor: '#F1F1F1', height: 2 },
            }}
        >
            <TopTab.Screen name="For you" component={Home} />
            <TopTab.Screen name="Following" component={Home} />
        </TopTab.Navigator>
    );
};