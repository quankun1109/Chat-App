import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform
} from 'react-native'
import {images,icons, colors, fontSizes, styles } from '../constants'
import { UIButton } from '../components'
import Icon from 'react-native-vector-icons/FontAwesome5'

function Welcome(props) {
    //navigation
    const { navigation, route } = props
    //functions of navigate to/back
    const { navigate, goBack } = navigation
    return <View style={{
        backgroundColor: colors.primary,
        flex: 100,
    }}>
        <View style={{
            flex: 10,
        }}>
            <View style={{
                flexDirection: 'row',
                height: 50,
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}>
                <Image
                    source={icons.fire}
                    style={{
                        marginStart: 10,
                        marginEnd: 5,
                        width: 30,
                        height: 30,
                    }}
                />
                <Text style={{
                    color: 'white'
                }}>YOURCOMPANY.CO</Text>
                <View style={{ flex: 1 }} />
                <Icon name={'question-circle'}
                    color={'white'}
                    size={20}
                    style={{
                        marginEnd: 20
                    }}
                />

            </View>
        </View>

        <View style={{
            flex: 70,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }} >
            <Text style={{
                marginBottom: 7,
                color: 'white',
                fontSize: fontSizes.h4
            }}>Welcome to</Text>
            <Text style={{
                marginBottom: 7,
                color: 'white',
                fontWeight: 'bold',
                fontSize: fontSizes.h3,
            }}>CHAT APP!</Text>
            <Image
            source={images.welcome}
            style={{
                width: 300,
                height: 430,
                marginEnd: 10
            }}
        />
        </View>
        

        <View style={{
            flex: 20,
        }}>
            <UIButton
                onPress={() => {
                    navigate('Login')
                }}
                title={'Login'.toUpperCase()} />
            <Text style={{
                color: 'white',
                fontSize: fontSizes.h5,
                alignSelf: 'center'
            }}>Want to register new Account ?</Text>
            <TouchableOpacity
                onPress={() => {
                    //alert('press register')
                    navigate('Register')
                }}
                style={{
                    padding: 5
                }
                }>
                <Text style={{
                    color: colors.outstanding,
                    fontSize: fontSizes.h4,
                    alignSelf: 'center',
                    textDecorationLine: 'underline',
                }}>Register</Text>
            </TouchableOpacity>
        </View>
    </View>
}
export default Welcome


