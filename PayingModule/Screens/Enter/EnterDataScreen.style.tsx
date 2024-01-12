import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#35363A',
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
  textinputview: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    marginVertical: 0,
    marginHorizontal: 5,
    padding: 0,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    paddingRight: 5,
  },
  Textinput: {
    paddingRight: 5,
    color: '#55a8fa',
  },
  titleText: {
    fontSize: 14,
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
});
