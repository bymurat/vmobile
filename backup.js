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
	  
	  
	  
	  
	              <List containerStyle={{marginTop : 0}}>
              {
                this.state.list.map((l) => (
                  <ListItem
                    containerStyle={{marginTop : 0}}
                    onPress={ () => this.listItemPressed(l) }
                    roundAvatar
                    avatar={{uri: this.convertURLForMedia(l) }}
                    subtitle={l.ModuleName}
                    key={l.ConsId}
                    title={l.ConsName}
                  />
                ))
              }
            </List>