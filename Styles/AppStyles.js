import { StyleSheet} from 'react-native'

const color={
    light:"whitesmoke",
    dark:"darkslategray", //"#555",
    superDark:"#555",
    attention:"orangered",
    app:"slateblue",
    appBackground:"gainsboro",
    approvalGreen: "#2ecc71",
    dev:"green",
    test:"yellow",
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
      fontStyle: 'italic',
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      justifyContent: 'flex-start', 
      alignItems: 'center',
    },
    modalSection: {
      padding: 10,
      margin: 10,
      borderBottomColor: "black",
      borderBottomWidth: 2,
    },
    subscription: {      
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalTextTitle:{
      color: color.dark,
      height: 60,
      fontSize: 28,
      padding:2,
    },
    modalText: {      
      color: color.dark,
      height: 50,
      fontSize: 22,
      padding:2,
      fontStyle: 'italic',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalTextInfo:{
      height: 25,
      fontSize: 11,
      paddingBottom:2,
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
      marginTop: 5,
      marginBottom: 5,
      marginRight:10,
      marginLeft:10,
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
      transform: [
        { translateX: -30 }, 
        { translateY: 0 },],
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
      transform: [
        { translateX: -30 }, 
        { translateY: 0 },],   
    },
    itemIcon: {
      /*transform: [
        { translateX: 0 }, 
        { translateY: 15 },],*/
      //alignItems:"baseline",
      marginLeft:"auto",
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
    itemBodyButtons: {
      margin: 2,
      justifyContent: 'space-between',
    },
    itemBodyButton: {
      margin:2,      
    },
    itemEnvironment: {
      color: color.attention,
      //fontWeight: "bold",
      //fontFamily: "monospace",
      width:50,
      transform: [
        { rotate: "90deg" }, 
        //{ translateX: 5 }, 
        { translateY: 10 },
      ],
    },
    itemBodyHidden: {
      display: "none",
    }
  })


  export { color, styles}