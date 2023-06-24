import {StyleSheet, StatusBar} from 'react-native';

export default StyleSheet.create({
  container: {flex: 1, paddingTop: 5, marginTop: 0},
  header: {height: 30, backgroundColor: '#ffffff'},
  text: {textAlign: 'center', fontWeight: 'bold', padding: 0, fontSize: 12},
  dataWrapper: {margin: 0},
  row: {height: 30, backgroundColor: '#ffffff'},
  textinputview: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'space-between',
  },
  titleText: {
    color: '#000000',
    fontSize: 18,
  },
});
