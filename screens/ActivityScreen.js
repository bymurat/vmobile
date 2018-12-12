import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, AsyncStorage, Alert } from 'react-native';
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


const list = [{
  title: 'deneme title',
  activityDuration : '8.00',
  customer : 'Kalyon'
}];

export default class PlanningScreen extends Component {
  static navigationOptions = {
    title: 'Aktivite Ekranı',
  };
  constructor(props) {
    super(props);
    this.state = {
          list : list,
          activities : [  ]
    };
    this._retrieveData();
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
              this.setState({ activities : r });
            })
            .fail( (err) => {
              //Alert.alert('Hata Alındı' , err.status )
              console.log(err.status);
            });


}



_retrieveData = async () => {
  try {
    var value = await AsyncStorage.getItem('userToken');
    var nValue = JSON.parse(value);
    if (nValue.ConsId !== null) {

      console.log(nValue.ConsId);
      this.getActivities(nValue.ConsId, moment().get('month'));
    }
   } catch (error) {
     // Error retrieving data
   }
}

  render() {
    return (
      <View style={{flex : 1}}>
      <Calendar
        firstDay={1}
        />
        <ScrollView >
        {
        this.state.activities.map((item) => (
          <Card
            dividerStyle ={{ backgroundColor : 'black' }}
            containerStyle={{ backgroundColor : item.bgColor }}
            title={item.Projectname}>
            <View style={{ marginBottom : 20 }} >

              <Text style={item.Actduration != '' ? styles.text : styles.hideText}>
                <Text style={{fontWeight : '600'}}>Aktivite Süresi :</Text> {item.Actduration / 60} Saat
              </Text>
            <Text style={item.taskId != '' ? styles.text : styles.hideText}>
              <Text style={{fontWeight : '600'}}>Çağrı Numarası :</Text> {item.Taskid}
            </Text>
            <Text style={item.note != '' ? styles.text : styles.hideText}>
              <Text style={{fontWeight : '600'}}>Açıklama :</Text> {item.Actnote}
            </Text>
            </View>
          </Card>
        ))
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
