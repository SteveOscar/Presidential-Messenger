import React, { Component } from 'react'
import { View, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/ZStyles'

const { height } = Dimensions.get('window')

export default class ZGridContainer extends Component {

  wordList () {
    const sorted = this.props.words.sort()
    return sorted.map((word, i) => {
      return (
        <TouchableOpacity style={styles.wordButton2}
          key={i}
          onPress={() => this.props.onWordPress(word, this.props.myContext)}
          onLongPress={() => this.props.onAddWord(word, this.props.myContext)} >
          <Text style={[styles.wordText, { color: 'white' }]}>{word.replace(/_/g, ' ')}</Text>
        </TouchableOpacity>
      )
    })
  }

  render () {
    return (
      <ScrollView style={{ height: height - 300, backgroundColor: '#333332' }}>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 5}}>
          { this.wordList() }
        </View>
      </ScrollView>
    )
  }

}
