import React, { Component } from 'react'
import { View, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native'
import styles from './Styles/ZStyles'
import Icon4 from 'react-native-vector-icons/Entypo'

const { width } = Dimensions.get('window')

export default class ZPhraseView extends Component {
  phrase () {
    return this.props.phrase.map((wordData, i) => {
      const word = wordData.word
      // const borderColor = this.props.selected === i ? '#1352A2' : '#333332'
      // const textColor = this.props.selected === i ? 'yellow' : '#F0F1EE'
      const width = ((word.length * 12) < 35) ? 35 : (word.length * 11)
      return (
        <TouchableOpacity style={[styles.phraseButton, { width: width, borderColor: '#333332' }]}
          key={i}
          onPress={() => this.props.onWordPress(wordData)}
          onLongPress={() => this.props.deleteWord(word, i)} >
          <Text style={[styles.wordText, { color: '#F0F1EE', marginTop: -5 }]}>{word.replace(/_/g, ' ')}</Text>
          <Text style={[styles.identifierText, {color: wordData.person.color}]}>{wordData.person.name.toUpperCase()}</Text>
        </TouchableOpacity>
      )
    })
  }

  renderBucket() {
    return (
      <View style={{ justifyContent: 'center', opacity: .7, width: width }}>
        <Text style={styles.bucketHelp}><Icon4 name='bucket' size={15} color={'#1352A2'}/>  Press and hold words too add to phrase bucket  <Icon4 name='bucket' size={15} color={'#FB6964'}/></Text>
      </View>
    )
  }
/* eslint-disable */
  render () {
    const bottomHeight = this.props.isIphoneX ? 40 : 0
    const phraseRendered = this.phrase()
    return (
      <ScrollView
        ref="scrollView"
        horizontal={true}
        style={{ height: 45, bottom: bottomHeight, backgroundColor: '#333332', borderTopWidth: 2, borderColor: '#FB6964', borderRadius: 5 }}
        onContentSizeChange={(contentWidth, contentHeight) => {this.refs.scrollView.scrollToEnd({animated: true})}}>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
          { phraseRendered.length ? phraseRendered : this.renderBucket() }
        </View>
      </ScrollView>
    )
  }
/* eslint-enable */

}
