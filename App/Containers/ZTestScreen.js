import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import RoundedButton from '../Components/RoundedButton'

import { Images } from '../Themes'

// Styles
import styles from './Styles/ZTestScreenStyles'

// Import the react-native-sound module
const Sound = require('react-native-sound')

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback')

export default class ZTestScreen extends React.Component {

  playSound () {
    console.log('MOOO')
    const click = new Sound('click.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      }
      // loaded successfully
      console.log('duration in seconds: ' + click.getDuration() + 'number of channels: ' + click.getNumberOfChannels())
    })
    click.play((success) => {
      if (success) {
        console.log('successfully finished playing')
      } else {
        console.log('playback failed due to audio decoding errors')
      }
    })
  }
  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>

          <View style={styles.section} >
            <Image source={Images.ready} />
            <Text style={styles.sectionText}>
              {'Press a button to hear a sound.'}
            </Text>
          </View>

          <RoundedButton onPress={this.playSound}>
            Play Sound
          </RoundedButton>
        </ScrollView>
      </View>
    )
  }
}
