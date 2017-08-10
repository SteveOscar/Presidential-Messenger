import React, { Component } from 'react'
import { View, Dimensions, ScrollView } from 'react-native'

export default class ZGridContainer extends Component {
  render () {
    const {height, width} = Dimensions.get('window')
    const calcWidth = width / 3
    return (
      // Try setting `flexDirection` to `column`.
      <ScrollView style={{ height: height * 0.4, backgroundColor: 'white' }}>
        <View style={{flex: 1, flexDirection: 'row', margin: 2}}>
          <View style={{width: calcWidth, height: 50, backgroundColor: 'powderblue'}} />
          <View style={{width: calcWidth, height: 50, backgroundColor: 'skyblue'}} />
          <View style={{width: calcWidth, height: 50, backgroundColor: 'steelblue'}} />
        </View>
        <View style={{flex: 1, flexDirection: 'row', margin: 2}}>
          <View style={{width: calcWidth, height: 50, backgroundColor: 'powderblue'}} />
          <View style={{width: calcWidth, height: 50, backgroundColor: 'skyblue'}} />
          <View style={{width: calcWidth, height: 50, backgroundColor: 'steelblue'}} />
        </View>
      </ScrollView>
    )
  }
}
