/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {Image, Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import MyButton from '../../Components/Mybutton';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App';
import {StateContext} from '../../../Utilities/Context';

const NavigationButtons = () => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch} = stateContext;
  let changeweekendingdate = () => {
    dispatch({type: 'UPDATE', payload: {modalVisible: true}});
  };
  return (
    <ScrollView style={{marginEnd: 20, marginStart: 20, marginTop: 10}}>
      {/* <Image
        style={{width: 100, height: 100, alignSelf: 'center'}}
        source={require('../../Components/Images/WFLogo.png')}
      /> */}
      <MyButton
        title="Add"
        customClick={() => navigation.navigate('Enter Data')}
      />
      <MyButton
        title="View"
        customClick={() => navigation.navigate('View Records')}
      />
      <MyButton
        title="Create Report"
        customClick={() => navigation.navigate('Display Report')}
      />
      <MyButton title="Update W E D" customClick={changeweekendingdate} />
      <MyButton
        title="Youtube Link"
        customClick={() => Linking.openURL('https://youtu.be/ZlgtKUnXd-w')}
      />
    </ScrollView>
  );
};

export default NavigationButtons;
