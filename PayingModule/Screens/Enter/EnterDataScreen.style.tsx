import {StyleSheet, StatusBar} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    backgroundColor: '#35363A',
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
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 13,
  },
  textinputview: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    marginRight: 10,
    marginTop: 20,
    padding: 0,
    alignItems: 'center',
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  textInput: {
    height: 45,
    // width: '30%',
    textAlign: 'right',
    padding: 5,
    color: '#ffffff',
  },
  Textinput: {
    height: 35,
    padding: 5,
    color: '#55a8fa',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    //textAlign: 'center',
  },
  titletext: {
    color: '#55a8fa',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    margin: 5,
    //backgroundColor: '#54cb77',
    backgroundColor: '#434343',
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  buttontext: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
