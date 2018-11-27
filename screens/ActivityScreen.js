import React, {Component} from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Card, Icon } from 'react-native-elements';
import oData from '../util/oDataHelper';
import moment from 'moment';

export default class PlanningScreen extends Component {
  static navigationOptions = {
    title: 'Aktivite Ekranı',
  };

  constructor(props) {
  super(props);
  this.state = {
    plans : {},
    items: {},
    ConsId : '',
    today : null,
    sDate : ''
  };
  }
  getPlans( pDate, consultant) {

    if(!pDate) pDate = this.state.today.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

    var sFilter = consultant ? `PlanStartDate eq datetime'${pDate}' and ConsId eq '${consultant}'` : `PlanStartDate eq datetime'${pDate}'`;

    console.log(sFilter );

    oData('ConsultantSet')
      .expand('ConsultantToPlanNav')
        .filter(sFilter)
          .get()
            .then( (response) => {
              //for one consultant only
              console.log('S');
              var r = response.data.d.results[0].ConsultantToPlanNav.results;
              console.log(r.length);
              this.setState({ plans : r });
            })
            .fail( (err) => {
              Alert.alert('Hata Alındı' , err.status )
              console.log(err.status);
            });


}

componentWillMount(){
  // this.setState({ today : moment(new Date()) });
  // var pDate = moment(new Date()).weekday(1).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  // this.setState({ sDate : pDate});
  // this._retrieveData();
}

_retrieveData = async () => {
  // try {
  //   var value = await AsyncStorage.getItem('userToken');
  //   var nValue = JSON.parse(value);
  //   if (nValue.ConsId !== null) {
  //     var pDate = moment(new Date()).weekday(1).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  //     this.setState({ sDate : pDate, ConsId : nValue.ConsId });
  //     this.getPlans(pDate, nValue.ConsId);
  //   }
  //  } catch (error) {
  //    // Error retrieving data
  //  }
}







  render() {
    return (
          <View />
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
