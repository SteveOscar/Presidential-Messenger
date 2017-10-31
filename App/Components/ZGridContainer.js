import React, { Component } from 'react'
import { View, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/ZStyles'
import Icon from 'react-native-vector-icons/FontAwesome'

const { height, width } = Dimensions.get('window')

export default class ZGridContainer extends Component {

  wordList () {
    const sorted = this.props.words.sort()
    return sorted.map((word, i) => {
      return (
        <TouchableOpacity style={styles.wordButton2}
          key={i}
          onPress={() => this.props.onWordPress(word)}
          onLongPress={() => this.props.onAddWord(word)} >
          <Text style={[styles.wordText, { color: 'white' }]}>{word.replace(/_/g, ' ')}</Text>
        </TouchableOpacity>
      )
    })
  }

  render () {
    return (
      <ScrollView style={{ height: height - 300, backgroundColor: '#333332' }}>
        {this.renderCategoryLock()}
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 5}}>
          { this.wordList() }
        </View>
      </ScrollView>
    )
  }

  renderCategoryLock() {
    const { potusMode, category } = this.props
    if(!potusMode && (category === 'Bonus')) {
      console.log('SHOULD BLOCK!')
      return (
        <View style={{ height: height - 300, alignItems: 'center', justifyContent: 'center', width: width, position: 'absolute', zIndex: 14, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <Icon name='lock' color={'rgba(255, 255, 255, 0.25)'} style={{fontSize: width}} />
        </View>
      )
    } else {
      return(
        <View/>
      )
    }
  }

}
