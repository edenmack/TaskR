import React from 'react'
import {SafeAreaView } from 'react-native'
import  AppHeader  from './Components/AppHeader'
import { MessageList} from './Components/messages/MessageList'
import { styles } from './Styles/AppStyles'


export default function App() {

  return (
    <SafeAreaView style={styles.AppContainer}>
      <AppHeader></AppHeader>
      <MessageList></MessageList>      
    </SafeAreaView>
  );
}