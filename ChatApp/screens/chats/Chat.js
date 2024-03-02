import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native'
import { colors, fontSizes } from '../../constants/index'
import Icon from 'react-native-vector-icons/FontAwesome5'
import ChatItem from './ChatItem'
import UIHeader from '../../components/UIHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import database from '@react-native-firebase/database';
import {
    firebaseDatabaseRef,
    firebaseDatabase,
    onValue,
} from '../../firebase/Firebase'
import { useFocusEffect } from '@react-navigation/native';

function Chat(props) {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState(null);
    const [searchText, setSearchText] = useState('')

    const filteredUsers = () => users.filter(eachUser => eachUser.name.toLowerCase()
        .includes(searchText.toLowerCase()))
    const { navigation, route } = props
    const { navigate, goBack } = navigation
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    const stringUser = await AsyncStorage.getItem('user');
                    const userData = JSON.parse(stringUser);
                    setUserId(userData.uid);
                    if (userData.uid !== null) {
                        setLoading(true);
                        onValue(firebaseDatabaseRef(firebaseDatabase, 'users'), async (snapshot) => {
                            if (snapshot.exists()) {
                                let snapshotObject = snapshot.val();
                                const updatedUsers = Object.keys(snapshotObject)
                                    .filter(item => item !== userData.uid)
                                    .map(eachKey => {
                                        let eachObject = snapshotObject[eachKey];
                                        return {
                                            url: eachObject.avatarUrl,
                                            name: eachObject.username,
                                            email: eachObject.email,
                                            avatarUrl: eachObject.avatarUrl,
                                            numberOfUnreadMessages: 0,
                                            userId: eachKey
                                        };
                                    });

                                const unreadMessagesSnapshot = await database().ref(`unreadMessages/${userData.uid}`).once('value');
                                const unreadMessagesData = unreadMessagesSnapshot.val();
                                updatedUsers.forEach(user => {
                                    const unreadCount = unreadMessagesData?.[user.userId] || 0;
                                    user.numberOfUnreadMessages = unreadCount;
                                });

                                setUsers(updatedUsers);
                                setLoading(false);
                            }
                        });
                    } else {
                        console.log('userId not found in AsyncStorage');
                    }
                } catch (error) {
                    console.error('Error retrieving userId from AsyncStorage: ', error);
                }
            };

            fetchData();

            return () => {
            };
        }, [])
    );
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }
    return <View style={{
        flex: 1,
    }}>
        <UIHeader
            title={"Notifications"}
            leftIconName={"arrow-left"}
            rightIconName={"search"}
            onPressLeftIcon={() => {
                goBack()
            }}
            onPressRightIcon={() => {
                alert('press right icon')
            }}
        />
        <View style={{
            marginHorizontal: 10,
            marginVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <Icon
                name='search'
                size={15} color={'black'}
                style={{
                    position: 'absolute',
                    top: 12,
                    left: 10
                }}
            />
            <TextInput
                autoCorrect={false}
                onChangeText={(text) => {
                    setSearchText(text)
                }}
                style={{
                    backgroundColor: colors.secondary,
                    height: 40,
                    flex: 1,
                    marginEnd: 8,
                    borderRadius: 5,
                    opacity: 0.8,
                    paddingStart: 30
                }} />
            <Icon name='bars' size={30} color={'black'} />
        </View>
        <View style={{
            height: 100,
        }}>
            <View style={{
                height: 1,
                backgroundColor: colors.inactive,
            }} />
            <FlatList
                horizontal
                data={users}
                keyExtractor={item => item.name}
                renderItem={({ item }) => {
                    return <TouchableOpacity
                        onPress={() => {
                            navigate('Messenger', { user: item });
                        }}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                resizeMode: 'cover',
                                borderRadius: 25,
                                margin: 10
                            }}
                            source={{
                                uri: item.url
                            }} />
                        <Text style={{
                            color: 'black',
                            fontSize: fontSizes.h6
                        }}>{item.name}</Text>
                    </TouchableOpacity>
                }}
                style={{ flex: 1 }}>

            </FlatList>
            <View style={{ height: 1, backgroundColor: colors.inactive }} />

        </View>

        {filteredUsers().length > 0 ? <FlatList
            data={filteredUsers()}
            renderItem={({ item }) => <ChatItem
                onPress={() => {
                    const receiverRef = database().ref(`unreadMessages/${userId}/${item.userId}`);
                    receiverRef.transaction(() => 0);
                    navigate('Messenger', { user: item });
                }}
                user={item} key={item.name} />}
            keyExtractor={eachUser => eachUser.name}
        /> : <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text style={{
                color: 'black',
                fontSize: fontSizes.h3
            }}>No body found</Text>
        </View>}
    </View>
}
export default Chat