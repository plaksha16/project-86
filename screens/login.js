import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
 } from 'react-native';

import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';

export default class Login extends Component {

    onSignIn = (googleUser) => {
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
          unsubscribe();
          if (!this.isUserequal(googleUser, firebaseUser)) {
            var credential = firebase.auth.GoogleAuthProvider.credential(
              googleUser.idToken,
              googleUser.accessToken
            );
            firebase.auth().signInWithCredential(credential)
            .then(function(result){
              if(result.additionalUserInfo.isNewUser){
              firebase.database().ref("/users/"+result.user.uid)
              .set({
                gmail:result.user.email,
                profile_picture:result.additionalUserInfo.profile.picture,
                locale:result.additionalUserInfo.profile.locale,
                first_name:result.additionalUserInfo.profile.given_name,
                last_name:result.additionalUserInfo.profile.family_name,
                current_theme:"dark"
              })
              .then(function(snapshot){})
              }
            })
          }
        });
      };
    
      signInWIthGoogle = async () => {
        try {
          const result = await Google.logInAsync({
            behavior: 'web',
            androidClientId:
            "850680561547-klhihl69casjb3k6p7ec3jnv0pcmu1us.apps.googleusercontent.com",
              scopes: ['profile', 'email'],
          });
          if (result.type === 'success') {
            return;
          }
        } catch (e) {
          console.log(e.message);
          return { error: true };
        }
      };
     
      render(){
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.signInWIthGoogle();
            }}>
            <Text>Sign In with Google</Text>
            <Image
              source={require('../assets/google_icon.png')}
              style={styles.googleImage}></Image>
          </TouchableOpacity>
          
        </View>
      );
    }
  
  
    styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    button: {
      justifyContent: 'center',
      borderWidth: 2,
      width: 150,
      alignSelf: 'center',
    },
    googleImage: {
      width: 30,
      height: 30,
    },
   
  });
   
}
