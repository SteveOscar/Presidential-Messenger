import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Easing, LayoutAnimation, Dimensions, ScrollView, Animated, Alert, TextInput, AsyncStorage, Image } from 'react-native'
import styles from './Styles/ZStyles'
import Icon from 'react-native-vector-icons/Entypo'

const { height, width } = Dimensions.get('window')

export default class ZTerms extends Component {
  constructor (props) {
    super(props)
    this.state = {
      accepted: false    }
  }

  componentDidMount () {
  }

  acceptTerms () {
    this.setState({ accepted: true })
    AsyncStorage.setItem('termsAccepted', 'true')
  }

  renderCloseText () {
    const { accepted } = this.state
    const opac = accepted ? 100 : 0
    return (
      <TouchableOpacity onPress={accepted ? this.props.closeTerms : null}>
        <Text style={[styles.helpText, {opacity: opac, shadowColor: '#71abf2', color: 'white'}]} onPress={this.acceptTerms.bind(this)}><Icon name={'arrow-long-right'} size={50} /></Text>
        <Text style={[styles.termsText, {opacity: opac}]}>Proceed</Text>
      </TouchableOpacity>
    )

  }


/* eslint-disable */
  render () {
    const { accepted } = this.state
    const acceptedIcon = accepted ? 'check' : 'circle'
    const line1 = accepted ? 0 : 100
    return (
      <View style={{width: width, height: height, position: 'absolute', zIndex: 500, backgroundColor: 'rgba(0, 0, 0, 0.95)'}}>
        <View style={{width: width, height: 100, top: 200, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
          <Text style={[styles.termsText, {fontWeight: 'bold'}]}>Terms Of Use</Text>
          <Text style={[styles.termsText, {}]}></Text>
          <Text style={[styles.helpText, {shadowColor: '#71abf2', color: 'white'}]}><Icon name={'dots-three-horizontal'} size={50} /></Text>
          <Text style={[styles.termsText, {}]}></Text>
          <Text style={[styles.termsText, {paddingTop: 13}]}>By using Presidential Messenger, you agree not to represent any sounds or phrases produced with the application as authentic recordings in any way, or to use the application in any manner that constitues defamation of another persion.</Text>
          <Text style={[styles.termsText, {}]}></Text>
          <Text style={[styles.termsText, {}]}></Text>
          <Text style={[styles.termsText, {}]}></Text>
          <Text style={[styles.termsText, {}]}></Text>
          <Text style={[styles.helpText, {shadowColor: '#71abf2', color: 'white'}]} onPress={this.acceptTerms.bind(this)}><Icon name={acceptedIcon} size={50} /></Text>
          <Text style={[styles.termsText, {}]}></Text>
          <Text style={[styles.termsText, {opacity: line1}]}>Tap circle to acknowledge and accept terms</Text>
          {this.renderCloseText()}
        </View>
      </View>
    )
  }
/* eslint-enable */
}
