import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Alert,
  AsyncStorage
} from 'react-native';
import { Input , Button } from 'react-native-elements';
//import oData from 'odata';
import oData from '../util/oDataHelper';

export default class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Oturum açın',
  };

  constructor(props){
    super(props);
    this.state = {
      username : '',
      password : '',
      textInput : false,
      currentConsultant : {}
    };
  }

  render() {
    return (
      <View style={ this.state.textInput ? styles.containerTextInput : styles.container }>

          <Image
            style={styles.stretch}
            source={require('../assets/varucon_logo.png')}/>
          <Input
            onFocus={() =>  this.setState({textInput : true})  }
            onSubmitEditing={() =>  this.setState({textInput : false}) }
            placeholder='SAP Kullanıcı Adı'
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            onChangeText={(un) => this.setState({ username : un })}
            value={this.state.username}
          />
          <Input
            onFocus={() =>  this.setState({textInput : true})  }
            onSubmitEditing={() =>  this.setState({textInput : false}) }
            secureTextEntry
            placeholder='Şifre'
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={(ps) => this.setState({ password : ps})}
            value={this.state.password}
          />
          <Button
            style={{ margin : 15, width : 200 }}
            title='Giriş'
            onPress={() =>  this.initialODataConfigAndLoginAttempt()  }
          />
      </View>
    );
  }

  initialODataConfigAndLoginAttempt(){

    //console.log(this.state.username);
    //console.log(this.state.password);
    console.log('initialODataConfigAndLoginAttempt');
    if(this.state.username && this.state.password){

    //// FIXME: Global olarka saklnanalı - redux
    oData().config({
      username: this.state.username,
      password: this.state.password,
      isWithCredentials: true
    });

  }else{
    Alert.alert('HATA', 'Kullanıcı adı veya şifre alanı boş olamaz !');
    return ;
  }



    oData('CurrentConsultant')
      .get()
        .then( (res) => {
          console.log(res.data.d.results[0]);
          this.setState({
            currentConsultant : res.data.d.results[0]
          });
          this._signInAsync();
        }).fail( (err) => {
          //// FIXME:  Alert ekle
          console.log(err);
          Alert.alert('HATA', 'Error code : ' + err.status);
        });

  }

  _signInAsync = async () => {

    await AsyncStorage.setItem('userToken', JSON.stringify(this.state.currentConsultant));
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
  containerTextInput: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom  :150
  },
  stretch : {
    height : 90,
    width : 250
  }
});
