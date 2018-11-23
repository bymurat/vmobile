import React, {Component} from 'react';
import { Linking, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Icon , Button, Card, List, ListItem, SearchBar  } from 'react-native-elements';
import Modal from "react-native-modal";




export default class ConsultantScreen extends Component {
  static navigationOptions = {
    title: 'Danışman Listesi',
  };

  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      modalVisible : false,
      consultant : {
        ConsName : '',
        ConsId   :''
      },
      list : []
    }
  }

  callServer(filters){
    return fetch('https://fiori.varucon.com/sap/opu/odata/sap/ZVPORTAL_SRV/ConsultantSet?$format=json',{
        headers : {
          'Content-Type' :  'application/json',
          'Authorization' : 'Basic bWF5ZG9nZHU6S3JvbmlrMzY='
        }
        })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.d.results);
        this.setState({
          isLoading: false,
          list: responseJson.d.results,
          fullList : responseJson.d.results
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  componentDidMount(){
      this.callServer();

      //this.setState({ list : aList, fullList: aList, isLoading: false});
  }

  handleSearchChangeText(query){

      var newlist = [];

      console.log(query);
      query = query.toLocaleLowerCase();
      var l = this.state.fullList.length;
      for (var i = 0; i < l; i++) {

          var val = this.state.fullList[i].ConsName.toLocaleLowerCase();

          if(val.indexOf(query) < 0 ){
            //1
          }else{
              newlist.push(this.state.fullList[i]);
          }

      }
      console.log(newlist);
      this.setState({ list : newlist });


  }

  handleOpenModal(){
    this.setState({modalVisible : true});
  }
  handleCloseModal(){
    this.setState({modalVisible : false});
  }

  convertURLForMedia(item){
    return "https://fiori.varucon.com/sap/opu/odata/sap/HCMFAB_EMPLOYEELOOKUP_SRV/EmployeePictureSet('"+item.ConsId.slice(0,6) + item.ConsId.slice(-2)+"')/$value";
  }

  listItemPressed (item){

      item.imageuri = "https://fiori.varucon.com/sap/opu/odata/sap/HCMFAB_EMPLOYEELOOKUP_SRV/EmployeePictureSet('"+item.ConsId.slice(0,6) + item.ConsId.slice(-2)+"')/$value"


      //item.imageuri = "https://fiori.varucon.com/sap/bc/ui5_ui5/sap/zvaruconplan/images/_consp/d1.png";

      console.log(item);

      this.setState({modalVisible : true, consultant : item})
  }

  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return (
      <View style={styles.container}>


      <Modal isVisible={this.state.modalVisible}>
        <Card title={this.state.consultant.ConsName}
            image={{
                uri:this.state.consultant.imageuri,
                headers :{
                    'Authorization' : 'Basic bWF5ZG9nZHU6S3JvbmlrMzY='
                } }} >
          <View>


              <View style={{ flexDirection : 'row' , justifyContent : 'space-around', marginBottom : 10}}>
                  <Icon
                    color='#00aced'
                    reverse
                    name='phone-square'
                    type='font-awesome'
                    onPress={ () => Linking.openURL(`tel:${this.state.consultant.Telf2}`)}/>
                  <Icon
                    color='#517fa4'
                    reverse
                    name='envelope-square'
                    type='font-awesome'
                    onPress={ () => Linking.openURL(`mailto:${this.state.consultant.SmtpAddr}`)} />
                  <Icon
                    color='green'
                    reverse
                    name='whatsapp'
                    type='font-awesome'
                    onPress={ () => Linking.openURL(`whatsapp://send?phone=${this.state.consultant.Telf2}`) }/>

              </View>
              <Button
                onPress={ () => this.setState({modalVisible : false}) }
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                title='KAPAT' />
          </View>
        </Card>
      </Modal>
      <SearchBar
        lightTheme
          onChangeText={ (query) => this.handleSearchChangeText(query)}
          icon={{ type: 'font-awesome', name: 'search' }}
          placeholder='Danışman ara...' />
          <ScrollView >
          {
          this.state.list.map((l) => (
            <ListItem
              containerStyle={{marginTop : 0}}
              onPress={ () => this.listItemPressed(l) }
              roundAvatar
              leftAvatar={{
                source :  { uri: this.convertURLForMedia(l) },
                title : 'PP'
              }}
              subtitle={l.ModuleName}
              key={l.ConsId}
              title={l.ConsName}
            />
          ))
          }
          </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1
  }
});
