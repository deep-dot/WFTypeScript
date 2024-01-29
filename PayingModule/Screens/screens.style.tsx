//enter
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  picker: {
    width: 120,
  },

  pickerItem: {
    // adjust padding, margin, or height if necessary
    padding: 20,
    height: 20,
    margin: 20,
  },
  scrollView: {
    //backgroundColor: '#35363A',
    marginHorizontal: 20,
  },
  model: {
    margin: 15,
    backgroundColor: '#f2f2f2',
    marginTop: 80,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 13,
  },

  button: {
    padding: 10,
    margin: 5,
    //backgroundColor: '#54cb77',
    // backgroundColor: '#434343',
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  buttontext: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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

  header: {height: 70, backgroundColor: '#ffffff'},
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
    fontSize: 14,
  },
});
