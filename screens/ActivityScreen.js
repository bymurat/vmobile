import React, {Component} from 'react';
import { Button , StyleSheet, Text, View, ScrollView, AsyncStorage, Alert } from 'react-native';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import { Card, Icon, ListItem } from 'react-native-elements';
import oData from '../util/oDataHelper';
import moment from 'moment';

LocaleConfig.locales['tr'] = {
  monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
  monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl.','Eki','Kas.','Ara'],
  dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
  dayNamesShort: ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt']
};
LocaleConfig.defaultLocale = 'tr';

export default class PlanningScreen extends Component {
  static navigationOptions = ( { navigation }) => {
    return {
    title: 'Aktivite Ekranı',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: 'System'
    },
    headerRight : ( <Button
      onPress={navigation.getParam('increaseCount')}
      title='Tüm Ay'/>)
  };
  };
  constructor(props) {
    super(props);
    this.state = {
          consid : '',
          mMarkedDates : { },
          activities : [  ]
    };
    this._retrieveData();
    this.props.navigation.setParams({ increaseCount: this._increaseCount });
  }


  _increaseCount = () => {
    this.headerButtonPressed();
  };



  headerButtonPressed(){
    console.log("tüm ay pressed");
  }
  getActivities(consultant, month) {

    //if(!pDate) pDate = this.state.today.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

    //(Actdate ge datetime'2018-12-01T00:00:00' and Actdate le datetime'2018-12-31T00:00:00')

    var fDate = moment().month(month).startOf('month').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

    var lDate = moment().month(month).endOf('month').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

    var sFilter = `Consid eq '${consultant}' and (Actdate ge datetime'${fDate}' and Actdate le datetime'${lDate}')`;

    console.log(sFilter);

    oData('ActivitySet')
        .filter(sFilter)
          .get()
            .then( (response) => {
              //for one consultant only
              console.log('S');
              var r = response.data.d.results;
              console.log(r);

              if(r.length > 0 ){

                  this.setState({ activities : r });


                  this.setCalendarColor(r);



              }else{
                //NO Activities Alert for user
              }


            })
            .fail( (err) => {
              //Alert.alert('Hata Alındı' , err.status )
              console.log(err.status);
            });


}

setCalendarColor(r){
  console.log('setCalendarColor');
  var aMarkedDates = [];

  var oTemp = {};

  //Actid
  //Actfoodcard
  //#fd7f64
  for(var i = 0; i < r.length; i++){

    var iKey = moment(r[i].Actdate).format(moment.HTML5_FMT.DATE);
    var mStyle = {
      customStyles : {
        container : {
          backgroundColor : r[i].Actduration == 480 ? '#ccf6af' : '#ff2d0057'
        },
        text: {
          color: 'grey'
        }
      }};
      oTemp[iKey] = mStyle;
  }
  this.setState({ mMarkedDates : oTemp });
}


_retrieveData = async () => {
  try {
    var value = await AsyncStorage.getItem('userToken');
    var nValue = JSON.parse(value);
    if (nValue.ConsId !== null) {

      console.log(nValue.ConsId);
      this.setState( { consid : nValue.ConsId  } );
      this.getActivities(nValue.ConsId, moment().get('month'));
    }
   } catch (error) {
     // Error retrieving data
   }
}

calendarDayPressed(day){
  //console.log(day.dateString);

  var date = moment(day.dateString).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  var sFilter = `Consid eq '${this.state.consid}' and Actdate eq datetime'${date}'`;


  oData('ActivitySet')
      .filter(sFilter)
        .get()
          .then( (response) => {
            var r = response.data.d.results;
            console.log(r);
            if(r.length > 0){
              this.setState({ activities : r});
            }

          })
          .fail( (err) => {
            //Alert.alert('Hata Alındı' , err.status )
            console.log(err.status);
          });


  //Consid eq '1201000019' and Actdate eq datetime'2018-12-14T00:00:00'
}

getBackgroundColor(item){
  //onsite-offsite
  if ( item.Actlocation === '1' && item.Actenvironment === '1') {
    return '#fdffac';
  } else if (item.Actlocation === '1' && item.Actenvironment === '2') {
    return '#ccf6af';
  } else {
    return '#f4b084';
  }
}

  render() {
    return (
      <View style={{flex : 1}}>
      <Calendar
        onDayPress={(day) => { this.calendarDayPressed(day) }}
        markingType={'custom'}
        markedDates={this.state.mMarkedDates}
        firstDay={1}
        onMonthChange={(month) => { this.getActivities( this.state.consid, month.month - 1 ) }}
        />

        <ScrollView>
        {
          this.state.activities.map( (u, i) => {
            return(
              <View key={i} style={{ flex :1, margin : 5}}>
                <View style={{
                    margin: 10,
                    flex :1,
                    flexDirection : 'row',
                    justifyContent: 'space-between'}}>
                    <View style={{ flex :5 }} >
                    <Text style={{ fontSize: 20, fontFamily: 'System'}}>{u.Projectname}</Text>
                    <Text style={{ marginTop:5, fontFamily: 'System'}}>{moment(u.Actdate).format('DD.MM.YYYY')}</Text>
                    <Text style={{ marginTop:5, fontFamily: 'System' }}>{u.Actnote}</Text>
                    </View>
                  <View style={{ flex :1}} >
                  <Text style={{ fontSize: 20, fontFamily: 'System'}}> {u.Actduration/60} <Text style={{  fontSize: 16, fontFamily: 'System'}}>Saat</Text> </Text>
                  {u.Actfoodcard === 'X' ? <Icon containerStyle={{marginTop:15}} name='food' type='material-community' color='#889900'/> : <Icon containerStyle={{marginTop:15}} name='food-off' type='material-community' color='red'/> }
                  </View>
                </View>
                  <View>
                </View>
              </View>
            );
          })
        }
        </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({

  text:{

  },

  hideText : {
    width:0,
    height:0
  },
  emptyDate : {
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
