import React, { Component } from 'react'
import { View, ScrollView, Text, Image, TouchableOpacity, Dimensions, LayoutAnimation, AsyncStorage, Alert } from 'react-native'
import styles from './Styles/ZStyles'
import Icon from 'react-native-vector-icons/FontAwesome'

const { height, width } = Dimensions.get('window')

export default class ZLoadPhrases extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loadHeight: 0,
      playingHeight: 0
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

  componentWillUpdate (nextProps, nextState) {
    const c = this.props.playing !== nextProps.playing
    if (c) {
      // LayoutAnimation.spring()
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
      this.setState({ playingHeight: this.state.playingHeight ? 0 : height })
    }
  }

  fileList () {
    const { fileNames } = this.props
    return fileNames.map((file, i) => {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}} key={i}>
          <TouchableOpacity
            style={[styles.loaderButton, { width: width * 0.8, shadowColor: 'yellow', flexDirection: 'column' }]}
            key={i}
            onPress={() => this.props.playSavedPhrase(file)} >
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
        that.props.removeFile(fileName)
      })
    } catch (error) {
      console.log(`There was a problem, try restarting the app.`)
      console.log(error)
    }
  }

  noFiles () {
    return (
      <View style={{marginTop: height / 6}}>
        <Text style={styles.noFilesText}>You have no saved phrases</Text>
        <Text style={styles.noFilesText}>First, go back and build a phrase by adding words to the word bucket</Text>
        <Text style={styles.noFilesText}>Then click 'Build Phrase'</Text>
        <Text style={[styles.phraseMagic, {shadowColor: 'black'}]}><Icon name='magic' size={30} /></Text>
        <Text style={styles.noFilesText}>From there you can record and save a phrase</Text>
      </View>
    )
  }

  renderPlayingScreen () {
    const { playing } = this.props
    const { playingHeight } = this.state
    const trumpFace = require('../Images/trump.png')
    const obamaFace = require('../Images/obama.png')
    // if(!playing) { return (<View/>) }
    return (
      <View style={{ width: width, height: playingHeight, overflow: 'hidden', zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'absolute'}}>
        <Text style={{fontSize: width/10, fontFamily: 'Avenir-Black', color: 'white', margin: 15}}>A Presidential</Text>
        <Image
          source={trumpFace}
          style={{
            margin: 15,
            width: 150,
            height: 200
          }}
        />
        <Image
          source={obamaFace}
          style={{
            margin: 15,
            width: 150,
            height: 200
          }}
        />
        <Text style={{fontSize: width/10, fontFamily: 'Avenir-Black',  color: 'white', margin: 15}}>Message</Text>
      </View>
    )
  }

/* eslint-disable */
  render () {
    const { fileNames } = this.props
    const { loadHeight } = this.state
    return (
      <View style={{width: width, height: height, position: 'absolute', zIndex: 14, backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
        {this.renderPlayingScreen()}
        <ScrollView style={{ width: width, height: height * .8, top: height * .1, position: 'absolute', zIndex: 15, backgroundColor: 'transparent', flex: 1}}>
          { fileNames.length ? this.fileList() : this.noFiles() }
        </ScrollView>
        <TouchableOpacity
          style={{bottom: 20, left: 20, width: 50, height: 50, position: 'absolute'}}
          >
          <Text style={{ color: '#FB6964', fontSize: 20, fontWeight: 'bold', backgroundColor: 'transparent', shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.7, shadowRadius: 2, shadowColor: 'white'}}
            onPress={() => this.props.closeLoadScreen()}>
            <Icon name='backward' size={60} />
          </Text>
        </TouchableOpacity>

      </View>
    )
  }
/* eslint-enable */
}
