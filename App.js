//import { StatusBar } from 'expo-status-bar'
import React, { useState }  from 'react'
import { StyleSheet, Button, TouchableHighlight, FlatList, Modal, Text, View, Switch, Image, ColorPropType, } from 'react-native'
//import { WebView } from 'react-native-webview'
import { MessageList} from './MessageList.js'
import { color, styles } from './AppStyles.js'





export default function App() {
  return (
    <View style={styles.AppContainer}>
      <AppHeader></AppHeader>
      <MessageList></MessageList>      
    </View>
  );
  //<StatusBar style="auto" />
}

const AppHeader = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [isDev, setIsDev] = useState(false);
  const [isTest, setIsTest] = useState(false);
  const toggleSwitchDev = () => setIsDev(previousState => !previousState);
  const toggleSwitchTest = () => setIsTest(previousState => !previousState);

  return (
    <View style={styles.AppBar}>
      <TouchableHighlight 
        onPress={() => {setModalVisible(true);}}
      >
        <Text style={styles.AppBar}>taskR</Text>
      </TouchableHighlight>
      <View
        style={styles.centeredView}
        >
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.")
          }}
        >
          <View>
          {/* <Image
            width={100}
            height={100}
            source={require('./assets/OkProgrammer.png')}
          /> */}
            <Text style={styles.AppBar}>Subscribe to Dev Tasks</Text>
            <Switch              
              trackColor={{ false: color.superDark, true: color.dark }}
              thumbColor={isDev ? color.app : color.dark}
              ios_backgroundColor={color.light}
              onValueChange={toggleSwitchDev}
              value={isDev}
            />
            <Text style={styles.AppBar}>Subscribe to Test Tasks</Text>
            <Switch
              trackColor={{ false: color.superDark, true: color.dark }}
              thumbColor={isTest ? color.app : color.dark}
              ios_backgroundColor={color.light}
              onValueChange={toggleSwitchTest}
              value={isTest}
            />
            <Button
              title="save"
              onPress={()=>{setModalVisible(false)}}
              />
          </View>
        </Modal>
      </View>


    </View>
  )
}