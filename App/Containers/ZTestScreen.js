import React from 'react'
import { Text, View, Alert, TouchableOpacity, AsyncStorage, Dimensions, StatusBar } from 'react-native'
import ZGridContainer from '../Components/ZGridContainer'
import ZCategorySelector from '../Components/ZCategorySelector'
import ZPhraseView from '../Components/ZPhraseView'
import ZPhrasePlayer from '../Components/ZPhrasePlayer'
import ZPersonSelector from '../Components/ZPersonSelector'
import ZLoadPhrases from '../Components/ZLoadPhrases'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon4 from 'react-native-vector-icons/Entypo'

// Styles
import styles from './Styles/ZTestScreenStyles'

// Import the react-native-sound module
const Sound = require('react-native-sound')

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback')
const People = [ { name: 'trump', color: '#FB6964' }, { name: 'obama', color: '#71abf2' } ]
const { height, width } = Dimensions.get('window')
// const { width } = Dimensions.get('window')

const Words = {
  obama: {
    Who: ['myself', 'me', 'them', 'officers', 'federal_government', 'the_cia', 'chinese', 'british', 'npr', 'her', 'the_dnc', 'somebody', 'you', 'the_koch_brothers', 'the_united_states_senate', 'chicagoans', 'democrats', 'donald_trump', 'people'],
    What: ['concerns', 'relationship', 'agency', 'terrorism', 'revelation', 'vacation', 'what', 'substance', 'manipulation', 'consequence', 'climate_change', 'generation', 'races', 'presidency', 'fish_fries', 'party', 'bathrooms', 'obama_care', 'fries', 'it', 'states', 'chunks', 'challenge', 'issues', 'trust'],
    Descriptions: ['incredible', 'explicit', 'islamic', 'political', 'vulnerable', 'consitently', 'controversial', 'deep', 'passionate', 'lost', 'a_lot', 'meaningful', 'big', 'public', 'salient', 'happy', 'proud', 'complicated', 'ignorant', 'hard'],
    Verbs: ['concerns', 'have', 'steal', 'impact', 'call', 'like', 'read', 'avoid', 'doubt', 'contributed', 'lost', 'swirl', 'were', 'help', 'rise_up', 'start', 'campaign', 'leave', 'financing', 'think', 'races', 'hearing', 'felt', 'support', 'was', 'feel', 'had', 'spending', 'benefit', 'challenge', 'are', 'is', 'promote', 'give', 'made', 'has', 'party', 'talk', 'trust', 'builds'],
    Time: ['months', 'before', 'decade', 'among', 'now', 'after', 'always', 'twelve', 'forty_five', 'immediately', 'where'],
    Misc: ['and', 'on', 'in', 'a', 'maybe', 'of', 'by', 'to', 'the', 'any', 'if', 'at', 'actually', 'from', 'well_uh', 'or', 'dont', 'that', 'then', 'but', 'ughhh', 'for', 'so', 'who', 'because', 'wellll'],
    Vulgarity: ['bitch', 'mother_fucker', 'and_and', 'trumped_up', 'fake_news', 'mother_fuckers', 'sorry_ass', 'shit', 'damn_fries', 'whos_ass', 'noo', 'pussy', 'goddam', 'whatever']
  },
  trump: {
    Who: ['mexico', 'chicago', 'president_obama', 'abe_lincoln', 'the_cia', 'others', 'somebody', 'you', 'president', 'they', 'you2', 'afghanistan', 'democrats', 'women', 'people', 'fox', 'sean'],
    What: ['primaries', 'bread', 'dollars', 'mess', 'college', 'work', 'audience', 'intelligence', 'problem', 'catastrophe', 'victory', 'states'],
    Descriptions: ['correct', 'phenomenal', 'total', 'absolutely', 'fabulous', 'approved', 'smarter', 'unfairly', 'legitamite', 'illegal', 'strongly', 'dead'],
    Verbs: ['vote', 'spoke', 'work', 'does', 'shot', 'help', 'approve', 'forgot', 'did', 'demean'],
    Time: ['two', 'now', 'six', 'trillion', 'before', 'years', 'never', 'here'],
    Misc: ['of', 'from', 'yes', 'without', 'who', 'to', 'wow', 'in'],
    Vulgarity: ['waterboarding']
  }
}

export default class ZTestScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      person: { name: 'trump', color: '#FB6964' },
      category: 'Who',
      phrase: [],
      selected: null,
      autoMode: true,
      playingCustomPhrase: false,
      playingAutoPhrase: false,
      fileNames: [],
      showLoadPhrases: false,
      showHelpHeight: 0,
      showHelp: false
    }
  }

  componentWillMount () {
    window.autoPlayPhrase = this.autoPlayPhrase.bind(this)
    window.phraseCount = 0
  }

  componentDidMount () {
    this.getData()
  }

  async getData (context) {
    const that = context || this
    try {
      const values = await AsyncStorage.getAllKeys()
      if (values !== null) {
        const files = values.filter((value) => value.slice(0, 10) === '@messenger')
        const fileNames = files.map((value) => value.slice(11, value.length))
        that.setState({ fileNames })
        console.log('files: ', fileNames)
      }
    } catch (error) {
      console.log('ERROR retrieving fileNames')
    }
  }

  removeFile (file, context) {
    const existing = context.state.fileNames
    const index = existing.indexOf(file)
    if (index !== -1) {
      existing.splice(index, 1)
    }
    context.setState({ fileNames: existing })
    console.log('fileNames: ', existing)
  }

  renderPhrasePlayer () {
    if (!this.state.autoMode) {
      return (
        <ZPhrasePlayer
          phrase={this.state.phrase}
          deleteWord={this.deleteWord}
          onWordPress={this.phraseWordPressed}
          selected={this.state.selected}
          myContext={this}
          closeWindow={this.closePhraseWindow}
          playRecording={this.playRecording}
          playing={this.state.playingCustomPhrase}
          autoPlaying={this.state.playingAutoPhrase}
          remount={this.remount}
          fileNames={this.state.fileNames}
          autoPlay={this.autoPlayPhrase}
          stopAutoPlay={this.stopAutoPlay}
          stopCustomPhrase={this.stopCustomPhrase}
          refreshData={this.getData}
        />
      )
    } else {
      return (
        <View />
      )
    }
  }

  renderHelp () {
    const { showHelp } = this.state
    if (showHelp) {
      return (
        <View style={{width: width, height: height, position: 'absolute', zIndex: 500, backgroundColor: 'rgba(255, 255, 255, 0.82)'}}>
          <View style={{width: width, height: 100, top: 0, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {marginTop: 30}]}>1: Select Speaker</Text>
            <Text style={[styles.helpText, {shadowColor: 'blue', marginTop: 2}]}><Icon3 name='ios-person-add' size={30} style={{paddingTop: 20}} /></Text>
          </View>
          <View style={{width: width, height: 100, top: 85, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {}]}>2: Select Category</Text>
            <Text style={[styles.helpText, {shadowColor: 'blue'}]}><Icon2 name='gesture-swipe-left' size={30} /></Text>
          </View>
          <View style={{width: width, height: 100, top: 280, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {}]}>3: Tap words to preview</Text>
            <Text style={[styles.helpText, {paddingTop: 13}]}>(Press and hold to add to word tray.</Text>
            <Text style={[styles.helpText, {paddingTop: 13}]}>You can add words from multiple speakers)</Text>
            <Text style={[styles.helpText, {shadowColor: 'blue'}]}><Icon2 name='gesture-tap' size={30} /></Text>
            {/* <Text style={[styles.helpText, {}]}><Icon2 name='gesture-double-tap' size={30} /></Text> */}
          </View>
          <View style={{width: width, height: 100, bottom: 70, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {}]}>(Words Bucket <Icon4 name='bucket' size={30} />)</Text>
          </View>
          <View style={{width: width, height: 100, bottom: 0, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {marginTop: 30}]}>5: Tap 'Build Phrase'</Text>
            <Text style={[styles.helpText, {shadowColor: 'blue'}]}><Icon name='magic' size={30} /></Text>
          </View>
          <Text onPress={this.toggleHelp.bind(this)} style={[styles.helpText, {position: 'absolute', left: 12, bottom: 12, fontSize: 45, shadowColor: 'blue', color: 'white'}]}>X</Text>
          <Text onPress={this.toggleHelp.bind(this)} style={[styles.helpText, {position: 'absolute', left: 13, bottom: 8, fontSize: 10, shadowColor: 'blue', color: 'black'}]}>close</Text>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  renderPhraseLoader () {
    if (this.state.showLoadPhrases) {
      return (
        <ZLoadPhrases
          fileNames={this.state.fileNames}
          myContext={this}
          closeLoadScreen={this.closeLoadScreen}
          playSavedPhrase={this.playSavedPhrase}
          removeFile={this.removeFile}
        />
      )
    } else {
      return (
        <View />
      )
    }
  }

  render () {
    const { phrase, showHelp } = this.state
    const navButtonColors = phrase.length ? '#333332' : 'grey'
    const nextColor = phrase.length ? '#1352A2' : 'grey'
    isIphoneX = (height / width).toFixed(2) == 2.17
    return (
      <View style={styles.mainContainer}>
        <StatusBar hidden={!isIphoneX} />
        <View style={styles.container}>

          {this.renderHelp()}
          {this.renderPhrasePlayer()}
          {this.renderPhraseLoader()}

          {/* <View style={styles.section} >
            <Image source={Images.ready} />
          </View> */}

          <ZPersonSelector
            person={this.state.person.name}
            people={People}
            onPersonPress={this.personPressed}
            myContext={this}
          />

          <ZCategorySelector
            updateCategory={this.updateCategory}
            selected={this.state.category}
            myContext={this}
          />
          <ZGridContainer
            words={Words[this.state.person.name][this.state.category]}
            onWordPress={this.wordPressed}
            onAddWord={this.addWord}
            myContext={this}
          />
          <ZPhraseView
            phrase={this.state.phrase}
            deleteWord={this.deleteWord}
            onWordPress={this.phraseWordPressed}
            myContext={this}
          />
          <View style={{height: 100, bottom: -85, position: 'absolute', width: '100%', backgroundColor: '#FB6964', zIndex: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1}}>

            <TouchableOpacity
              onPress={this.toggleHelp.bind(this)}
              style={{flex: 4, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{color: '#333332'}}><Icon2 name='help-circle' size={40} /></Text>
              <Text style={{color: '#333332', fontSize: 12, fontWeight: 'bold'}}>Help</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.loadPhrases.bind(this)}
              style={{flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{color: '#333332'}}><Icon name='save' size={40} /></Text>
              <Text style={{color: '#333332', fontSize: 12, fontWeight: 'bold'}}>Load</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.clearPhrase.bind(this)}
              style={{flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{color: navButtonColors}}><Icon name='signing' size={40} /></Text>
              <Text style={{color: navButtonColors, fontSize: 12, fontWeight: 'bold'}}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.toggleModeSwitch.bind(this)}
              style={{flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <Text style={{color: nextColor}}><Icon name='magic' size={40} /></Text>
              <Text style={{color: navButtonColors, fontSize: 12, fontWeight: 'bold'}}>Build Phrase</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  closeLoadScreen (context) {
    context.setState({ showLoadPhrases: false })
  }

  loadPhrases () {
    this.setState({ showLoadPhrases: true })
  }

  playingCustomPhrase () {
    this.setState({playingCustomPhrase: true})
  }

  toggleModeSwitch () {
    if (!this.state.phrase.length) { return }
    const newVal = !this.state.autoMode
    this.setState({ autoMode: newVal })
  }

  remount (context) {
    const oldVal = context.autoMode
    const newVal = !context.autoMode
    context.setState({ autoMode: newVal })
    context.setState({ autoMode: oldVal })
  }

  closePhraseWindow (context) {
    context.toggleModeSwitch()
  }

  clearPhrase () {
    this.setState({ phrase: [], selected: null })
  }

  toggleHelp () {
    const prev = this.state.showHelp
    this.setState({ showHelp: !prev })
  }

  personPressed (person, context) {
    context.setState({ person: person })
  }

  wordPressed (word, context) {
    let wordData = { word: word, person: { name: context.state.person.name } }
    context.playSound(wordData)
  }

  phraseWordPressed (wordData, context) {
    context.playSound(wordData)
  }

  addWord (word, context) {
    let originalPhrase = context.state.phrase
    originalPhrase.push({ word: word, person: context.state.person })
    console.log('Phrase state: ', originalPhrase)
    context.setState({ phrase: originalPhrase })
  }

  deleteWord (word, index, context) {
    Alert.alert(
      'Remove this word?',
      word,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: function () { context.deleteWordConfirmed(word, index) }}
      ],
      { cancelable: false }
    )
  }

  deleteWordConfirmed (word, index) {
    let phrase = this.state.phrase
    phrase.splice(index, 1)
    this.setState({ phrase: phrase })
  }

  updateCategory (cat, context) {
    context.setState({ category: cat })
  }

  playSound (wordData, recordingTrigger) {
    if (recordingTrigger && !this.state.playingCustomPhrase) {
      this.setState({ selected: null, playingAutoPhrase: false })
      window.phraseCount = 0
      return
    }
    const person = wordData.person.name
    const word = wordData.word
    // console.log('Playing ', `${person}_${word}.mp3`)
    const file = `${person}_${word}.mp3`
    const click = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      } else {
        click.play((success) => {
          if (success) {
            // console.log('successfully finished playing')
          } else {
            console.log('playback failed due to audio decoding errors')
          }
        })
      }
    })
  }

  stopAutoPlay (context) {
    window.phraseCount = 1000
  }

  stopCustomPhrase (context) {
    context.setState({ playingCustomPhrase: false })
  }

  autoPlayPhrase (context) {
    const phrase = context.state.phrase
    if ((window.phraseCount + 1) > phrase.length) {
      window.phraseCount = 0
      context.setState({ selected: null, playingAutoPhrase: false })
      return
    }
    context.setState({ selected: window.phraseCount, playingAutoPhrase: true })
    const person = phrase[window.phraseCount].person.name
    const word = phrase[window.phraseCount].word
    console.log('Playing ', `${person}_${word}.mp3`)
    const file = `${person}_${word}.mp3`
    const sound = new Sound(file, Sound.MAIN_BUNDLE, () => {
      console.log('Sound load callback...')
      sound.play((success) => {
        let count = window.phraseCount
        window.phraseCount = count + 1
        window.autoPlayPhrase(context)
      })
    })
  }

  async playSavedPhrase (fileName, context) {
    const name = `@messenger:${fileName}`
    const values = await AsyncStorage.getItem(name)
    if (values !== null) {
      const wordData = JSON.parse(values)
      context.playRecording(wordData, context)
    }
  }

  playRecording (wordData, context) {
    context.setState({playingCustomPhrase: true})
    const timings = wordData.map((data) => data.time)
    timings.map((num, i, arr) => {
      let that = context
      window[i] = wordData[i]
      setTimeout(function () {
        console.log('firing play sound: ', window[i])
        that.playSound(window[i], true)
        if (!that.state.playingCustomPhrase || (arr.length === i + 1)) {
          window.phraseCount = 0
          that.setState({ selected: null, playingCustomPhrase: false })
          return
        }
      }, num)
    })
  }

}
