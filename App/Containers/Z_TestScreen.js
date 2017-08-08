import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import RoundedButton from '../Components/RoundedButton'


import { Images } from '../Themes'

// Styles
import styles from './Styles/Z_TestScreenStyles'

export default class Z_TestScreen extends React.Component {
  playSound() {
    console.log('MOOO')
  }
  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>

          <View style={styles.section} >
            <Image source={Images.ready} />
            <Text style={styles.sectionText}>
              {"Press a button to hear a sound."}
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
