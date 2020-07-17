import React, { useState }  from 'react'
import { FlatList,  View, RefreshControl, } from 'react-native'
import { Message } from './Message.js'
import { styles } from '../../Styles/AppStyles.js'
//import {styles} from './Styles/AppStyles'

var data=[
    {key: "1", subj: "test 1", environment:"dev", color:"black", responseOptions:"Ack,Dismiss", body: `this is a test of the element <br/>with single quotes(') and double quotes(")`},
    {key: "2", subj: "test 2", environment:"test", color:"black", responseOptions:"opt1,opt2,opt3", body: "this is a test of the element with a table <table border='1' ><tr><th>one</th><th>two</th></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr><tr><td>a</td><td>b</td</tr><tr><td>c</td><td>d</td></tr></table>"},
    {key: "3", subj: "test 3", environment:"prod", color:"red", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "4", subj: "test 4", environment:"prod", color:"green", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "5", subj: "test 5", environment:"prod", color:"blue", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "6", subj: "test 6", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "7", subj: "test 7", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "8", subj: "test 8", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "9", subj: "test 9", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "10", subj: "test 10", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "11", subj: "test 11", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "12", subj: "test 12", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "13", subj: "test 13", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "14", subj: "test 14", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "15", subj: "test 15", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
    {key: "16", subj: "test 16", environment:"prod", color:"black", responseOptions:"Approve,Deny", body: "this is a test of the element"},
  ]

const MessageList = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
      alert("refresh");
      //setRefreshing(true);
  
      //wait(2000).then(() => setRefreshing(false));
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
              environment={item.environment} 
              responseOptions={item.responseOptions}>
              </Message>}></FlatList>
      </View>
    );
  }
  
  export  { MessageList }