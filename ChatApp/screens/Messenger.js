import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images, colors, icons, fontSizes, styles } from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome5'
import UIHeader from '../components/UIHeader'
import moment from 'moment';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';


function Messenger(props) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [senderAvatarUrl, setSenderAvatarUrl] = useState('');
  const [receiverAvatarUrl, setReceiverAvatarUrl] = useState('');
  const [userId, setUserId] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(null);
  const [myFriendUserName, setMyFriendUserName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { navigation, route } = props
  const { navigate, goBack } = navigation

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setSelectedImage(selectedImage);
      } else {
        console.log('User cancelled image picker or no image selected');
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stringUser = await AsyncStorage.getItem('user');
        const userData = JSON.parse(stringUser);
        setUserId(userData.uid);

        // Fetch sender avatar
        const senderAvatarRef = database().ref(`users/${userData.uid}/avatarUrl`);
        senderAvatarRef.on('value', (snapshot) => {
          if (snapshot.exists()) {
            const senderAvatarUrl = snapshot.val();
            setSenderAvatarUrl(senderAvatarUrl);
          } else {
            console.log('Sender Avatar Snapshot does not exist or has an invalid value');
          }
        });

        // Fetch receiver avatar
        const myFriendUserId = props.route.params.user.userId;
        const myFriendRef = database().ref(`users/${myFriendUserId}`);
        myFriendRef.on('value', (snapshot) => {
          if (snapshot.exists()) {
            const myFriendData = snapshot.val();
            const myFriendUserName = myFriendData.username;
            setMyFriendUserName(myFriendUserName);

            const receiverAvatarRef = database().ref(`users/${myFriendUserId}/avatarUrl`);
            receiverAvatarRef.on('value', (snapshot) => {
              if (snapshot.exists()) {
                const receiverAvatarUrl = snapshot.val();
                setReceiverAvatarUrl(receiverAvatarUrl);
              } else {
                console.log('Receiver Avatar Snapshot does not exist or has an invalid value');
              }
            });

            // Fetch messages
            const chatId = userData.uid < myFriendUserId ? `${userData.uid}-${myFriendUserId}` : `${myFriendUserId}-${userData.uid}`;
            const reference = database().ref(`chats/${chatId}`);
            const onMessage = reference.on('value', snapshot => {
              if (snapshot.exists()) {
                const data = snapshot.val();
                const messagesArray = Object.keys(data)
                  .map(key => {
                    const message = data[key];
                    const readBy = message.readBy || {};
                    if (!readBy.hasOwnProperty(myFriendUserId)) {
                      readBy[myFriendUserId] = false;
                      database().ref(`chats/${chatId}/${key}/readBy`).set(readBy);
                    }
                    return {
                      _id: key,
                      text: message.text,
                      userId: message.userId,
                      createdAt: message.createdAt,
                      imageUrl: message.imageUrl,
                      readBy: message.readBy || {}
                    };
                  })
                  .sort((a, b) => b.createdAt - a.createdAt);

                let unreadMessagesCount = 0;
                messagesArray.forEach(message => {
                  const readBy = message.readBy || {};
                  if (!readBy[myFriendUserId]) {
                    unreadMessagesCount++;
                  }
                });
                setMessages(messagesArray);
                setUnreadMessagesCount(unreadMessagesCount);
              }
            });
            return () => reference.off('value', onMessage);
          } else {
            console.error('userId is null or undefined');
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [props.route.params.user.userId]);
  const handleSend = async () => {
    if (input.trim() === '' && !selectedImage) {
      return;
    }
    const { uid } = auth().currentUser;
    const myFriendUserId = props.route.params.user.userId;
    const chatId = userId < myFriendUserId ? `${userId}-${myFriendUserId}` : `${myFriendUserId}-${userId}`;

    if (selectedImage) {
      const { uri } = selectedImage;
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

      try {
        const response = await fetch(uploadUri);
        const blob = await response.blob();
        const imageRef = storage().ref().child(`images/${filename}`);
        await imageRef.put(blob);
        const imageUrl = await imageRef.getDownloadURL();
        await database().ref(`chats/${chatId}`).push({
          text: '',
          imageUrl: imageUrl,
          userId: uid,
          createdAt: new Date().getTime(),
          readBy: {
            [userId]: true,
            [myFriendUserId]: false
          }
        });
        setSelectedImage(null);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to upload image and save URL to Realtime Database');
      }
    } else {
      await database().ref(`chats/${chatId}`).push({
        text: input,
        userId: uid,
        createdAt: new Date().getTime(),
        readBy: {
          [userId]: true,
          [myFriendUserId]: false
        }
      });
    }
    setInput('');
    const unreadMessagesRef = database().ref(`unreadMessages/${myFriendUserId}/${userId}`);
    unreadMessagesRef.transaction(currentCount => (currentCount || 0) + 1);
  };

  const renderMessage = ({ item, index }) => {
    const showAvatar = index === 0 || moment(item.createdAt).diff(moment(messages[index - 1].createdAt), 'minutes') > 10 || messages[index - 1].userId !== item.userId;
    return (
      <View>
        {item.userId === userId ? (
          <View style={styles.senderMessage}>
            <View style={[styles.messageContent, { marginRight: showAvatar ? 10 : 50 }]}>
              {item.imageUrl ? ( 
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.imageUrl }} style={styles.imageBox} />
                </View>
              ) : null}
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
            {showAvatar && <Image source={{ uri: senderAvatarUrl }} style={styles.avatar} />}
          </View>
        ) : (
          <View style={styles.receiverMessage}>
            {showAvatar && <Image source={{ uri: receiverAvatarUrl }} style={styles.avatar} />}
            <View style={[styles.messageContent, { marginLeft: showAvatar ? 10 : 50 }]}>
              {item.imageUrl ? ( 
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.imageUrl }} style={styles.imageBox} />
                </View>
              ) : null}
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <UIHeader
        title={`${myFriendUserName}`}
        leftIconName={"arrow-left"}
        rightIconName={"search"}
        onPressLeftIcon={() => {
          goBack()
        }}
        onPressRightIcon={() => {
          alert('press right icon')
        }}
      />
      <View style={{ flex: 1, padding: 20 }}>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item._id}
          inverted
        />
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <TouchableOpacity onPress={selectImage}>
            <Icon name="image" size={35} color="red" style={{ paddingRight: 15 }} />
          </TouchableOpacity>
          <TextInput
            style={styles.newLinkInput}
            value={input}
            onChangeText={setInput}
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </View>
    </View>
  );
};

export default Messenger;