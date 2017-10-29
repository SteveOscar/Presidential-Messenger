import React, { Component } from 'react'
import { View, ScrollView, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native'
import styles from './Styles/ZStyles'
import { Metrics } from '../Themes/'

const { width } = Dimensions.get('window')

export default class ZPersonSelector extends Component {
  constructor (props) {
    super(props)
    this.state = {
      obamaSpinValue: new Animated.Value(0),
      trumpSpinValue: new Animated.Value(0)
    }
  }

  componentDidMount () {
    this.spin(this.props.person)
  }

  componentWillUpdate (nextProps) {
    if (nextProps.person !== this.props.person) {
      this.spin(nextProps.person, 800)
    }
  }

  spin (person, duration) {
    console.log('SHOULD SPIN')
    const { obamaSpinValue, trumpSpinValue } = this.state
    var tilt = person === 'trump' ? trumpSpinValue : obamaSpinValue
    tilt.setValue(0)
    Animated.timing(tilt, {
      toValue: 1,
      duration: duration || 2000,
      easing: Easing.spring
    }).start()
  }

  people () {
    const { obamaSpinValue, trumpSpinValue } = this.state
    const obambaSpin = obamaSpinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const trumpSpin = trumpSpinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const perspectiveAmount = (Math.random() * (0.3 - 0.15) + 0.15) * width

    return this.props.people.map((selectedPerson, i) => {
      const person = selectedPerson.name
      const borderColor = this.props.person === person ? selectedPerson.color : 'transparent'
      const imageFile = person === 'trump' ? require('../Images/trump.png') : require('../Images/obama.png')
      const rotate = person === 'trump' ? trumpSpin : obambaSpin
      return (
        <TouchableOpacity style={[styles.personButton, { backgroundColor: 'rgba(0, 0, 0, 0)', shadowColor: borderColor }]}
          key={i}
          onPress={() => this.props.onPersonPress(selectedPerson)} >
          <View>
            <Animated.Image
              source={imageFile}
              style={{
                width: 55,
                height: 75,
                transform: [{perspective: perspectiveAmount},
                           {rotateY: rotate}]
              }}
            />
          </View>
        </TouchableOpacity>
      )
    })
  }
/* eslint-disable */
  render () {
    const topMargin = this.props.isIphoneX ? (Metrics.screenWidth / 12) : 15
    return (
      <ScrollView ref="scrollView" horizontal={true} style={{ height: 100, backgroundColor: '#333332', marginTop: topMargin }}>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap',  justifyContent: 'center', width: Metrics.screenWidth}}>
          { this.people() }
        </View>
      </ScrollView>
    )
  }
/* eslint-enable */

}
