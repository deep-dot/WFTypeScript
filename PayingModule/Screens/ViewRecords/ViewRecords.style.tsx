import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  header: {height: 30, backgroundColor: '#ffffff'},
  text: {textAlign: 'center', fontWeight: 'bold', padding: 0, fontSize: 12},
  row: {height: 30, backgroundColor: '#ffffff'},
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textinputview: {
    flexDirection: 'row',
    borderColor: '#000',
    borderBottomWidth: 0.5,
    marginRight: 10,
    marginTop: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titletext: {
    color: '#000',
    fontSize: 14,
  },
  textInput: {
    height: 45,
    padding: 0,
    color: '#ffffff',
  },
  Textinput: {
    height: 35,
    padding: 5,
    color: '#55a8fa',
  },
});
