/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './navigation/App'

AppRegistry.registerComponent(appName,() => () => <App/>)
