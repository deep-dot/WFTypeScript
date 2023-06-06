/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, View, Text, TextInput, Alert} from 'react-native';
import MyButton from '../../../Components/Mybutton';
import styles from '../EnterDataScreen.style';
import {insertIntoCab, deleteIntoCab, SelectFromCab} from '../Actions';
import {StateContext} from '../../../../Utilities/Context';

export const RegoModal = () => {
  const stateContext = React.useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;
  const handleCabChange = async (action: Function) => {
    if (!state.Rego) {
      Alert.alert('Please put rego in.');
      return;
    }
    try {
      await action(state.Rego.toString());
      // await SelectFromCab(state, dispatch);
    } catch (error) {
      console.log(error);
    }
  };
  let pushcab = async () => {
    handleCabChange(insertIntoCab);
    await SelectFromCab(dispatch);
  };

  const deletecab = async () => {
    handleCabChange(deleteIntoCab);
    await SelectFromCab(dispatch);
  };
  return (
    <Modal
      visible={state.Rego_Modal}
      animationType={'fade'}
      onRequestClose={() => {}}>
      <View style={styles.model}>
        <Text style={{color: '#000000'}}>
          Please add vehcle's registration number.
        </Text>
        <TextInput
          placeholder="Enter Rego"
          //keyboardType='numeric'
          keyboardType="numbers-and-punctuation"
          placeholderTextColor="#000000"
          value={state.Rego}
          style={{
            marginTop: 30,
            borderColor: '#000000',
            borderBottomWidth: 1,
            textAlign: 'center',
            color: '#000000',
          }}
          onChangeText={(rego: string) => {
            dispatch({type: 'UPDATE', payload: {Rego: rego}});
          }}
        />
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <MyButton title="Add" customClick={pushcab} />
          <MyButton title="Delete" customClick={deletecab} />
          <MyButton
            title="Cancel"
            customClick={() => {
              dispatch({type: 'UPDATE', payload: {Rego_Modal: false}});
            }}
          />
        </View>
      </View>
    </Modal>
  );
};
