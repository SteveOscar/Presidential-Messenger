import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Easing, LayoutAnimation, Dimensions, ScrollView, Animated, Alert, TextInput, AsyncStorage } from 'react-native'
import styles from './Styles/ZStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/Ionicons'


const { height, width } = Dimensions.get('window')

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
      showSave: false,
      saveHeight: 0,
      context: this.props.context,
      fileName: '',
      saveNotice: ''
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const a = this.state.postRecordingHeight !== nextState.postRecordingHeight
    const b = this.state.showSave !== nextState.showSave
    if (a || b) {
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

      const that = this
      setTimeout(function () {
        that.playSpin(1500)
        // that.saveSpin(1500)
      }, 400)

      if (this.state.saveNotice !== 'Your recording was saved' && nextState.saveNotice === 'Your recording was saved') {
        this.props.refreshData(this.props.myContext)
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
          onPress={() => this.onWordPress(wordData, this.props.myContext)}
          onLongPress={() => this.props.deleteWord(word, i, this.props.myContext)} >
          <Text style={[styles.wordText, { color: '#F0F1EE' }]}>{word}</Text>
          <Text style={[styles.identifierText, {color: wordData.person.color}]}>{wordData.person.name.toUpperCase()}</Text>
        </TouchableOpacity>
      )
    })
  }

  onWordPress (wordData, context) {
    const { startTime, record } = this.state
    this.props.onWordPress(wordData, context)
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

  playSavedPhrase (context) {
    const { record } = this.state
    if (!record.length) { return }
    this.playSpin(2000)
    this.props.playRecording(record, context)
  }

  clearPostRecordScreen (context) {
    Alert.alert(
      'Clear Recording?',
      'You will be starting over',
      [
        { text: 'Confirm',
          onPress: () => {
            this.props.remount(context)
          }
        },
        { text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'}
      ],
      { cancelable: false }
    )
  }

  showSaveScreen (context) {
    this.saveSpin(1000)
    this.setState({ showSave: true, saveHeight: height / 2, postRecordingHeight: 0 })
  }

  recordButtonColor () {
    const { recording } = this.state
    if (recording) { return '#FB6964' }
    return '#1352A2'
  }

  cancelSave () {
    this.setState({
      showSave: false,
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
      await AsyncStorage.setItem(name, JSON.stringify(record)).then((success) => {
        this.setState({
          showSave: false,
          // saveHeight: 0,
          postRecordingHeight: 0,
          saveNotice: 'Your recording was saved'
        })
        const that = this
        setTimeout(function () {
          that.setState({ saveNotice: '' })
        }, 2000)
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
          <Text style={{color: 'yellow', fontSize: 12}}>{saveNotice}</Text>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  renderSaveView () {
    const { fileName, showSave, saveHeight } = this.state
    if (showSave) {
      return (
        <View style={{width: width, height: height, position: 'absolute', zIndex: 14, backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
          <View style={{ width: width, height: saveHeight, top: height / 4, position: 'absolute', zIndex: 15, backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <Text style={{color: 'white', fontSize: 20, margin: 15}}>Enter A Name</Text>
            <TextInput
              style={{height: 40, paddingLeft: 5, borderRadius: 5, padding: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', marginLeft: 10, marginRight: 10}}
              onChangeText={(text) => this.setState({fileName: text})}
              value={fileName}
              autoFocus={true}
            />
            <View style={{flex: 1, alignItems: 'center', backgroundColor: 'transparent', width: width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={{margin: 20, alignItems: 'center', justifyContent: 'center', width: 90, height: 100}}>
                <Text style={{ color: '#1352A2', fontSize: 20, fontWeight: 'bold', backgroundColor: 'transparent'}}
                      onPress={() => this.savePhrase(this.props.myContext)}>
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

  renderPostRecording () {
    const { postRecordingHeight, playSpinValue, saveSpinValue } = this.state
    const { playing } = this.props
    let playIcon = playing ? 'stop-circle' : 'play-circle-o'
    let playText = playing ? 'Stop' : 'Play'
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

          <TouchableOpacity
            style={{margin: 20, alignItems: 'center', justifyContent: 'center', width: 90, height: 100}}>
            <Animated.Text style={{ transform: [{perspective: perspectiveAmount}, {rotateY: rotateSave}],
                                    color: '#1352A2', fontSize: 20, fontWeight: 'bold', backgroundColor: 'transparent'}}
                                    onPress={() => this.showSaveScreen(this.props.myContext)}>
              <Icon name='save' size={80} />
            </Animated.Text>
            <Text style={{color: 'white', fontSize: 35, fontWeight: 'bold', backgroundColor: 'transparent'}}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => playing ? this.props.stopCustomPhrase(this.props.myContext) : this.playSavedPhrase(this.props.myContext)}
            style={{margin: 20, alignItems: 'center', justifyContent: 'center', width: 90, height: 100}}>
            <Animated.Text style={{ transform: [{perspective: perspectiveAmount}, {rotateY: rotatePlay}],
                                    color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              <Icon name={playIcon} size={80} />
            </Animated.Text>
            <Text style={{color: 'white', fontSize: 35, fontWeight: 'bold'}}>{playText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.clearPostRecordScreen(this.props.myContext)}
            style={{margin: 20, alignItems: 'center', justifyContent: 'center', width: 100, height: 100}}>
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

  autoPlayPressed (context) {
    const { autoPlaying } = this.props
    if (this.state.recording) { return }
    if(autoPlaying) {
      this.props.stopAutoPlay(this.props.myContext)
    } else {
      this.props.autoPlay(this.props.myContext)
    }
  }

  render () {
    const { recording, record } = this.state
    const { autoPlaying } = this.props
    let recordWord = recording ? 'Stop' : 'Record'
    let buttonColor = this.recordButtonColor()
    let autoPlayIcon = autoPlaying ? 'stop-circle' : 'play'
    let autoPlayText = autoPlaying ? 'Stop' : 'AutoPlay'
    // let playTextColor = record.length && !recording ? '#1352A2' : 'grey'
    // let playButtonColor = record.length && !recording ? '#1352A2' : 'transparent'
    let tabColor = recording ? '#1352A2' : '#FB6964'
    return (
        <View style={{width: '100%', height: height, position: 'absolute', zIndex: 11}}>
          {this.renderErrors()}
          {this.renderPostRecording()}
          {this.renderSaveView()}
          <ScrollView style={{paddingTop: 15, position: 'absolute', zIndex: 12, height: height-100, bottom: 100, width: '100%', backgroundColor: '#333332'}}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1, justifyContent: 'center'}}>
              { this.phrase() }
            </View>
          </ScrollView>
          <View style={{height: 100, bottom: 0, position: 'absolute', width: '100%', backgroundColor: tabColor, zIndex: 12, flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>

            <View style={{height: 100, flex: 1, flexDirection: 'column', zIndex: 14}} />

            <TouchableOpacity
              onPress={() => this.state.recording ? () => {} : this.props.closeWindow(this.props.myContext)}
              style={{flex: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{color: '#333332'}}><Icon2 name='md-arrow-round-back' size={40} /></Text>
              <Text style={{color: '#333332', fontSize: 15, fontWeight: 'bold'}}> Back</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onRecordPress()}
              style={{width: 80, height: 80, zIndex: 15, borderRadius: 40, bottom: 10, backgroundColor: buttonColor, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.6, shadowRadius: 1, position: 'absolute'}}>
              <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: 'transparent', borderWidth: 2, borderColor: '#F0F1EE', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#F0F1EE'}}>{recordWord}</Text>
              </View>
            </TouchableOpacity>

            <View style={{height: 100, flex: 4, flexDirection: 'column', zIndex: 14}} />

            <TouchableOpacity
              onPress={() => this.autoPlayPressed(this.props.myContext)}
              style={{flex: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{color: '#333332'}}><Icon name={autoPlayIcon} size={40} /></Text>
              <Text style={{color: '#333332', fontSize: 15, fontWeight: 'bold'}}>{autoPlayText}</Text>
            </TouchableOpacity>


            <View style={{height: 100, flex: 1, flexDirection: 'column', zIndex: 14}} />
          </View>
        </View>
    )
  }
/* eslint-enable */

}
