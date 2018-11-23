import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Card, Icon } from 'react-native-elements';
import oData from '../util/oDataHelper';
import moment from 'moment';


export default class PlanningScreen extends React.Component {

  constructor(props) {
  super(props);
  this.state = {
    plans : {},
    items: {},
    today : null,
    sDate : ''
  };
  }
  getPlans( pDate, consultant) {

    console.log(this.state.today.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS));

    if(!pDate) pDate = this.state.today.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

    var sFilter = consultant ? `PlanStartDate eq datetime'${pDate}' and ConsId eq '${consultant}'` : `PlanStartDate eq datetime'${pDate}'`;

    console.log(sFilter);
    oData('ConsultantSet')
      .expand('ConsultantToPlanNav')
        .filter(sFilter)
          .get()
            .then( (response) => {

              //for one consultant only
              var r = response.data.d.results[0].ConsultantToPlanNav.results;

              this.setState({ plans : r });
    });
}

componentWillMount(){
  this.setState({ today : moment(new Date()) });
  var pDate = moment(new Date()).weekday(1).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  this.setState({ sDate : pDate});
}
componentDidMount() {
  this.setState({ today : moment(new Date()) });

  var pDate = moment(new Date()).weekday(1).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

  this.setState({ sDate : pDate});
  this.getPlans(pDate,'1201000008');
}


//boş günler için card yükle. //moment js kull<nılabilir
//hafta sonlarını text ile belirtt ///moment js kull<nılabilir


  loadItems(day) {
  setTimeout(() => {
      //console.log(strTime);
      if(this.state.plans.length > 0){
        for (let j = -1; j < 15; j++) {
            //var obj = this.state.plans[j];
            //var strTime1 = moment(obj.EvPlanDate).format(moment.HTML5_FMT.DATE);

            var firstDayOfWeek = moment(new Date()).weekday(1);
            var strTime1 = moment(firstDayOfWeek).add(j, 'd').format(moment.HTML5_FMT.DATE);
            console.log('TARİH ARALIĞIM : '+ strTime1);

            if (!this.state.items[strTime1]) {
                this.state.items[strTime1] = [];

                  for (let k = 0; k < this.state.plans.length; k++) {

                    var obj = this.state.plans[k];

                    if(strTime1 === moment(obj.EvPlanDate).format(moment.HTML5_FMT.DATE)){

                      this.state.items[strTime1].push({
                        name: 'Item for ' + strTime1,
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
    //console.log(this.state.items);
    const newItems = {};
    Object.keys(this.state.items).forEach(key => {
      newItems[key] = this.state.items[key];
    });
    this.setState({
      items: newItems,
    });
  }, 1500);
  // console.log(`Load Items for ${day.year}-${day.month}`);
}


renderItem(item) {
  return (
    <Card
      dividerStyle ={{ backgroundColor : 'black' }}
      containerStyle={{ backgroundColor : item.bgColor }}
      title={item.project}>
      <View style={{ marginBottom : 20 }} >
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' , alignItems:'center' }} >
          <Icon
            size={20}
            type='material-community'
            color='#696969'
            name='account-check' />
            <Text>
              {item.planLoc} - {item.planEnv}
            </Text>
            <Text>
              {item.startTime} - {item.endTime}
            </Text>
            <Text>

            </Text>
        </View>
            <Text>
              <Text style={{fontWeight : '600'}}>Çalışılacak Kişi :</Text> {item.workWith}
            </Text>
      <Text>
        <Text style={{fontWeight : '600'}}>Çağrı Numarası :</Text> {item.taskId}
      </Text>
      <Text>
        <Text style={{fontWeight : '600'}}>Açıklama :</Text> {item.note}
      </Text>
      <Text>
        <Text style={{fontWeight : '600'}}>Proje Sorumlusu :</Text> {item.projResponsible}
      </Text>
      </View>
    </Card>
  );
}

renderEmptyDate() {
  return (
    <View style={styles.emptyDate}>
      <Text>This is empty date!</Text>
    </View>
  );
}
rowHasChanged(r1, r2) {
  return r1.name !== r2.name;
}
handleOnDayPressed (day){
  console.log(day);
  var sDay = moment(day.dateString);
}

  render() {
    return (
      <Agenda
        firstDay={1}
        onDayChange={(day)=>{console.log('day changed')}}
        style={{ marginTop:20 }}
        items={this.state.items}
        selected={this.state.sDate}
        pastScrollRange={5}
        futureScrollRange={5}
        loadItemsForMonth={(day) => this.loadItems(day) }
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={ ()=> this.renderEmptyDate }
        rowHasChanged={this.rowHasChanged.bind(this)}
        onDayPress={ (day) => this.handleOnDayPressed(day)}
      />
    );
  }
}

const styles = StyleSheet.create({

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
