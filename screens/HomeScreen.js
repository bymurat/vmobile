import React, { Component } from 'react';
import { StyleSheet, View, Image,AsyncStorage, Alert } from 'react-native';
import { Input , Text, Icon, Button } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import oData from '../util/oDataHelper';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Varucon Mobile',
  };

  render() {
    return (

      <View style={styles.container}>
      <Image
        style={{ marginLeft: 60, width:280, height:100 }}
        source={require('../assets/varucon_logo.png')}/>
      <View style={styles.innerView}>
      <View style={{ flexDirection :'row'}}>

      <View
        style={{

            margin: 25,
            borderColor :'#517fa4',
            borderWidth :0,
            borderRadius : 15,
            justifyContent: 'center',
            alignItems: 'center'}}>
      <Icon
        size= {45}
        reverse
        name='address-card'
        type='font-awesome'
        color='#517fa4'
        onPress={ () => this.props.navigation.navigate('Consultant') }/>
        <Text h5> DANIŞMANLAR </Text>
        </View>

        <View style={{ margin: 25,
        borderColor :'#517fa4',
        borderWidth :0,
        borderRadius : 15,justifyContent: 'center',alignItems: 'center',}}>
        <Icon
          size= {45}
          reverse
          name='assignment'
          color='#517fa4'
          onPress={ () => this.props.navigation.navigate('Activity') }
        />
        <Text h5> EFORLARIM </Text>
        </View>

        </View>

        <View style={{ flexDirection :'row'}}>
        <View style={{ margin: 25,
        borderColor :'#517fa4',
        borderWidth :0,
        borderRadius : 15,justifyContent: 'center',alignItems: 'center',}}>
        <Icon
          size= {45}
          reverse
          name='date-range'
          color='#517fa4'
          onPress ={ () => this.props.navigation.navigate('Planning')}
        />
        <Text h5> PLANLARIM </Text>
        </View>

        <View style={{ margin: 25,
        borderColor :'#517fa4',
        borderWidth :0,
        borderRadius : 15,justifyContent: 'center',alignItems: 'center',}}>
        <Icon
          size= {45}
          reverse
          name='monetization-on'
          color='#517fa4'
          onPress={ () => Alert.alert('Yükleniyor...', 'Henüz yapım aşamasında... :( ')}
        />
        <Text h5> MASRAFLARIM </Text>
        </View>
        </View>
      </View>

      <View >
      <Button
        title="ÇIKIŞ YAP"
        onPress={ () => this._signOutAsync() }
        buttonStyle={{backgroundColor:'#517fa4'}}></Button>
      </View>
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  innerView : {
    flex :1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
    marginTop : 30,
    borderWidth : 0,
    borderColor : 'red'
  }
});
