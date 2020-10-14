import React, { useState }  from 'react'
import { FlatList,  View, RefreshControl, } from 'react-native'
import { Message } from './Message.js'
import { styles } from '../../Styles/AppStyles.js'
import Axios from 'axios'


const apiBaseURL = "http://10.0.2.2:5000/"
const instance = Axios.create({
  baseURL: apiBaseURL,
  timeout: 1000//,
  //headers: {'X-Custom-Header': 'foobar'}
})

const MessageList = () => {
    const [data, setData] = useState(
      [
        {"key": "1", "subj": "test 1", "environment":"dev", "color":"black", "icon":"alarm", "responseOptions":"Ack,Dismiss", "body": `this is a test of the element <br/>with single quotes(') and double quotes(")`},
        {"key": "2", "subj": "test 2", "environment":"test", "color":"black", "icon":"", "responseOptions":"opt1,opt2,opt3", "body": "this is a test of the element with a table <table border='1' ><tr><th>one</th><th>two</th></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr></table>"},
      ]
    )
    const [refreshing, setRefreshing] = React.useState(false);    
    const onRefresh = React.useCallback(() => {
      //alert("refresh");
      //setRefreshing(true);  
      //wait(2000).then(() => setRefreshing(false));

      // setData(
      //   [
      //     {"key": "0", "subj": "error", "environment":"dev", "color":"#a00", "icon":"bug-report", "responseOptions":"Ack,Dismiss", "body":"test<br/>"},
      //     {"key": "1", "subj": "test 1", "environment":"dev", "color":"black", "icon":"alarm", "responseOptions":"Ack,Dismiss", "body": `this is a test of the element <br/>with single quotes(') and double quotes(")`},
      //     {"key": "2", "subj": "test 2", "environment":"test", "color":"black", "icon":"", "responseOptions":"opt1,opt2,opt3", "body": "this is a test of the element with a table <table border='1' ><tr><th>one</th><th>two</th></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr></table>"},
      //     {"key": "3", "subj": "test 3", "environment":"prod", "color":"#a00", "icon":"announcement", "responseOptions":"Approve,Deny", "body": "this is a test of the element"},
      //     {"key": "4", "subj": "test 4", "environment":"prod", "color":"#080", "icon":"assignment-turned-in", "responseOptions":"Approve,Deny", "body": "this is a test of the element"},
      //   ]
      // )

      instance.get("/Message/mackej")      
        .then((response)=>{
          console.log(response.data)          
          setData(response.data)
        })
        .catch((error)=>{
          console.log(error)
          setData(
            [
              {"key":"0","subj":"error", "environment":"dev","color":"#a00","icon":"bug-report","responseOptions":"Ok,Fail","body":error.toString()},
            ]
          )
          // [
          //   {"key": "0", "subj": "error", "environment":"dev", "color":"#a00", "icon":"bug-report", "responseOptions":"Ok,Fail", "body":error.toString()},
          //   {"key": "1", "subj": "test 1", "environment":"dev", "color":"black", "icon":"alarm", "responseOptions":"Ack,Dismiss", "body": `this is a test of the element <br/>with single quotes(') and double quotes(")`},
          //   {"key": "2", "subj": "test 2", "environment":"test", "color":"black", "icon":"", "responseOptions":"opt1,opt2,opt3", "body": "this is a test of the element with a table <table border='1' ><tr><th>one</th><th>two</th></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr></table>"},
          //   {"key": "3", "subj": "test 3", "environment":"prod", "color":"#a00", "icon":"announcement", "responseOptions":"Approve,Deny", "body": "this is a test of the element"},
          //   {"key": "4", "subj": "test 4", "environment":"prod", "color":"#080", "icon":"assignment-turned-in", "responseOptions":"Approve,Deny", "body": "this is a test of the element"},
          //   {"key": "5", "subj": "test 5", "environment":"prod", "color":"#a00", "icon":"flag", "responseOptions":"Approve,Deny", "body": "this is a test of the element"},
          //   {"key": "6", "subj": "test 6", "environment":"prod", "color":"black", "icon":"cake", "responseOptions":"Approve,Deny", "body": "this is a test of the element"},
          //   {"key": "7", "subj": "test 7", "environment":"prod", "color":"#008", "icon":"chat", "responseOptions":"Approve,Deny", "body": "this is a test of the element"},
          //   {"key": "8", "subj": "test 8", "environment":"prod", "color":"black", "icon":"check", "responseOptions":"Approve,Deny", "body": "this is a test of the element"},
          //   {key: "9", subj: "test 9", environment:"prod", color:"#ec0", icon:"error", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "10", subj: "test 10", environment:"prod", color:"black", icon:"event", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "11", subj: "test 11", environment:"prod", color:"black", icon:"face", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "12", subj: "test 12", environment:"prod", color:"black", icon:"feedback", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "13", subj: "test 13", environment:"prod", color:"black", icon:"flag", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "14", subj: "test 14", environment:"prod", color:"black", icon:"folder", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "15", subj: "test 15", environment:"prod", color:"black", icon:"forum", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "16", subj: "test 16", environment:"prod", color:"black", icon:"group", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "17", subj: "test 17", environment:"prod", color:"black", icon:"help", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "18", subj: "test 18", environment:"prod", color:"black", icon:"info", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "19", subj: "test 19", environment:"prod", color:"black", icon:"message", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "20", subj: "test 20", environment:"prod", color:"black", icon:"report", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "21", subj: "test 21", environment:"prod", color:"black", icon:"notifications", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "22", subj: "test 22", environment:"prod", color:"black", icon:"people", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "23", subj: "test 23", environment:"prod", color:"black", icon:"poll", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "24", subj: "test 24", environment:"prod", color:"black", icon:"priority-high", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "25", subj: "test 25", environment:"prod", color:"black", icon:"report", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "26", subj: "test 26", environment:"prod", color:"black", icon:"security", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "27", subj: "test 27", environment:"prod", color:"black", icon:"bug-report", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "28", subj: "test 28", environment:"prod", color:"black", icon:"report", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "29", subj: "test 29", environment:"prod", color:"black", icon:"report", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          //   {key: "30", subj: "test 30", environment:"prod", color:"black", icon:"report", responseOptions:"Approve,Deny", body: "this is a test of the element"},
          // ]
        })
    
      }, []);

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