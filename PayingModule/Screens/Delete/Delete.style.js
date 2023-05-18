import { StyleSheet, StatusBar } from 'react-native';

export default StyleSheet.create({
    textinputview: {
        flexDirection: 'row',
        marginTop: 20,
        //borderBottomColor:"#000000",
        borderBottomWidth: 0.5
    ,    marginLeft: 5,
        marginRight: 5,
        justifyContent: 'space-between',
      },
      titletext: {
        color: '#000000',
        fontSize: 16,
        fontWeight:'bold',
      },
      titleText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight:'bold',
        textAlign: 'center',
      },
      container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#000000',
      },
      button: {
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 5,
        backgroundColor: '#AEDEF4',
      },
      text: {
        color: '#ffffff',
        fontSize: 18,
      },
});