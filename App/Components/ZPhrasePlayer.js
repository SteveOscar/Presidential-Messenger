import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Easing, LayoutAnimation, Dimensions, ScrollView, Animated, Alert, TextInput, AsyncStorage, Image } from 'react-native'
import styles from './Styles/ZStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon4 from 'react-native-vector-icons/Entypo'

const { height, width } = Dimensions.get('window')
const check = require('isiphonex');

export default class ZPhrasePlayer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      recording: false,
      record: [],
      startTime: '',
      playSpinValue: new Animated.Value(0),
      saveSpinValue: new Animated.Value(0),
      postRecordingHeight: 0,
      playingHeight: 0,
      saveHeight: 0,
      fileName: '',
      saveNotice: '',
      showHelp: false
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const a = this.state.postRecordingHeight !== nextState.postRecordingHeight
    const b = this.state.saveHeight !== nextState.saveHeight
    const c = this.props.playing !== nextProps.playing
    if (a || b || c) {
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
      if (a) { this.setState({ postRecordingHeight: nextState.postRecordingHeight }) }
      if (b) { this.setState({ saveHeight: nextState.saveHeight }) }
      if (c) { this.setState({ playingHeight: this.state.playingHeight ? 0 : height }) }

      if (!this.state.saveNotice.length && nextState.saveNotice.length) {
        this.props.refreshData()
      }
    }
  }

  phrase () {
    return this.props.phrase.map((wordData, i) => {
      const shadowColor = this.props.selected === i ? 'yellow' : wordData.person.color
      const word = wordData.word.replace(/_/g, ' ')
      const width = ((word.length * 12) < 50) ? 50 : (word.length * 11)
      return (
        <TouchableOpacity style={[styles.phrasePlayerButton, { width: width, shadowColor: shadowColor }]}
          key={i}
          onPress={() => this.onWordPress(wordData)}
          onLongPress={() => this.props.deleteWord(word, i)} >
          <Text style={[styles.wordText, { color: '#F0F1EE' }]}>{word}</Text>
          <Text style={[styles.identifierText, {color: wordData.person.color}]}>{wordData.person.name.toUpperCase()}</Text>
        </TouchableOpacity>
      )
    })
  }

  onWordPress (wordData) {
    const { startTime, record } = this.state
    this.props.onWordPress(wordData)
    const originalPhrase = record
    const newTime = new Date().getTime()
    const elapsedTime = newTime - startTime
    console.log('Elapsed time: ', elapsedTime)
    originalPhrase.push({ word: wordData.word, person: wordData.person, time: elapsedTime })
    this.setState({ record: originalPhrase })
  }

  onRecordPress () {
    console.log('RECORD PRESSED')
    const newVal = !this.state.recording
    if (!this.state.recording) {
      const time = new Date().getTime()
      this.setState({ recording: newVal, startTime: time, record: [] })
    } else {
      if (this.state.record.length) {
        this.setState({ postRecordingHeight: height })
      }
      this.setState({ recording: newVal, startTime: '' })
    }
  }

  playSavedPhrase () {
    const { record } = this.state
    if (!record.length) { return }
    // this.playSpin(2000)
    this.props.playRecording(record)
  }

  clearPostRecordScreen () {
    Alert.alert(
      'Clear Recording?',
      'You will be starting over',
      [
        { text: 'Confirm',
          onPress: () => {
            this.props.remount()
          }
        },
        { text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'}
      ],
      { cancelable: false }
    )
  }

  showSaveScreen () {
    this.saveSpin(1000)
    this.setState({ saveHeight: height / 2, postRecordingHeight: 0 })
  }

  recordButtonColor () {
    const { recording } = this.state
    if (recording) { return '#FB6964' }
    return '#1352A2'
  }

  cancelSave () {
    this.setState({
      saveHeight: 0,
      postRecordingHeight: height
    })
  }

  playSpin (duration) {
    const { playSpinValue } = this.state
    playSpinValue.setValue(0)
    Animated.timing(playSpinValue, {
      toValue: 1,
      duration: duration,
      easing: Easing.spring
    }).start()
  }

  toggleHelp () {
    console.log('should toggle help')
    const prev = this.state.showHelp
    this.setState({ showHelp: !prev })
  }

  saveSpin (duration) {
    const { saveSpinValue } = this.state
    saveSpinValue.setValue(0)
    Animated.timing(saveSpinValue, {
      toValue: 1,
      duration: duration,
      easing: Easing.spring
    }).start()
  }

  async savePhrase () {
    const { record, fileName } = this.state
    // Form validation...
    if (!fileName.length) {
      this.setState({
        saveNotice: 'Enter a name for this recording...'
      })
      return
    }
    if (this.props.fileNames.indexOf(fileName) !== -1) {
      this.setState({
        saveNotice: 'This name is already taken...'
      })
      return
    }
    // Okay, save it
    try {
      const name = `@messenger:${fileName}`
      let saveNotice
      if(this.props.potusMode) {
        saveNotice = 'Your recording was saved. You can load it from the home screen.'
      } else {
        saveNotice = 'Your recording was saved. Unlock Potus Mode to listen to saved recordings.'
      }
      await AsyncStorage.setItem(name, JSON.stringify(record)).then((success) => {
        this.setState({
          saveHeight: 0,
          postRecordingHeight: 0,
          saveNotice: saveNotice,
          fileName: ''
        })
        const that = this
        setTimeout(function () {
          that.setState({ saveNotice: '' })
        }, 3500)
      })
    } catch (error) {
      const error = `There was a problem, try restarting the app.`
      this.setState({ saveNotice: error })
    }
  }
  /* eslint-disable */

  renderErrors () {
    const { saveNotice } = this.state
    if (saveNotice.length) {
      return (
        <View style={{flex: 1, alignItems: 'center', backgroundColor: 'transparent', width: width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: height * .2, zIndex: 100}}>
          <Text style={styles.saveText}>{saveNotice}</Text>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  renderSaveView () {
    const { fileName, saveHeight } = this.state
    if (saveHeight > 0) {
      return (
        <View style={{width: width, height: height, position: 'absolute', zIndex: 14, backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
          <View style={{ width: width, height: saveHeight, top: height / 4, position: 'absolute', zIndex: 15, backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <Text style={{color: 'white', fontSize: 20, margin: 15}}>Enter A Name</Text>
            <TextInput
              style={{height: 40, paddingLeft: 5, borderRadius: 5, padding: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', marginLeft: 10, marginRight: 10}}
              onChangeText={(text) => this.setState({fileName: text.slice(0, 30)})}
              value={fileName}
              autoFocus={true}
            />
            <View style={{flex: 1, alignItems: 'center', backgroundColor: 'transparent', width: width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={{margin: 20, alignItems: 'center', justifyContent: 'center', width: 90, height: 100}}>
                <Text style={{ color: '#1352A2', fontSize: 20, fontWeight: 'bold', backgroundColor: 'transparent'}}
                      onPress={() => this.savePhrase()}>
                  <Icon name='save' size={60} />
                </Text>
                <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold', backgroundColor: 'transparent'}}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{margin: 20, alignItems: 'center', justifyContent: 'center', width: 90, height: 100}}>
                <Text style={{ color: '#FB6964', fontSize: 20, fontWeight: 'bold', backgroundColor: 'transparent'}}
                      onPress={() => this.cancelSave(this.cancelSave)}>
                  <Icon name='close' size={60} />
                </Text>
                <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold', backgroundColor: 'transparent'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  renderPlayingScreen () {
    const { playingHeight } = this.state
    const trumpFace = require('../Images/trump.png')
    const obamaFace = require('../Images/obama.png')
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

  renderPostRecording () {
    const { postRecordingHeight, playSpinValue, saveSpinValue } = this.state
    const perspectiveAmount = (Math.random() * (0.3 - 0.15) + 0.15) * width
    const rotatePlay = playSpinValue.interpolate({ inputRange: [0, 1],
                                               outputRange: ['0deg', '360deg']
                                             })
    const rotateSave = saveSpinValue.interpolate({ inputRange: [0, 1],
                                               outputRange: ['0deg', '360deg']
                                             })
    if (true) {
      return (
        <View style={{ width: width, height: postRecordingHeight, overflow: 'hidden', zIndex: 15, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
          {this.renderPlayingScreen()}
          <TouchableOpacity
            style={{margin: 20, alignItems: 'center', justifyContent: 'center', width: 140, height: 100}}>
            <Animated.Text style={{ transform: [{perspective: perspectiveAmount}, {rotateY: rotateSave}],
                                    color: '#1352A2', fontSize: 20, fontWeight: 'bold', backgroundColor: 'transparent'}}
                                    onPress={() => this.showSaveScreen()}>
              <Icon name='save' size={80} />
            </Animated.Text>
            <Text style={{color: 'white', fontSize: 35, fontWeight: 'bold', backgroundColor: 'transparent'}}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.playSavedPhrase()}
            style={{margin: 20, alignItems: 'center', justifyContent: 'center', width: 140, height: 100}}>
            <Animated.Text style={{ transform: [{perspective: perspectiveAmount}, {rotateY: rotatePlay}],
                                    color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              <Icon name={'play-circle-o'} size={80} />
            </Animated.Text>
            <Text style={{color: 'white', fontSize: 35, fontWeight: 'bold'}}>{'Play'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.clearPostRecordScreen()}
            style={{margin: 20, alignItems: 'center', justifyContent: 'center', width: 140, height: 100}}>
            <Text style={{color: '#FB6964', fontSize: 20, fontWeight: 'bold'}}>
              <Icon name='trash' size={80} />
            </Text>
            <Text style={{color: 'white', fontSize: 35, fontWeight: 'bold'}}>Trash</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  renderHelp () {
    const { showHelp } = this.state
    const top1 = check.isIphoneX() ? 40 : 5
    if (showHelp) {
      return (
        <TouchableOpacity style={{width: width, height: height, position: 'absolute', zIndex: 500, backgroundColor: 'rgba(0, 0, 0, 0.7)'}}onPress={this.toggleHelp.bind(this)}>
          <View style={{width: width, height: 100, top: 200, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {}]}>Tap words to preview</Text>
            <Text style={[styles.helpText, {paddingTop: 13}]}>Press and hold to REMOVE a word.</Text>
            <Text style={[styles.helpText, {shadowColor: '#71abf2', color: '#1352A2'}]}><Icon2 name='gesture-tap' size={30} /></Text>
            {/* <Text style={[styles.helpText, {}]}><Icon2 name='gesture-double-tap' size={30} /></Text> */}
          </View>
          <View style={{width: width, height: 150, bottom: 150, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {marginTop: 30}]}>Press 'Record' to begin recording.</Text>
            <Text style={[styles.helpText, {shadowColor: '#71abf2', color: '#1352A2', marginTop: 10}]}><Icon name='circle' size={30} /></Text>
            <Text style={[styles.helpText, {marginTop: 10}]}>Tap different words to build a phrase.</Text>
            <Text style={[styles.helpText, {marginTop: 10}]}>You can press words in any order or speed.</Text>
            <Text style={[styles.helpText, {marginTop: 10}]}>Press 'Stop' to finish.</Text>
          </View>
          <Text onPress={this.toggleHelp.bind(this)} style={[styles.helpText, {position: 'absolute', left: 8, top: top1, fontSize: 10, shadowColor: '#71abf2', color: 'white'}]}>tap to close</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <View />
      )
    }
  }
  //
  // autoPlayPressed () {
  //   const { autoPlaying } = this.props
  //   if (this.state.recording) { return }
  //   if(autoPlaying) {
  //     this.props.stopAutoPlay()
  //   } else {
  //     this.props.autoPlay()
  //   }
  // }

  render () {
    const { recording, record } = this.state
    const { autoPlaying } = this.props
    let recordWord = recording ? 'Stop' : 'Record'
    let buttonColor = this.recordButtonColor()
    const paddingTop = check.isIphoneX() ? 35 : 15
    // let autoPlayIcon = autoPlaying ? 'stop-circle' : 'play'
    // let autoPlayText = autoPlaying ? 'Stop' : 'AutoPlay'
    // let playTextColor = record.length && !recording ? '#1352A2' : 'grey'
    // let playButtonColor = record.length && !recording ? '#1352A2' : 'transparent'
    let tabColor = recording ? '#1352A2' : '#FB6964'
    return (
        <View style={{width: '100%', height: height, position: 'absolute', zIndex: 11}}>
          {this.renderErrors()}
          {this.renderHelp()}
          {this.renderPostRecording()}
          {this.renderSaveView()}
          <ScrollView style={{paddingTop: paddingTop, position: 'absolute', zIndex: 12, height: height-100, bottom: 100, width: '100%', backgroundColor: '#333332'}}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1, justifyContent: 'center'}}>
              { this.phrase() }
            </View>
          </ScrollView>
          <View style={{height: 100, bottom: 0, position: 'absolute', width: '100%', backgroundColor: tabColor, zIndex: 12, flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>

            <View style={{height: 100, flex: 1, flexDirection: 'column', zIndex: 14}} />

            <TouchableOpacity
              onPress={this.toggleHelp.bind(this)}
              style={{flex: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{color: '#333332'}}><Icon2 name='help-circle' size={40} /></Text>
              <Text style={{color: '#333332', fontSize: 15, fontWeight: 'bold'}}>{'Help'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onRecordPress()}
              style={{width: 80, height: 80, zIndex: 15, borderRadius: 40, bottom: 10, backgroundColor: buttonColor, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.6, shadowRadius: 1, position: 'absolute'}}>
              <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: 'transparent', borderWidth: 2, borderColor: '#F0F1EE', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#F0F1EE'}}>{recordWord}</Text>
              </View>
            </TouchableOpacity>

            <View style={{height: 100, flex: 4, flexDirection: 'column', zIndex: 14}} />

            <TouchableOpacity
              onPress={() => this.state.recording ? () => {} : this.props.closeWindow()}
              style={{flex: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{color: '#333332'}}><Icon3 name='md-arrow-round-back' size={40} /></Text>
              <Text style={{color: '#333332', fontSize: 15, fontWeight: 'bold'}}> Back</Text>
            </TouchableOpacity>

            <View style={{height: 100, flex: 1, flexDirection: 'column', zIndex: 14}} />
          </View>
        </View>
    )
  }
/* eslint-enable */

}
