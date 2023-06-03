import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#35363A',
  },
  button: {
    padding: 10,
    margin: 15,
    marginTop: 10,
    backgroundColor: '#a05555',
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  model: {
    margin: 10,
    paddingBottom: 10,
    marginTop: 65,
    //backgroundColor: '#35363A',
    backgroundColor: '#434343',
    //height: 430,
    borderRadius: 20,
    paddingTop: 30,
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
  titletext: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  footertext: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
  },
  textInput: {
    height: 45,
    marginTop: 20,
    backgroundColor: '#434343',
    textAlign: 'center',
  },
});
