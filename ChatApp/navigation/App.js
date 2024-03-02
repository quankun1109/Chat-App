
import React, {Component, useState} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {Chat, Messenger, Welcome, Login, Register, ChangePassword} from '../screens'


const Stack = createNativeStackNavigator()
import UITab from './UITab'
function App(props) {
    return <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome' screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name={"Welcome"} component={Welcome}/>
            <Stack.Screen name={"Login"} component={Login}/>
            <Stack.Screen name={"Register"} component={Register}/>
            <Stack.Screen name={"UITab"} component={UITab}/>
            <Stack.Screen name={"Messenger"} component={Messenger}/>
            <Stack.Screen name={"ChangePassword"} component={ChangePassword}/>         
        </Stack.Navigator>
    </NavigationContainer>
}
export default App