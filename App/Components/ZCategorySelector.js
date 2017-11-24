import React, { Component } from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/ZStyles'
import Icon from 'react-native-vector-icons/FontAwesome'

// const { height } = Dimensions.get('window')

const categories = [ 'Who', 'What', 'Time', 'Verbs', 'Descriptions', 'Helpers', 'Bonus' ]

export default class ZCategorySelector extends Component {

  componentDidMount () {
    const that = this
    setTimeout(function () {
      that.refs.scrollView.scrollToEnd({animated: true})
    }, 1000)
    setTimeout(function () {
      that.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
    }, 2500)
  }

  renderBonus(cat) {
    const { potusMode } = this.props
    if(!potusMode) {
      return (
        <Text style={{color: '#333332'}}>{cat}  <Icon name='lock' size={15} /></Text>
      )
    } else {
      return (
        cat
      )
    }
  }

  renderCat(cat) {
    if(cat === 'Who') { return 'Who/Where' }
    if(cat === 'Time') { return 'Time/Numbers' }
    return cat
  }

  categoryList () {
    return categories.map((cat, i) => {
      const color = this.props.selected === cat ? '#FB6964' : '#F0F1EE'
      const text = (cat === 'Bonus') ? this.renderBonus(cat) : this.renderCat(cat)
      return (
        <TouchableOpacity style={[styles.categoryButton, { backgroundColor: color }]} key={i} onPress={() => this.props.updateCategory(cat)} >
          <Text style={styles.wordText}>{text}</Text>
        </TouchableOpacity>
      )
    })
  }

/* eslint-disable */
  render () {
    return (
      <ScrollView ref="scrollView" horizontal={true} style={{ height: 45, backgroundColor: '#333332'}}>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: 2, borderColor: '#FB6964', borderRadius: 5}}>
          { this.categoryList() }
        </View>
      </ScrollView>
    )
  }
/* eslint-enable */
}
