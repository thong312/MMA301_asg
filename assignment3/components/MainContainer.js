import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './screens/Home';
import FavouriteScreen from './screens/Favourite';
import DetailsScreen from './screens/Detail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'FavouriteTab') {
              iconName = focused ? 'heart' : 'heart-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { height: 60 },
        })}
      >
        <Tab.Screen name="HomeTab" options={{ title: 'Home' }}>
          {() => (
            <Stack.Navigator
            screenOptions={{headerShown:false}}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Detail" component={DetailsScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="FavouriteTab" options={{ title: 'Favorites' }}>
          {() => (
            <Stack.Navigator
            screenOptions={{headerShown:false}}
            >
              <Stack.Screen name="Favourite" component={FavouriteScreen} />
              <Stack.Screen name="Detail" component={DetailsScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
