import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

import { images, colors, fontSizes } from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { isValidEmail, isValidPassword } from '../utilies/Validation'
function Login(props) {
    const [keyboardIsShown, setKeyboardIsShown] = useState(false)
    //states for validating
    const [errorEmail, setErrorEmail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    //states to store email/password
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userId, setUserId] = useState('')
    const isValidationOK = () => email.length > 0 && password.length > 0
        && isValidEmail(email) == true
        && isValidPassword(password) == true

    useEffect(() => {
        //componentDidMount
        Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardIsShown(true)
        })
        Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardIsShown(false)
        })
    })
    useEffect(() => {
        // Check if userId is already stored in AsyncStorage
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    setUserId(storedUserId);
                }
            } catch (error) {
                console.error('Error fetching userId from AsyncStorage:', error);
            }
        };

        fetchUserId();
    }, []);
    const handleLogin = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                AsyncStorage.setItem('user', JSON.stringify(user));
                console.log(user)
                setUserId(user.uid);
                console.log('User logged in successfully!');
                navigate('UITab')
                // You can navigate to another screen or perform any other action here upon successful login
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error logging in:', errorCode, errorMessage);
                alert('Error', 'Invalid email or password. Please try again.');
            });
    };
    //navigation
    const { navigation, route } = props
    //functions of navigate to/back
    const { navigate, goBack } = navigation

    return <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
            flex: 100,
            backgroundColor: 'white'
        }}>
        <View style={{
            flex: 30,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
        }}>
            <Text style={{
                color: 'black',
                fontSize: fontSizes.h2,
                fontWeight: 'bold',
                width: '50%'
            }}>Already have an Account?</Text>
            <Image
                tintColor={colors.primary}
                source={
                    images.computer
                } style={{
                    width: 120,
                    height: 120,
                    alignSelf: 'center'
                }} />
        </View>
        <View style={{
            flex: 30
        }}>
            <View style={{
                marginHorizontal: 15
            }}>
                <Text style={{
                    fontSize: fontSizes.h4,
                    color: colors.primary
                }}>Email:</Text>
                <TextInput
                    onChangeText={(text) => {
                        /*
                       if(isValidEmail(text) == false) {
                           setErrorEmail('Email not in correct format')
                       } else {
                           setErrorEmail('')
                       }
                       */
                        setErrorEmail(isValidEmail(text) == true ?
                            '' : 'Email not in correct format')
                        setEmail(text)
                    }}
                    style={{
                        color: 'black'
                    }}
                    keyboardType='email-address'
                    placeholder='example@gmail.com'
                    value={email}
                    placeholderTextColor={colors.placeholder}
                />
                <View style={{
                    height: 1,
                    backgroundColor: colors.primary,
                    width: '100%',
                    marginHorizontal: 15,
                    marginBottom: 5,
                    alignSelf: 'center'
                }} />
                <Text style={{
                    color: 'red',
                    fontSize: fontSizes.h4,
                    marginBottom: 15,
                }}>{errorEmail}</Text>
            </View>
            <View style={{
                marginHorizontal: 15
            }}>
                <Text style={{
                    fontSize: fontSizes.h4,
                    color: colors.primary
                }}>Password:</Text>
                <TextInput
                    onChangeText={(text) => {
                        setErrorPassword(isValidPassword(text) == true ?
                            '' : 'Password must be at least 3 characters')
                        setPassword(text)
                    }}
                    style={{
                        color: 'black'
                    }}
                    secureTextEntry={true}
                    placeholder='Enter your password'
                    value={password}
                    placeholderTextColor={colors.placeholder}
                />
                <View style={{
                    height: 1,
                    backgroundColor: colors.primary,
                    width: '100%',
                    marginBottom: 15,
                    marginHorizontal: 15,
                    alignSelf: 'center'
                }} />
                <Text style={{
                    color: 'red',
                    fontSize: fontSizes.h4,
                    marginBottom: 15,
                }}>{errorPassword}</Text>
            </View>
        </View>
        {keyboardIsShown == false ? <View style={{
            flex: 15
        }}>
            <TouchableOpacity
                disabled={isValidationOK() == false}
                onPress={() => {
                    handleLogin()
                }}
                style={{
                    backgroundColor: isValidationOK() == true
                        ? colors.primary : colors.inactive,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%',
                    alignSelf: 'center',
                    borderRadius: 18
                }}>
                <Text style={{
                    padding: 8,
                    fontSize: fontSizes.h3,
                    color: 'white'
                }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    navigate('Register')
                }}
                style={{
                    padding: 5,
                    marginTop: 15
                }}>
                <Text style={{
                    padding: 8,
                    fontSize: fontSizes.h4,
                    color: colors.primary,
                    alignSelf: 'center',
                }}>New user? Register now</Text>
            </TouchableOpacity>
        </View> : <View style={{
            flex: 15
        }}></View>}
        {keyboardIsShown == false ? <View style={{
            flex: 25,
        }}>
            <View style={{
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 20
            }}>
                <View style={{ height: 1, backgroundColor: 'black', flex: 1 }} />
                <Text style={{
                    padding: 8,
                    fontSize: fontSizes.h5,
                    color: 'black',
                    alignSelf: 'center',
                    marginHorizontal: 5,
                }}>Use other methods ?</Text>
                <View style={{ height: 1, backgroundColor: 'black', flex: 1 }} />
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center'
            }}>
                <Icon name='facebook' size={35} color={colors.facebook} />
                <View style={{ width: 15 }} />
                <Icon name='google' size={35} color={colors.google} />
            </View>

        </View> : <View style={{
            flex: 25,
        }}></View>}
    </KeyboardAvoidingView>
}
export default Login

