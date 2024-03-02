import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { isValidEmail, isValidPassword } from '../utilies/Validation'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { colors, fontSizes } from '../constants'

function Register(props) {
    const [keyboardIsShown, setKeyboardIsShown] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    const isValidationOK = () => email.length > 0 && password.length > 0
        && isValidEmail(email) == true
        && isValidPassword(password) == true
        && password == retypePassword

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardIsShown(true)
        })
        Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardIsShown(false)
        })
    })

    const { navigation, route } = props
    //functions of navigate to/back
    const { navigate, goBack } = navigation

    const handleRegister = () => {
        auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                const finalAvatarUrl = avatarUrl || 'https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png';
                // Save additional data to Firebase Realtime Database
                database().ref('users/' + user.uid).set({
                    email: email,
                    password: password,
                    avatarUrl: finalAvatarUrl,
                    userId: user.uid,
                    username: username
                })
                    .then(() => {
                        console.log('User data saved successfully');
                    })
                    .catch((error) => {
                        console.error('Error saving user data:', error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error registering:', errorCode, errorMessage);
            });
    };

    return (
        <View
            style={{
                flex: 100,
                backgroundColor: colors.primary
            }}>
            {keyboardIsShown == false ? <View style={{
                flex: 15,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <Text style={{
                    color: 'white',
                    fontSize: fontSizes.h2,
                    fontWeight: 'bold',
                    width: '50%'
                }}>Already have an Account?</Text>
                <Icon name='user-plus' size={50} color='white' paddingEnd={10} />
            </View> : <View style={{
                flex: 10,
            }}></View>}
            <View style={{
                flex: 70,
                backgroundColor: 'white',
                padding: 10,
                margin: 10,
                borderRadius: 20,
            }}>
                <View style={{
                    marginHorizontal: 15
                }}>
                    <Text style={{
                        fontSize: fontSizes.h6,
                        color: colors.primary
                    }}>Email:</Text>
                    <TextInput
                        onChangeText={(text) => {
                            setErrorEmail(isValidEmail(text) == true ?
                                '' : 'Email not in correct format')
                            setEmail(text)
                        }}
                        style={{
                            color: 'black'
                        }}
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
                        fontSize: fontSizes.h6,
                        marginBottom: 10,
                    }}>{errorEmail}</Text>
                </View>
                <View style={{
                    marginHorizontal: 15
                }}>
                    <Text style={{
                        fontSize: fontSizes.h6,
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
                        value={password}
                        placeholder='Enter your password'
                        placeholderTextColor={colors.placeholder}
                    />
                    <View style={{
                        height: 1,
                        backgroundColor: colors.primary,
                        width: '100%',
                        marginBottom: 10,
                        marginHorizontal: 15,
                        alignSelf: 'center'
                    }} />
                    <Text style={{
                        color: 'red',
                        fontSize: fontSizes.h6,
                        marginBottom: 15,
                    }}>{errorPassword}</Text>
                </View>
                <View style={{
                    marginHorizontal: 15,
                }}>
                    <Text style={{
                        fontSize: fontSizes.h6,
                        color: colors.primary
                    }}>Retype password:</Text>
                    <TextInput
                        onChangeText={(text) => {
                            setErrorPassword(isValidPassword(text) == true ?
                                '' : 'Password must be at least 3 characters')
                            setRetypePassword(text)
                        }}
                        style={{
                            color: 'black'
                        }}
                        value={retypePassword}
                        secureTextEntry={true}
                        placeholder='Re-Enter your password'
                        placeholderTextColor={colors.placeholder}
                    />
                    <View style={{
                        height: 1,
                        backgroundColor: colors.primary,
                        width: '100%',
                        marginBottom: 10,
                        marginHorizontal: 15,
                        alignSelf: 'center'
                    }} />
                    <Text style={{
                        color: 'red',
                        fontSize: fontSizes.h6,
                        marginBottom: 5,
                    }}>{errorPassword}</Text>
                </View>
                <View style={{
                    marginHorizontal: 15,
                }}>
                    <Text style={{
                        fontSize: fontSizes.h6,
                        color: colors.primary
                    }}>User Name:</Text>
                    <TextInput
                        onChangeText={(text) => {
                            setUsername(text)
                        }}
                        style={{
                            color: 'black'
                        }}
                        value={username}
                        placeholder='Enter your user name'
                        placeholderTextColor={colors.placeholder}
                    />
                    <View style={{
                        height: 1,
                        backgroundColor: colors.primary,
                        width: '100%',
                        marginBottom: 10,
                        marginHorizontal: 15,
                        alignSelf: 'center'
                    }} />
                </View>
                <View style={{
                    marginHorizontal: 15,
                }}>
                    <Text style={{
                        fontSize: fontSizes.h6,
                        color: colors.primary
                    }}>Avatar Url:</Text>
                    <TextInput
                        onChangeText={(text) => {
                            setAvatarUrl(text)
                        }}
                        style={{
                            color: 'black'
                        }}
                        value={avatarUrl}
                        placeholder='Enter your avatar url'
                        placeholderTextColor={colors.placeholder}
                    />
                    <View style={{
                        height: 1,
                        backgroundColor: colors.primary,
                        width: '100%',
                        marginBottom: 10,
                        marginHorizontal: 15,
                        alignSelf: 'center'
                    }} />
                </View>
                <TouchableOpacity
                    disabled={isValidationOK() == false}
                    onPress={() => {
                        handleRegister()
                        navigate('Login')
                        alert('Registration was successful')

                    }}
                    style={{
                        backgroundColor: isValidationOK() == true
                            ? colors.primary : colors.inactive,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '50%',
                        alignSelf: 'center',
                        borderRadius: 18,
                        marginTop: 65
                    }}>
                    <Text style={{
                        padding: 8,
                        fontSize: fontSizes.h3,
                        color: 'white'
                    }}>Register</Text>
                </TouchableOpacity>
            </View>

            {keyboardIsShown == false ? <View style={{
                flex: 15,
                marginTop: 70
            }}>
                <View style={{
                    height: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 20
                }}>
                    <View style={{ height: 1, backgroundColor: 'white', flex: 1 }} />
                    <Text style={{
                        padding: 8,
                        fontSize: fontSizes.h5,
                        color: 'white',
                        alignSelf: 'center',
                        marginHorizontal: 5,
                    }}>Use other methods ?</Text>
                    <View style={{ height: 1, backgroundColor: 'white', flex: 1 }} />
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
        </View>
    );
};

export default Register;