import React, { useState } from 'react';
import { View, Modal, Text, Switch, Button} from 'react-native';
import { styles, color } from '../Styles/AppStyles';

const Subscriptions = props => {

    const [isDev, setIsDev] = useState(false);
    const [isTest, setIsTest] = useState(false);
    const toggleSwitchDev = () => setIsDev(previousState => !previousState);
    const toggleSwitchTest = () => setIsTest(previousState => !previousState);

    const saveSettingsHandler = () => {
        //TODO: Save to db.. right now we are just closing the modal

        props.onSave(false)
    };

    return (
        <Modal 
            visible={props.visible} 
            animationType='slide'
            onRequestClose={() => {
             alert("Modal has been closed.")
          }}
        >
            <View style={styles.modals}>
                <View style={styles.subscription}>
                    <Text style={styles.modalText} backgroundColor={"white"}>Subscribe to Develop<Text style={styles.AppBarLogoR}>R</Text> Tasks: </Text>
                    <Switch         
                        trackColor={{ false: color.superDark, true: color.dark }}
                        thumbColor={isDev ? color.app : color.dark}
                        ios_backgroundColor={color.light}
                        onValueChange={toggleSwitchDev}
                        value={isDev}
                    />
                </View>
                <View style={styles.subscription}>
                    <Text style={styles.modalText} backgroundColor={"white"}>Subscribe to Test<Text style={styles.AppBarLogoR}>R</Text> Tasks: </Text>
                    <Switch
                        trackColor={{ false: color.superDark, true: color.dark }}
                        thumbColor={isTest ? color.app : color.dark}
                        ios_backgroundColor={color.light}
                        onValueChange={toggleSwitchTest}
                        value={isTest}
                    />
                </View>
               <View style={styles.buttonStack}>
                    <View>
                        <Button 
                            title='Save'
                            onPress={saveSettingsHandler} 
                        />
                    </View>
                    <View>
                        <Button 
                            title='CANCEL' 
                            color='red'
                            onPress={props.onCancel}
                        />
                    </View>
                </View>
          </View>
            
        </Modal>
    );
};

export default Subscriptions;