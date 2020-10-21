import React, { useState }  from 'react'
import { FlatList,  View, RefreshControl, } from 'react-native'
import { Message } from './Message.js'
import { styles } from '../../Styles/AppStyles.js'
import { apiConfig, testData } from '../../config/config.js'
import Axios from 'axios'


const instance = Axios.create({
  baseURL: apiConfig.testUrl,
  timeout: 1000,
  headers: {
    Accept: "application/json",
    "Content-Type":"application/json",
    "X-Requested-With": "XMLHttpRequest",
  }
})


const MessageList = () => {
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);    
    const onRefresh = React.useCallback(async() => {
      console.log("Begin refresh-------------------------------------------------")
      
      //setData(testData)

//AXIOS      
      instance.get(apiConfig.testArgs)      
    .then(response=>{
      console.log(response.data)          
      let d = {key: "0", subj: "test 0", environment:"dev", color:"black", icon:"info", responseOptions:["Ack","Dismiss"], body: "Test successful"}    
      testData.unshift(d)  
      //console.log(testData)
      setData(testData)
    })
    .catch(error=>{
      console.log("error fetching data")
      console.log(error.toString())      
      console.log(error)
      let d = [{key: "0", subj: "test error", environment:"dev", color:"black", icon:"error", responseOptions:["Ack","Dismiss"], body: `${error}`},]
      setData(d)
    })


//FETCH    
    // let url = `${apiConfig.testUrl}${apiConfig.testArgs}`
    // console.log(`fetching ${url}.................`)
    // return fetch(url, {
    //     method: 'GET', 
    //     headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     },
    // }
    // )
    // .then(response => response.json())
    // .then(data => {
    //     console.log("setting data................................")
    //     console.log(data)
    //     setData([{key: "1", subj: "test succcessful", environment:"dev", color:"black", icon:"info", responseOptions:"Ack,Dismiss", body: `${data}`},])
    // })
    // .catch(error => {
    //     console.log('Error:', error);
    //     console.log(error)
    //     console.log('loading test data')
    //     setData([{key: "1", subj: "test error", environment:"dev", color:"black", icon:"error", responseOptions:"Ack,Dismiss", body: `${error}`},])
    // })


      }, [])//end onRefresh


    return (
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({item}) => 
            <Message 
              id={item.key} 
              subj={item.subj} 
              body={item.body} 
              color={item.color} 
              icon={item.icon}
              environment={item.environment} 
              responseOptions={item.responseOptions}>
              </Message>}></FlatList>
      </View>
    );
  }
  
  export  { MessageList }