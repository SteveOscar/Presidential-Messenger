import React from 'react'
import { Text, View, Alert, TouchableOpacity, AsyncStorage, Dimensions, StatusBar, ActivityIndicator } from 'react-native'
import ZGridContainer from '../Components/ZGridContainer'
import ZCategorySelector from '../Components/ZCategorySelector'
import ZPhraseView from '../Components/ZPhraseView'
import ZPhrasePlayer from '../Components/ZPhrasePlayer'
import ZPersonSelector from '../Components/ZPersonSelector'
import ZTerms from '../Components/ZTerms'
import ZLoadPhrases from '../Components/ZLoadPhrases'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon4 from 'react-native-vector-icons/Entypo'

// Styles
import styles from './Styles/ZTestScreenStyles'

import { NativeModules } from 'react-native'
const { InAppUtils } = NativeModules

// Import the react-native-sound module
const Sound = require('react-native-sound')

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback')
const People = [ { name: 'trump', color: '#FB6964' }, { name: 'obama', color: '#71abf2' } ]
const { height, width } = Dimensions.get('window')
// const { width } = Dimensions.get('window')
const check = require('isiphonex');

const Words = {
  obama: {
    Who: ['myself', 'me', 'them', 'officers', 'federal_government', 'the_CIA', 'Chinese', 'British', 'NPR', 'her', 'the_DNC', 'somebody', 'you', 'the_Koch_brothers', 'the_United_States_senate', 'Chicagoans', 'democrats', 'Donald_Trump', 'people'],
    What: ['concerns', 'relationship', 'agency', 'terrorism', 'revelation', 'vacation', 'what', 'substance', 'manipulation', 'consequence', 'climate_change', 'generation', 'races', 'presidency', 'fish_fries', 'party', 'bathrooms', 'obama_care', 'fries', 'it', 'states', 'chunks', 'challenge', 'issues', 'trust'],
    Descriptions: ['incredible', 'explicit', 'islamic', 'political', 'vulnerable', 'consistently', 'controversial', 'deep', 'passionate', 'lost', 'a_lot', 'meaningful', 'big', 'public', 'salient', 'happy', 'proud', 'complicated', 'ignorant', 'hard'],
    Verbs: ['concerns', 'have', 'steal', 'impact', 'call', 'like', 'read', 'avoid', 'doubt', 'contributed', 'lost', 'swirl', 'were', 'help', 'rise_up', 'start', 'campaign', 'leave', 'financing', 'think', 'races', 'hearing', 'felt', 'support', 'was', 'feel', 'had', 'spending', 'benefit', 'challenge', 'are', 'is', 'promote', 'give', 'made', 'has', 'party', 'talk', 'trust', 'builds'],
    Time: ['months', 'before', 'decade', 'among', 'now', 'after', 'always', 'twelve', 'forty_five', 'immediately', 'where'],
    Misc: ['and', 'on', 'in', 'a', 'maybe', 'of', 'by', 'to', 'the', 'any', 'if', 'at', 'actually', 'from', 'well_uh', 'or', 'dont', 'that', 'then', 'but', 'ughhh', 'for', 'so', 'who', 'because', 'wellll'],
    Bonus: ['bitch', 'mother_fucker', 'and_and', 'trumped_up', 'fake_news', 'mother_fuckers', 'sorry_ass', 'shit', 'damn_fries', 'whos_ass', 'noo', 'pussy', 'goddam', 'whatever']
  },
  trump: {
    Who: ['Mexico', 'the_DNC', 'Bernie', 'fellas', 'ISIS', 'Chicago', 'president_Obama', 'Abe_Lincoln', 'the_CIA', 'others', 'somebody', 'you', 'president', 'they', 'you2', 'Afghanistan', 'democrats', 'women', 'people', 'fox', 'Sean'],
    What: ['primaries', 'party', 'terror', 'tax', 'bread', 'dollars', 'mess', 'college', 'work', 'audience', 'intelligence', 'problem', 'catastrophe', 'victory', 'states'],
    Descriptions: ['correct', 'tremendous', 'legally', 'phenomenal', 'total', 'absolutely', 'fabulous', 'approved', 'smarter', 'unfairly', 'legitamite', 'illegal', 'strongly', 'dead'],
    Verbs: ['vote', 'party', 'cut', 'create', 'tax', 'look', 'think', 'spoke', 'work', 'does', 'shot', 'help', 'approve', 'forgot', 'did', 'demean'],
    Time: ['two', 'now', 'today', 'six', 'trillion', 'before', 'years', 'never', 'here'],
    Misc: ['of', 'and', 'please', 'ya_know', 'but', 'without', 'from', 'yes', 'without', 'who', 'to', 'wow', 'in'],
    Bonus: ['waterboarding', 'at_all', 'heee']
  }
}

const products = [
   'com.stevenolson.presidentialmessenger2',
];

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
      showHelp: false,
      showTerms: false,
      potusMode: false,
      animating: false
    }
  }

  componentWillMount () {
    window.autoPlayPhrase = this.autoPlayPhrase.bind(this)
    window.phraseCount = 0
  }

  componentDidMount () {
    this.checkTerms()
    this.getData()
    this.checkPurchaseState()
  }

  async checkTerms () {
    const accepted = await AsyncStorage.getItem('termsAccepted')
    console.log('terms acceptance not found, showing terms')
    // if(true) { this.setState({ showTerms: true }) }
    if(!accepted) { this.setState({ showTerms: true }) }
  }

  acceptTerms() {
    this.setState({ showTerms: false })
  }

  async checkPurchaseState () {
    const values = await AsyncStorage.getAllKeys()
    if(values.indexOf('potusMode') == -1) {
      await AsyncStorage.setItem('potusMode', 'disabled')
    }
    const potusMode = await AsyncStorage.getItem('potusMode')
    const potusModeEnabled = potusMode == 'enabled'
    this.setState({ potusMode: potusModeEnabled })
    // this.setState({ potusMode: potusModeEnabled })
  }

  buyProduct(product) {
    var productIdentifier = product.identifier
    this.setState({ animating: true })
    InAppUtils.canMakePayments((canMakePayments) => {
      this.setState({ animating: false })
      if(canMakePayments) {
        this.setState({ animating: true })
        InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
          this.setState({ animating: false })
           if(response && response.productIdentifier) {
              // Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
              // setState of potusmode true
              AsyncStorage.setItem('potusMode', 'enabled')
              this.setState({ potusMode: true })
           } else if(error) {
             console.log(error.message)
             alert(error.message)
           }
        })
      }
      if(!canMakePayments) {
        this.setState({ animating: false })
        Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check your iTunes account.');
      }
    })
  }

  restorePurchases() {
    this.setState({ animating: true })
    InAppUtils.restorePurchases((error, response) => {
      this.setState({ animating: false })
       if(error) {
          Alert.alert('itunes Error', 'Could not connect to itunes store.')
       } else {
          if (response.length === 0) {
            Alert.alert('No Purchases', "We didn't find any purchases to restore.")
            return
          }

          response.some((purchase) => {
            if (purchase.productIdentifier === 'com.stevenolson.presidentialmessenger') {
              this.setState({ potusMode: true })
              Alert.alert('Successful', "Potus Mode has been restored!")
              return true
            }
          }, this)
       }
    })
  }

  offerPurchase() {
    this.setState({ animating: true })
    InAppUtils.loadProducts(products, (error, products) => {
      this.setState({ animating: false })
      console.log('Load products result: ', products)
      product = products ? products[0] : null
      if(!product) {
        Alert.alert(
          'This feature is locked',
          'Unable to connect to iTunes, check your connection or try restarting the app'
        )
      } else {
        Alert.alert(
          'Potus Mode Required',
          `Unlocks all restricted words and the ability to load/replay recorded phrases. One-time purchase of ${product.priceString}`,
          [
            {text: 'Enable Potus Mode', onPress: () => this.buyProduct(product), style: 'destructive'},
            {text: 'Restore previous purchase', onPress: () => this.restorePurchases()},
            {text: 'Maybe Later', onPress: () => console.log('Cancel Pressed')}
          ],
          { cancelable: false }
        )
      }
    })
  }

  async getData () {
    const that = this
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

  removeFile (file) {
    const existing = this.state.fileNames
    const index = existing.indexOf(file)
    if (index !== -1) {
      existing.splice(index, 1)
    }
    this.setState({ fileNames: existing })
    console.log('fileNames: ', existing)
  }

  renderPhrasePlayer () {
    if (!this.state.autoMode) {
      return (
        <ZPhrasePlayer
          phrase={this.state.phrase}
          deleteWord={this.deleteWord.bind(this)}
          onWordPress={this.phraseWordPressed.bind(this)}
          selected={this.state.selected}
          closeWindow={this.closePhraseWindow.bind(this)}
          playRecording={this.playRecording.bind(this)}
          playing={this.state.playingCustomPhrase}
          autoPlaying={this.state.playingAutoPhrase}
          remount={this.remount.bind(this)}
          fileNames={this.state.fileNames}
          autoPlay={this.autoPlayPhrase.bind(this)}
          stopAutoPlay={this.stopAutoPlay}
          refreshData={this.getData.bind(this)}
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
    const top1 = check.isIphoneX() ? 102 : 85
    const top2 = check.isIphoneX() ? 10 : 0
    const top3 = check.isIphoneX() ? 40 : 5
    const bottom1 = check.isIphoneX() ? 90 : 70
    const bottom2 = check.isIphoneX() ? 15 : 0
    if (showHelp) {
      return (
        <TouchableOpacity onPress={this.toggleHelp.bind(this)} style={{width: width, height: height, position: 'absolute', zIndex: 500, backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
          <View style={{width: width, height: 100, top: top2, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {marginTop: 30}]}>1: Select a speaker</Text>
            <Text style={[styles.helpText, {shadowColor: '#71abf2', marginTop: 2}]}><Icon3 name='ios-person-add' size={30} style={{paddingTop: 20}} /></Text>
          </View>
          <View style={{width: width, height: 100, top: top1, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {}]}>2: Select a category</Text>
            <Text style={[styles.helpText, {shadowColor: '#71abf2'}]}><Icon2 name='gesture-swipe-left' size={30} /></Text>
          </View>
          <View style={{width: width, height: 100, top: 280, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {}]}>3: Tap words to preview</Text>
            <Text style={[styles.helpText, {paddingTop: 13}]}>Press and hold to add to bucket.</Text>
            <Text style={[styles.helpText, {paddingTop: 13}]}>You can add words from multiple speakers and categories.</Text>
            <Text style={[styles.helpText, {shadowColor: '#71abf2'}]}><Icon2 name='gesture-tap' size={30} /></Text>
            {/* <Text style={[styles.helpText, {}]}><Icon2 name='gesture-double-tap' size={30} /></Text> */}
          </View>
          <View style={{width: width, height: 100, bottom: bottom1, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {}]}>(Words Bucket <Icon4 name='bucket' size={30} />)</Text>
          </View>
          <View style={{width: width, height: 100, bottom: bottom2, position: 'absolute', backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingLeft: 10}}>
            <Text style={[styles.helpText, {marginTop: 30}]}>5: Tap 'Build Phrase' to go to the recording screen</Text>
            <Text style={[styles.helpText, {shadowColor: '#71abf2'}]}><Icon name='magic' size={30} /></Text>
          </View>
          <Text onPress={this.toggleHelp.bind(this)} style={[styles.helpText, {position: 'absolute', left: 8, top: top3, fontSize: 10, shadowColor: '#71abf2', color: 'white'}]}>tap to close</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <View />
      )
    }
  }

  renderSpinner () {
    const { animating } = this.state
    if(animating) {
      return(
        <View style={{alignItems: 'center', justifyContent: 'center', width: width, height: height, backgroundColor: 'transparent', position: 'absolute', zIndex: 999999}}>
          <ActivityIndicator
           animating = {animating}
           color = '#bc2b78'
           size = "large"
           style = {styles.activityIndicator}/>
        </View>
      )
    } else {
      return (
        <View/>
      )
    }
  }

  renderTerms () {
    if(this.state.showTerms) {
      return (
        <ZTerms
          closeTerms={this.acceptTerms.bind(this)}
        />
      )
    } else {
      return (<View />)
    }
  }

  renderPhraseLoader () {
    if (this.state.showLoadPhrases) {
      return (
        <ZLoadPhrases
          fileNames={this.state.fileNames}
          closeLoadScreen={this.closeLoadScreen.bind(this)}
          playSavedPhrase={this.playSavedPhrase.bind(this)}
          removeFile={this.removeFile.bind(this)}
          playing={this.state.playingCustomPhrase}
        />
      )
    } else {
      return (<View />)
    }
  }

  renderLoadText() {
    const { potusMode } = this.state
    if(!potusMode) {
      return (
        <Text style={{color: '#333332'}}>Recordings  <Icon name='lock' size={15} /></Text>
      )
    } else {
      return (
        'Recordings'
      )
    }
  }

  render () {
    const { phrase, potusMode } = this.state
    const navButtonColors = phrase.length ? '#333332' : 'grey'
    const nextColor = phrase.length ? '#1352A2' : 'grey'
    const isIphoneX = (height / width).toFixed(2) == 2.17
    const bottomHeight = isIphoneX ? 140 : 100
    return (
      <View style={styles.mainContainer}>
        <StatusBar hidden={!isIphoneX} />
        <View style={styles.container}>
          {this.renderTerms()}
          {this.renderHelp()}
          {this.renderPhrasePlayer()}
          {this.renderPhraseLoader()}
          {this.renderSpinner()}

          <ZPersonSelector
            person={this.state.person.name}
            people={People}
            onPersonPress={this.personPressed.bind(this)}
            isIphoneX={isIphoneX}
          />

          <ZCategorySelector
            updateCategory={this.updateCategory.bind(this)}
            selected={this.state.category}
            potusMode={potusMode}
          />
          <ZGridContainer
            person={this.state.person}
            words={Words[this.state.person.name][this.state.category]}
            onWordPress={this.wordPressed.bind(this)}
            onAddWord={this.addWord.bind(this)}
            potusMode={potusMode}
            category={this.state.category}
          />
          <ZPhraseView
            phrase={this.state.phrase}
            deleteWord={this.deleteWord.bind(this)}
            onWordPress={this.phraseWordPressed.bind(this)}
            isIphoneX={isIphoneX}
          />
          <View style={{height: bottomHeight, bottom: -85, position: 'absolute', width: '100%', backgroundColor: '#FB6964', zIndex: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1}}>

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
              <Text style={{color: '#333332', fontSize: 12, fontWeight: 'bold'}}>{this.renderLoadText()}</Text>
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

  closeLoadScreen () {
    this.setState({ showLoadPhrases: false })
  }

  loadPhrases () {
    if(!this.state.potusMode) {
      this.offerPurchase()
    } else {
      this.setState({ showLoadPhrases: true })
    }
  }

  playingCustomPhrase () {
    this.setState({playingCustomPhrase: true})
  }

  toggleModeSwitch () {
    const { phrase, autoMode } = this.state
    if (!phrase.length && autoMode) { return }
    const newVal = !this.state.autoMode
    this.setState({ autoMode: newVal })
  }

  remount () {
    const oldVal = this.autoMode
    const newVal = !this.autoMode
    this.setState({ autoMode: newVal })
    this.setState({ autoMode: oldVal })
  }

  closePhraseWindow () {
    this.toggleModeSwitch()
  }

  clearPhrase () {
    const component = this
    if(!this.state.phrase.length) { return }
    Alert.alert(
      'Clear Word Bucket?',
      'Please confirm this action',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: function () { component.setState({ phrase: [], selected: null }) }}
      ],
      { cancelable: false }
    )
  }

  toggleHelp () {
    const prev = this.state.showHelp
    this.setState({ showHelp: !prev })
  }

  personPressed (person) {
    this.setState({ person: person })
  }

  wordPressed (word) {
    let wordData = { word: word, person: { name: this.state.person.name } }
    this.playSound(wordData)
  }

  phraseWordPressed (wordData) {
    this.playSound(wordData)
  }

  addWord (word) {
    let originalPhrase = this.state.phrase
    originalPhrase.push({ word: word, person: this.state.person })
    console.log('Phrase state: ', originalPhrase)
    this.setState({ phrase: originalPhrase })
  }

  deleteWord (word, index) {
    const component = this
    Alert.alert(
      'Remove this word?',
      word,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: function () { component.deleteWordConfirmed(word, index) }}
      ],
      { cancelable: false }
    )
  }

  deleteWordConfirmed (word, index) {
    let phrase = this.state.phrase
    phrase.splice(index, 1)
    this.setState({ phrase: phrase })
  }

  updateCategory (cat) {
    const { potusMode } = this.state
    this.setState({ category: cat })
    if(!potusMode && (cat === 'Bonus')) { this.offerPurchase() }
  }

  playSound (wordData, recordingTrigger) {
    if (recordingTrigger && !this.state.playingCustomPhrase) {
      this.setState({ selected: null, playingAutoPhrase: false })
      window.phraseCount = 0
      return
    }
    const person = wordData.person.name
    const word = wordData.word.toLowerCase()
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

  stopAutoPlay () {
    window.phraseCount = 1000
  }

  autoPlayPhrase () {
    const phrase = this.state.phrase
    if ((window.phraseCount + 1) > phrase.length) {
      window.phraseCount = 0
      this.setState({ selected: null, playingAutoPhrase: false })
      return
    }
    this.setState({ selected: window.phraseCount, playingAutoPhrase: true })
    const person = phrase[window.phraseCount].person.name
    const word = phrase[window.phraseCount].word
    console.log('Playing ', `${person}_${word}.mp3`)
    const file = `${person}_${word}.mp3`
    const sound = new Sound(file, Sound.MAIN_BUNDLE, () => {
      console.log('Sound load callback...')
      sound.play((success) => {
        let count = window.phraseCount
        window.phraseCount = count + 1
        window.autoPlayPhrase()
      })
    })
  }

  async playSavedPhrase (fileName) {
    const name = `@messenger:${fileName}`
    const values = await AsyncStorage.getItem(name)
    if (values !== null) {
      const wordData = JSON.parse(values)
      this.playRecording(wordData)
    }
  }

  playRecording (wordData) {
    this.setState({playingCustomPhrase: true})
    const timings = wordData.map((data) => data.time)
    timings.map((num, i, arr) => {
      let that = this
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
