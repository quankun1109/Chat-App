import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from '../utilies/Device';
const styles = StyleSheet.create({
    // ...
    senderMessage: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      alignItems: 'flex-end',
      marginBottom: 10,
    },
    receiverMessage: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'flex-end',
      marginBottom: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    messageContent: {
      marginLeft: 10,
      marginRight: 10
    },
    messageText: {
      fontSize: 16,
      color: 'black', 
    },
    messageTimestamp: {
      fontSize: 12,
      color: 'gray',
    },
    imageContainer: {
      marginTop: 10,
      marginBottom: 10,
      alignItems: 'center',
    },
    imageBox: {
      width: 230,
      height: 170,
      resizeMode: 'cover',
      borderRadius: 13
    },
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 100,
    },
    button: {
      width: 150,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      marginBottom: 40, 
      backgroundColor: 'red',
    },
    viewAvatarButton: {
      backgroundColor: 'lightblue',
    },
    changeAvatarButton: {
      backgroundColor: 'lightgreen',
    },
    buttonText: {
      fontSize: 16,
      color: 'white',
    },
    expandedAvatar: {
      width: screenWidth,
      height: screenWidth,
    },
    expandedImageContainer: {
      width: screenWidth,
      height: screenHeight,
      marginTop: screenHeight * 0.17,
      alignItems: 'center',
    },
    changeAvatarButtonContainer: {
      flexDirection: 'row',
    },
    buttonSpacing: {
      marginRight: 10,
    },
    newLinkInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    newLinkInput: {
      flex: 1, 
      height: 40, 
      borderWidth: 1, 
      borderColor: 'gray', 
      marginRight: 10, 
      paddingHorizontal: 10,
      borderRadius: 20
    },
  }) 
  export default styles