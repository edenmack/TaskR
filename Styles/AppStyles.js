import { StyleSheet} from 'react-native'

const color={
    light:"whitesmoke",
    dark:"darkslategray", //"#555",
    superDark:"#555",
    attention:"orangered",
    app:"slateblue",
    appBackground:"grey",
    approvalGreen: "#2ecc71"
  }

const styles = StyleSheet.create({
    AppContainer:{
      flex:1,
      paddingTop: 25,
      backgroundColor:color.dark,
    },
    AppBar:{
      backgroundColor: color.app,
      color: color.light,
      height: 50,
      fontSize: 28,
      padding:2,
      fontStyle: 'italic'
      
    },
    AppBarLogoR: {
      color: color.approvalGreen,
      fontSize: 28,
      fontStyle: 'italic',
    },
    buttonStack: {
      width: '60%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 25,
      height:100,
    },
    Modal:{
      backgroundColor:color.app,
      margin:20,
      padding:10,
      borderRadius:10,
      alignItems: "center",    
    },
    modals: {
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center'
    },
    listContainer: {
      flex: 1,    
      paddingTop: 5,
      backgroundColor: color.appBackground,
    },
    item: {   
      flex: 1,
      borderRadius: 5,
      //borderStyle: "solid",
      //borderColor: color.dark,
      //borderWidth: 3, 
      margin: 10,
      backgroundColor: color.light,
      
      shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
    },
    itemHeader: {
      padding: 10,
      margin: 5,
      fontSize: 28,
      height: 60,   
      color: color.dark ,
      backgroundColor: color.light,
    },
    itemHeaderExpanded: {
      padding: 10,
      margin: 5,
      fontSize: 28,
      height: 60,   
      color: color.dark ,
      backgroundColor: color.light,
      textDecorationLine: "underline",
      textDecorationColor: color.dark,
      textDecorationStyle: "solid",      
    },
    itemBody: {    
      margin: 5,
      padding: 10,
      height: 500,
      color: color.dark,
    },
    itemBodyContent: {
      backgroundColor: color.light,
      margin: 2,
      padding: 5,
    },
    itemEnvironment: {
      color: color.attention,
      fontWeight: "bold",
    },
    itemBodyHidden: {
      display: "none",
    }
  })


  export { color, styles}