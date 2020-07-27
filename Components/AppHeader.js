import React, { useState } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons' //https://icons.expo.fyi/
import { styles } from '../Styles/AppStyles'
import Subscriptions from '../Modals/Subscriptions'

const AppHeader = (props) => {

    const [isSettingsMode, setIsSettingsMode] = useState(false)
  
  
    // This will exit out of the settings modal
    const saveSettingsHandler = () => {
      //TODO: --> save settings to db.. right now we are closing only
  
      setIsSettingsMode(false);
    };
  
    // This will also exit out of the settings modal
    const cancelSaveSettingsHandler = () => {
      setIsSettingsMode(false);
    };
  
  
    return (
      <View style={styles.AppBar}>
        <TouchableHighlight onPress={() => setIsSettingsMode(true)}>          
          <SimpleLineIcons  flex={1} name={"menu"} size={24} color={"white"} padding={2} />
        </TouchableHighlight>
        <Text style={styles.AppBar} flex={2}>Task<Text style={styles.AppBarLogoR}>R</Text></Text>
        <View flex={3}></View>
        <Subscriptions 
          visible={isSettingsMode}
          onSave={saveSettingsHandler}
          onCancel={cancelSaveSettingsHandler}
        />
       
      </View>
    );
  };

  export default AppHeader
