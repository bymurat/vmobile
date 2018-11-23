import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  AsyncStorage
} from 'react-native';
import { Input , Button } from 'react-native-elements';

export default class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Oturum açın',
  };

  render() {
    return (
      <View style={styles.container}>

          <Image
            style={styles.stretch}
            source={require('../assets/varucon_logo.png')}/>
          <Input
          placeholder='SAP Kullanıcı Adı'
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          />
          <Input
            placeholder='Şifre'
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
          />
          <Button
            style={{ margin : 15, width : 200 }}
            title='Giriş'
          />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stretch : {
    height : 50,
    width : 200
  }
});
