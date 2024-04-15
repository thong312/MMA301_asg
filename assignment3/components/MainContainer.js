import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './screens/Home';
import FavouriteScreen from './screens/Favourite';

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Favourite') {
              iconName = focused ? 'heart' : 'heart-outline';
            }

            // Return the icon component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { height: 60 },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Favourite" component={FavouriteScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
