import React, { Component } from 'react'
import { View, ScrollView, Text, TouchableOpacity, Dimensions, LayoutAnimation, AsyncStorage, Alert } from 'react-native'
import styles from './Styles/ZStyles'
import Icon from 'react-native-vector-icons/FontAwesome'

const { height, width } = Dimensions.get('window')

export default class ZLoadPhrases extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loadHeight: 0
    }
  }

  componentDidMount () {
    const CustomLayoutSpring = {
      duration: 1300,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.5
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.6
      }
    }
    // LayoutAnimation.spring()
    LayoutAnimation.configureNext(CustomLayoutSpring)
    this.setState({ loadHeight: height })
  }

  fileList () {
    const { fileNames } = this.props
    return fileNames.map((file, i) => {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}} key={i}>
          <TouchableOpacity
            style={[styles.loaderButton, { width: width * 0.8, shadowColor: 'yellow', flexDirection: 'column' }]}
            key={i}
            onPress={() => this.props.playSavedPhrase(file, this.props.myContext)} >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: 'white', paddingRight: 15}}><Icon name={'play'} size={30} /></Text>
              <Text style={[styles.wordText, { color: '#F0F1EE' }]}>{file}</Text>
            </View>
          </TouchableOpacity>
          <Text
            style={{color: 'white', fontSize: 20, fontWeight: 'bold', backgroundColor: 'transparent', flexDirection: 'column', marginLeft: 15}}
            onPress={() => this.deleteAlert(file)}>
            <Icon name='trash' size={50} />
          </Text>
        </View>
      )
    })
  }

  deleteAlert (fileName) {
    Alert.alert(
      'Delete Recording?',
      'This cannot be undone...',
      [
        { text: 'Confirm',
          onPress: () => {
            this.deleteFile(fileName)
          }
        },
        { text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'}
      ]
    )
  }

  async deleteFile (fileName) {
    try {
      const name = `@messenger:${fileName}`
      console.log('looking for ', name)
      const that = this
      await AsyncStorage.removeItem(name).then((success) => {
        console.log('FILE DELETED')
        that.props.removeFile(fileName, this.props.myContext)
      })
    } catch (error) {
      console.log(`There was a problem, try restarting the app.`)
      console.log(error)
    }
  }

  noFiles () {
    return (
      <Text style={styles.noFilesText}>You have no saved phrases</Text>
    )
  }

/* eslint-disable */
  render () {
    const { fileNames } = this.props
    const { loadHeight } = this.state
    return (
      <View style={{width: width, height: height, position: 'absolute', zIndex: 14, backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
        <ScrollView style={{ width: width, height: height * .8, top: height * .1, position: 'absolute', zIndex: 15, backgroundColor: 'transparent', flex: 1}}>
          { fileNames.length ? this.fileList() : this.noFiles() }
        </ScrollView>
        <TouchableOpacity
          style={{bottom: 20, right: 20, width: 50, height: 50, position: 'absolute'}}
          >
            <Text style={{ color: '#FB6964', fontSize: 20, fontWeight: 'bold', backgroundColor: 'transparent', shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.7, shadowRadius: 2, shadowColor: 'white'}}
              onPress={() => this.props.closeLoadScreen(this.props.myContext)}>
              <Icon name='backward' size={60} />
            </Text>
          </TouchableOpacity>

        </View>
      )
  }
/* eslint-enable */
}
