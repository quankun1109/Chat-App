import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../constants/styles';
import database from '@react-native-firebase/database';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { UIHeader } from '../components';
import screenWidth from '../utilies/Device'

function Profile(props) {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userGmail, setUserGmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChangeAvatarButtons, setShowChangeAvatarButtons] = useState(false);
  const [newLink, setNewLink] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [userData, setUserData] = useState(null); // Thêm state để lưu trữ dữ liệu user
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const imagesRef = database().ref('images');
    const listener = imagesRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const keys = Object.keys(data);
        const lastImageUrl = data[keys[keys.length - 1]];
        setImageUrl(lastImageUrl);
      }
    });

    return () => imagesRef.off('value', listener);
  }, []);

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    launchImageLibrary(options, response => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        const source = { uri: selectedImage.uri };
        setImage(source);
      } else {
      }
    });
  };

  const uploadImage = async () => {
    if (!image) {
      return;
    }

    const { uri } = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri : 'file://' + uri; 
    setTransferred(0);

    try {
      const response = await fetch(uploadUri);
      const blob = await response.blob();
      const ref = storage().ref().child(`images/${filename}`);
      await ref.put(blob);
      const url = await ref.getDownloadURL();
      await database().ref(`users/${userId}`).update({
        avatarUrl: url
      });
      setImage(null);
      setUploading(false);
      Alert.alert(
        'Success',
        'Avatar has been updated!'
      );
    } catch (error) {
      console.error(error);
      setUploading(false);
      Alert.alert('Error', 'Failed to upload image and save URL to Realtime Database');
    }
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleChangeAvatarButtons = () => {
    setShowChangeAvatarButtons(!showChangeAvatarButtons);
  };

  const toggleTextInput = () => {
    setShowTextInput(!showTextInput);
  };

  const toggleUpload = () => {
    setUploading(!uploading);
  };

  const handleSubmitNewLink = () => {
    if (newLink.trim() === '') {
      return;
    }
    if (!userData) {
      console.error('User data is not available');
      return;
    }

    database().ref(`users/${userId}`).update({
      avatarUrl: newLink
    })
      .then(() => {
        Alert.alert(
          'Success',
          'Avatar has been updated!'
        );
        setNewLink(''); 
        setShowTextInput(false);
        setShowChangeAvatarButtons(false)
      })
      .catch((error) => {
        console.error('Error saving user data:', error);
      });
  };

  const { navigation, route } = props;
  //functions of navigate to/back
  const { navigate, goBack } = navigation;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stringUser = await AsyncStorage.getItem('user');
        const userData = JSON.parse(stringUser);
        setUserId(userData.uid);
        setUserGmail(userData.email);
        setUserData(userData); 
        const userNameRef = database().ref(`users/${userData.uid}/username`);
        userNameRef.on('value', (snapshot) => {
          if (snapshot.exists()) {
            const userName = snapshot.val();
            setUserName(userName);
          } else {
          }
        });

        const avatarRef = database().ref(`users/${userData.uid}/avatarUrl`);
        avatarRef.on('value', (snapshot) => {
          if (snapshot.exists()) {
            const avatarUrl = snapshot.val();
            setAvatarUrl(avatarUrl);
          } else {
          }
        });
      } catch (error) {
      }
    };
    fetchData();
  }, []);
  const handleImageSelectionAndUpload = () => {
    selectImage();
    toggleUpload();
  };
  return (
    <View style={{
      flex: 1,
    }}>
      <View style={{ width: screenWidth }}>
        <UIHeader
          title={"Informations"}
          leftIconName={"arrow-left"}
          onPressLeftIcon={() => {
            goBack();
          }}
        />
      </View>
      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 30
      }}>
        {!isExpanded && !showTextInput && (
          <>
            <Image source={{ uri: avatarUrl }} style={{
              width: 170,
              height: 170,
              borderRadius: 100,
            }} />
            <View>
              <Text style={{
                fontSize: 25,
                marginTop: 20,
                marginStart: 35
              }}>{userName}</Text>
              <Text style={{
                marginStart: 10
              }}>{userGmail}</Text>
            </View>
            <View style={styles.container}>
              <TouchableOpacity onPress={toggleExpansion} style={[styles.button, styles.viewAvatarButton]}>
                <Text style={styles.buttonText}>Xem avatar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleChangeAvatarButtons} style={[styles.button, styles.changeAvatarButton]}>
                <Text style={styles.buttonText}>Thay đổi avatar</Text>
              </TouchableOpacity>
            </View>

            {showChangeAvatarButtons && (
              <View style={styles.changeAvatarButtonContainer}>
                <TouchableOpacity onPress={toggleTextInput} style={[styles.button, styles.buttonSpacing]}>
                  <Text style={styles.buttonText}>Link mới</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleImageSelectionAndUpload} style={styles.button}>
                  <Text style={styles.buttonText}>Tải ảnh mới</Text>
                </TouchableOpacity>
              </View>
            )}

          </>
        )}
        {showTextInput && (
          <View style={{
            flex: 1,
            alignItems: 'center',
            marginTop: 170
          }}>
            <TouchableOpacity onPress={toggleChangeAvatarButtons} style={[styles.button, styles.changeAvatarButton]}>
              <Text style={styles.buttonText}>Thay đổi avatar</Text>
            </TouchableOpacity>
            <View style={styles.changeAvatarButtonContainer}>
              <TouchableOpacity onPress={toggleTextInput} style={[styles.button, styles.buttonSpacing]}>
                <Text style={styles.buttonText}>Link mới</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Tải ảnh mới</Text>
              </TouchableOpacity>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 0.25,
              marginHorizontal: 10
            }}>
              <TextInput
                style={styles.newLinkInput}
                value={newLink}
                onChangeText={setNewLink}
                placeholder="Nhập đường link mới"
                autoFocus
              />
              <TouchableOpacity onPress={handleSubmitNewLink}>
                <Icon name='paper-plane' size={30} color={'black'} />
              </TouchableOpacity>
            </View>

          </View>
        )}
        {isExpanded && (
          <View style={styles.expandedImageContainer}>
            <TouchableOpacity onPress={toggleExpansion}>
              <Image source={{ uri: avatarUrl }} style={styles.expandedAvatar} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        )}
        {uploading && (
          <TouchableOpacity onPress={uploadImage}>
            <Icon name='paper-plane' size={30} color={'black'} />
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

export default Profile;