import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import Profile from '../screens/ProfileScreen';
import TopScore from '../screens/TopScoreScreen';
import Training from '../screens/TrainingScreen';
import WeeklyPlan from '../screens/WeklyPlanScreen';
import Browse from '../screens/BrowseScreen';

const Tab = createBottomTabNavigator();

const HomeBottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'Home') {
            return (
              <Icon
                name="home"
                size={30}
                color={focused ? 'cyan' : 'darkcyan'}
              />
            );
          } else if (route.name === 'Top') {
            return (
              <Icon
                name="trophy"
                size={30}
                color={focused ? 'cyan' : 'darkcyan'}
              />
            );
          } else if (route.name === 'Exercise') {
            return (
              <Icon
                name="heartbeat"
                size={30}
                color={focused ? 'cyan' : 'darkcyan'}
              />
            );
          } else if (route.name === 'Plan') {
            return (
              <Icon
                name="calendar"
                size={30}
                color={focused ? 'cyan' : 'darkcyan'}
              />
            );
          } else if (route.name === 'Profile') {
            return (
              <Icon
                name="user"
                size={30}
                color={focused ? 'cyan' : 'darkcyan'}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: 'cyan',
        inactiveTintColor: 'darkcyan',
        style: {backgroundColor: '#333332', height: 60},
        labelStyle: {fontSize: 14},
      }}>
      <Tab.Screen name="Top" component={TopScore} />
      <Tab.Screen name="Exercise" component={Training} />
      <Tab.Screen name="Home" component={Browse} />
      <Tab.Screen name="Plan" component={WeeklyPlan} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default HomeBottomTabs;
