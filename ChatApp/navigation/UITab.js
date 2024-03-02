
import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5' 
import {Chat, Profile, Setting} from '../screens'
import {Test} from '../screens'
import {colors, fontSizes} from '../constants'

const Tab = createBottomTabNavigator();

function UITab() {
  const screenOptions = ({route})=> ({
    headerShown: false,
    tabBarActiveTintColor: 'white',
    tabBarInactiveTintColor: colors.inactive,    
    tabBarActiveBackgroundColor: colors.primary,
    tabBarInactiveBackgroundColor: colors.primary,
    tabBarBackground: () => (
        <View style={{backgroundColor: colors.primary, flex: 1}}></View>
      ),
    tabBarIcon: ({focused, color, size}) => {

        return <Icon 
            style={{
                paddingTop: 5
            }}
            name= {route.name == "ProductGridView" ? "align-center":
                (route.name == "Chat" ? "accusoft" : (
                    route.name == "Setting" ? "cogs" : 
                    (route.name == "Profile" ? "user" : 
                    (route.name == "Chat" ? "comment-dots" : ""))
                ))}
            size={23} 
            color={focused ? 'white' : colors.inactive} 
        />
    },    
})
  return (
    //<NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen name="Profile" component={Profile} />
        <Tab.Screen name="Setting" component={Setting} />

        {/* Add more screens here */}
      </Tab.Navigator>
    //</NavigationContainer>
  );
}

export default UITab;