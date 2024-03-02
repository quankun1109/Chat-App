import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity } from 'react-native';
import { colors, fontSizes, styles } from '../constants'
import auth from '@react-native-firebase/auth';
import { UIHeader } from '../components';

function ChangePassword (props)  {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const { navigation, route } = props
  //functions of navigate to/back
  const { navigate, goBack } = navigation
  const handleChangePassword = () => {
    if (newPassword === reNewPassword) {
      const user = auth().currentUser;
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Re-authenticate user
      user.reauthenticateWithCredential(credential)
        .then(() => {
          // If re-authentication successful, update password
          user.updatePassword(newPassword)
            .then(() => {
              // Password updated successfully
              Alert.alert('Success', 'Password updated successfully!');
              navigate('Login')
              setCurrentPassword('');
              setNewPassword('');
            })
        })
        .catch((error) => {
          // Handle errors while re-authenticating user
          Alert.alert('Error', 'Incorrect current password. Please try again.');
        });
    } else {
      Alert.alert('Error', 'Re-enter the password does not match.');
    }

  };

  return (
    <View
      style={{
        flex: 100,
        backgroundColor: colors.primary
      }}>
        <View>
        <UIHeader
          title={"Informations"}
          leftIconName={"arrow-left"}
          onPressLeftIcon={() => {
            goBack();
          }}
        />
      </View>
      <View style={{
        flex: 70,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        marginVertical: 70,
      }}>
        <View style={{
          marginHorizontal: 15,
          paddingTop:15
        }}>
          <Text style={{
            fontSize: fontSizes.h6,
            color: colors.primary
          }}>Current password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Current password"
            secureTextEntry={true}
            onChangeText={setCurrentPassword}
            value={currentPassword}
          />
          <View style={{
            height: 1,
            backgroundColor: colors.primary,
            width: '100%',
            marginHorizontal: 15,
            marginBottom: 5,
            alignSelf: 'center'
          }} />
        </View>
        <View style={{
          marginHorizontal: 15
        }}>
          <Text style={{
            fontSize: fontSizes.h6,
            color: colors.primary
          }}>New password:</Text>
          <TextInput
            style={styles.input}
            placeholder="New password"
            secureTextEntry={true}
            onChangeText={setNewPassword}
            value={newPassword}
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
          }}>Retype new password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Retype new password"
            secureTextEntry={true}
            onChangeText={setReNewPassword}
            value={reNewPassword}
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
          onPress={() => {
            handleChangePassword()
          }}
          style={{
            backgroundColor: colors.primary,
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
          }}>Change password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;