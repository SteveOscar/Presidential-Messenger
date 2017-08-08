import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import styles from './Styles/NavigationContainerStyles'
import NavigationDrawer from './NavigationDrawer'

// screens identified by the router
import LaunchScreen from '../Containers/LaunchScreen'
import Z_TestScreen from '../Containers/Z_TestScreen'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key='drawerChildrenWrapper' navigationBarStyle={styles.navBar} titleStyle={styles.title} leftButtonIconStyle={styles.leftButton} rightButtonTextStyle={styles.rightButton}>
            <Scene initial key='Z_TestScreen' component={Z_TestScreen} title='Z_TestScreen' hideNavBar />
            <Scene key='launchScreen' component={LaunchScreen} title='LaunchScreen' hideNavBar />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
