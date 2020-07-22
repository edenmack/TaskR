import React, { useState }  from 'react'

import {  Button, TouchableHighlight, FlatList, Text, View, Image } from 'react-native'
import { WebView } from 'react-native-webview'
import { styles } from '../../Styles/AppStyles.js'
//import {styles} from './Styles/AppStyles'


let respond=(id,response)=>{alert(id.toString() + ":" + response)}

const ResponseButtons = (props) => {
    let d = []
    let c = 0
    for(let r of props.responseOptions.split(",")){
      //alert(r)
      let d1 = {key:(++c).toString(), response:r,}
      d.push(d1)
    }
    return (
      <View>
        <FlatList 
          data={d}
          style={styles.itemBodyButtons}
          renderItem={({item}) => 
            <Button                
              onPress={()=>{respond(props.id,item.response)}} 
              title={item.response}
            />}></FlatList>
      </View>
    )
  }
  
const Message = (props) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [htmlHeight, setHtmlHeight] = useState(0)
    const [itemHeight, setItemHeight] = useState(0)
  
    let bodyCls = styles.itemBody
    let hdrCls = styles.itemHeaderExpanded
    let icon = require("../../assets/expand_less-black-18dp/2x/baseline_expand_less_black_18dp.png")

    if(!isExpanded) {
      bodyCls = styles.itemBodyHidden
      hdrCls = styles.itemHeader
      icon = require("../../assets/expand_more-black-18dp/2x/baseline_expand_more_black_18dp.png")
    }
  
    let environmentTag = ""
    if(props.environment !== "prod")environmentTag=props.environment + ": "
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
          >     

            <View width={5} flex={1}>
              <Image
                flex={1}
                aspectRatio={.5}
                resizeMode={"contain"}
                source={icon}
              />
            </View>    

            <Text 
              flex={2}
              style={hdrCls}           
              color={props.color}
            >
                <Text 
                style={styles.itemEnvironment}
                >{environmentTag}</Text>{props.subj}
            </Text>  
            <View flex={3}></View>                    
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
          <ResponseButtons 
            id={props.id} 
            responseOptions={props.responseOptions}
          ></ResponseButtons>
        </View>
      </View>
    )
  }

  export { Message, ResponseButtons }