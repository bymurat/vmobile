import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Card, Icon } from 'react-native-elements';
import oData from '../util/oDataHelper';
import moment from 'moment';

export default class PlanningScreen extends React.Component {
  static navigationOptions = {
    title: 'Planlama Ekranı',
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

    //console.log(this.state.today.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS));

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
  this.setState({ today : moment(new Date()) });
  var pDate = moment(new Date()).weekday(1).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  this.setState({ sDate : pDate});
  this._retrieveData();
}

_retrieveData = async () => {
  try {
    var value = await AsyncStorage.getItem('userToken');
    var nValue = JSON.parse(value);
    if (nValue.ConsId !== null) {
      var pDate = moment(new Date()).weekday(1).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
      this.setState({ sDate : pDate, ConsId : nValue.ConsId });
      this.getPlans(pDate, nValue.ConsId);
    }
   } catch (error) {
     // Error retrieving data
   }
}
//boş günler için card yükle. //moment js kull<nılabilir
//hafta sonlarını text ile belirtt ///moment js kull<nılabilir
  loadItems(day) {
    console.log('FUNCTION : loadItems ');
    //console.log(day);
  setTimeout(() => {

      //console.log(this.state.plans);
      var items = {};
      if(this.state.plans.length > 0){
        for (let j = -1; j < 13; j++) {

            var firstDayOfWeek = moment(this.state.sDate).weekday(1);


            var strTime1 = moment(firstDayOfWeek).add(j, 'd').format(moment.HTML5_FMT.DATE);
            //console.log(this.state.items);
            //this.setState({ items : { } });



            if (!items[strTime1]) {
                items[strTime1] = [];

                  for (let k = 0; k < this.state.plans.length; k++) {

                    var obj = this.state.plans[k];

                    if(strTime1 === moment(obj.EvPlanDate).format(moment.HTML5_FMT.DATE)){


                      items[strTime1].push({
                        id: obj.IvPlanId,
                        project : obj.ProjectName,
                        note : obj.EvPlanNote,
                        startTime : moment(obj.EvPlanStartTime).format('LT'),
                        endTime : moment(obj.EvPlanEndTime).format('LT'),
                        project : obj.ProjectName,
                        creatBy : obj.Crnam,
                        planLoc :obj.EvPlanLocationText,
                        planEnv : obj.EvPlanEnvironmentText,
                        workWith : obj.EvPlanWorkWith,
                        bgColor : obj.EvPlanEnvironment === '1' ? '#fdffac' : '#c2f49fd4',
                        projResponsible : obj.ProjectResponsibleName,
                        taskId : obj.TaskID,
                        height: 100
                      });
                  }
                }
          }
        }
      }
    this.setState({
      items: items,
    });
  }, 1500);
}


renderItem(item) {
  return (
    <View>
    <Card
      dividerStyle ={{ backgroundColor : 'black' }}
      containerStyle={{ backgroundColor : item.bgColor }}>
      <View style={{ marginBottom : 20 }} >
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' , alignItems:'center' }} >
          <Icon
            size={20}
            type='material-community'
            color='#696969'
            name='account-check' />
            <Text>{item.planLoc}-{item.planEnv}</Text>
            <Text>{item.startTime}-{item.endTime}</Text>
        </View>
      <Text style={item.workWith != '' ? styles.text : styles.hideText}>
      <Text style={{fontWeight : '600'}}>Çalışılacak Kişi :</Text> {item.workWith}</Text>
      <Text style={item.taskId != '' ? styles.text : styles.hideText}>
      <Text style={{fontWeight : '600'}}>Çağrı Numarası :</Text> {item.taskId}</Text>
      <Text style={item.note != '' ? styles.text : styles.hideText}>
      <Text style={{fontWeight : '600'}}>Açıklama :</Text> {item.note}</Text>
      <Text><Text style={{fontWeight : '600'}}>Proje Sorumlusu :</Text>{item.projResponsible}</Text>
      </View>
      </Card>
    </View>
  );
}

renderEmptyDate() {
  return (
    <View />
  );
}
rowHasChanged(r1, r2) {
  return r1.id !== r2.id;
}
handleOnDayPressed (day){

  var sDay = moment(day.dateString).weekday(1).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  console.log(sDay);
  this.setState({ sDate : sDay });
  this.getPlans(sDay, this.state.ConsId );

}

  render() {
    return (
      <Agenda
        firstDay={1}
        items={this.state.items}
        selected={this.state.sDate}
        pastScrollRange={5}
        loadItemsForMonth={(day) => this.loadItems(day) }
        futureScrollRange={5}
        renderItem={ (item) => this.renderItem(item) }
        renderEmptyDate={ (day)=> this.renderEmptyDate(day) }
        rowHasChanged={this.rowHasChanged.bind(this)}
        onDayPress={ (day) => this.handleOnDayPressed(day)}
      />
    );
  }
}

const styles = StyleSheet.create({

  text:{
    fontFamily: 'System'
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
