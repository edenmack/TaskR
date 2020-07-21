import React, { useState } from 'react';
import { Text, View, TouchableHighlight, Image } from 'react-native';
import { styles } from '../Styles/AppStyles';
import Subscriptions from '../Modals/Subscriptions';

const AppHeader = (props) => {

    const [isSettingsMode, setIsSettingsMode] = useState(false); 
  
  
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
          <Image
            flex={1}
            aspectRatio={.5}
            resizeMode={"contain"}
            source={require("../assets/menu-black-18dp/2x/baseline_menu_black_18dp.png")}
          />
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

  export default AppHeader;
