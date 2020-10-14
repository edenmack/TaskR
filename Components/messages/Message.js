import React, { useState }  from 'react'

import { Button, TouchableHighlight, FlatList, Text, View, TextInput } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons' //https://icons.expo.fyi/
import { WebView } from 'react-native-webview'
import { styles } from '../../Styles/AppStyles.js'


let respond=(id,response,comment)=>{alert(id.toString() + ":" + response + ":" + comment) }

const ResponseButtons = (props) => {
    let d = []
    let c = 0
    for(let r of props.responseOptions.split(",")){
      //alert(r)
      let d1 = {key:(++c).toString(), response:r}
      d.push(d1)
    }
    return (
      <View
        style={styles.itemBodyButtons}
      >
        <FlatList 
          data={d}          
          renderItem={({item}) => 
          <View
            style={styles.itemBodyButton}
          >
            <Button                              
              onPress={()=>{respond(props.id,item.response,props.comment)}} 
              title={item.response}
            /></View>}></FlatList>
      </View>
    )
  }
  
const Message = (props) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [htmlHeight, setHtmlHeight] = useState(0)
    const [itemHeight, setItemHeight] = useState(0)
    const [comment, setComment] = useState("")
  
    let bodyCls = styles.itemBody
    let hdrCls = styles.itemHeaderExpanded
    let icon = "expand-less" 
    if(!isExpanded) {
      bodyCls = styles.itemBodyHidden
      hdrCls = styles.itemHeader
      icon = "expand-more" 
    }
  
    let environmentTag = ""
    if(props.environment !== "prod")environmentTag=props.environment
    let body = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        TABLE {
          border-collapse:collapse; 
          border: 1px solid black;
          font-family:Arial;
          font-size:1.2rem;
        }
        BODY {
          font-family:Arial;
          font-size:1.2rem;
        }
      </style>
    </head>
    <body onload="document.title=document.body.clientHeight" >
      <p>${props.body}</p>
    </body>
  </html>`
  
    return (
      <View style={styles.item} borderColor={props.color}>
        <TouchableHighlight 
          onPress={() => {setIsExpanded(!isExpanded);}}
        >          
          <View 
            flex={1} 
            flexDirection={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
          >     

            <Text 
              flex={1}
              style={styles.itemEnvironment}
            >{environmentTag}</Text>

            <Text 
              flex={4}
              style={hdrCls}           
              color={props.color}
            >
                {props.subj}
            </Text>  
            {props.icon != "" &&
            <MaterialIcons 
                name={props.icon} 
                size={40} 
                color={props.color} 
                style={styles.itemIcon}/>
            }
            {/* <View width={5} flex={4}>
              <MaterialIcons name={icon} size={40} color="black" />
            </View>  */}

          </View>
        </TouchableHighlight>
        
        <View 
          style={bodyCls} 
          height={itemHeight}>
          <WebView 
            style={styles.itemBodyContent} 
            height={htmlHeight} originWhitelist={['*']} 
            source={{ html: body }} javaScriptEnabled={true} 
            scrollEnabled={false} 
            onNavigationStateChange={(event)=>{
              if(isNaN(Number(event.title))){
                setHtmlHeight(100)
                setItemHeight(100)
              }else{
                setHtmlHeight(Number(event.title))
                setItemHeight(Number(event.title))
              }
            }
          }></WebView>

        <Text>Comment:</Text>
        <TextInput
              multiline
              editable
              placeholder={"enter comments here"}
              value={comment}
              onChangeText={(event)=>{setComment(event)}}
            />

          <ResponseButtons 
            id={props.id} 
            responseOptions={props.responseOptions}
            comment={comment}
          ></ResponseButtons>
        </View>
      </View>
    )
  }

  export { Message, ResponseButtons }