import { StyleSheet, Dimensions } from 'react-native'
import { Fonts } from '../../Themes/'

const {width, height} = Dimensions.get('window')
const calcWidth = (width / 3) - 4

export default StyleSheet.create({
  wordText: {
    fontFamily: Fonts.type.base,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  wordButton: {
    width: calcWidth,
    height: 39,
    backgroundColor: '#FB6964',
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2
  },
  helpText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowColor: 'blue',
    elevation: 1,
    textAlign: 'center'
  },
  termsText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 15,
    marginRight: 15
  },
  phraseButton: {
    height: 40,
    backgroundColor: '#333332',
    margin: 2,
    marginRight: -5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wordButton2: {
    width: calcWidth,
    height: 39,
    backgroundColor: '#333332',
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 1
  },
  phrasePlayerButton: {
    height: 55,
    backgroundColor: '#333332',
    margin: 3,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 1
  },
  loaderButton: {
    height: 55,
    backgroundColor: '#333332',
    margin: 3,
    marginLeft: 10,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 1
  },
  identifierText: {
    fontFamily: Fonts.type.base,
    fontSize: 8,
    color: '#F0F1EE',
    marginTop: -2
  },
  personButton: {
    width: 95,
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 15,
    marginRight: 15,
    shadowOffset: { width: 13, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 3
  },
  personText: {
    fontFamily: 'AppleSDGothicNeo-Bold',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333332'
  },
  noFilesText: {
    fontFamily: 'AppleSDGothicNeo-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    margin: 15
  },
  categoryButton: {
    width: width / 4.3,
    height: 38,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3
  },
  saveText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowColor: '#71abf2',
    elevation: 1
  },
  phraseMagic: {
    color: '#71abf2',
    fontSize: 15,
    fontWeight: 'bold',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowColor: 'red',
    elevation: 1,
    alignSelf: 'center'
  },
  bucketHelp: {
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 13,
    fontFamily: 'AppleSDGothicNeo-Bold'
  }
})
