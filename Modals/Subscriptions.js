import React, { useState } from 'react'
import { View, Modal, Text, TextInput, Switch, Button} from 'react-native'
import { styles, color } from '../Styles/AppStyles'
import AsyncStorage from '@react-native-community/async-storage'

const Subscriptions = props => {

    const [loginName, setLoginName] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [isDev, setIsDev] = useState(false)
    const [isTest, setIsTest] = useState(false)
    const toggleSwitchDev = () => setIsDev(previousState => !previousState)
    const toggleSwitchTest = () => setIsTest(previousState => !previousState)
    // const setApiKey = async(value) =>  {
    //     try {
    //         wait AsyncStorage.setItem('@apiKey', value)
    //       } catch (e) {
    //         // saving error
    //       }
    // }
    

    const saveSettingsHandler = () => {
        //TODO: Save to db.. right now we are just closing the modal

        props.onSave(false)
    };
    const requestAccountKeyHandler = () => {
        //TODO: send account key
        alert("An account key has been sent to your eMail")
    }

    return (
        <Modal 
            visible={props.visible} 
            animationType='slide'
            onRequestClose={() => {
             alert("Modal has been closed.")
          }}
        >
            <View style={styles.modals}>
                <View style={styles.modalSection}>
                    <Text style={styles.modalTextTitle}>Account Key</Text>
                    <View style={styles.subscription}>
                        <TextInput                    
                            editable
                            placeholder={"enter login name here"}
                            //textContentType="password"
                            textAlign="center"
                            autoCapitalize="none"
                            value={loginName}
                            onChangeText={(event)=>{setLoginName(event)}}
                            />
                        <TextInput                    
                            editable
                            placeholder={"enter account key here"}
                            textContentType="password"
                            textAlign="center"
                            autoCapitalize="characters"
                            value={apiKey}
                            onChangeText={(event)=>{setApiKey(event)}}
                            />
                        <Button 
                            style={styles.itemBodyButton}
                            title="Request Account Key"
                            color="green"
                            onPress={requestAccountKeyHandler} 
                            />
                    </View>
                </View>


                <View style={styles.modalSection}>
                    <Text style={styles.modalTextTitle}>Subscriptions</Text>
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
                    <Text style={styles.modalTextInfo}>Only select this if you are a nerd.</Text>
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
                    <Text style={styles.modalTextInfo}>Only select this if you are told to do so by a nerd.</Text>
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

export default Subscriptions