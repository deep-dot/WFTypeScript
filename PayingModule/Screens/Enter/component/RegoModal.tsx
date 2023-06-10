/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MyButton from '../../../Components/Mybutton';
import styles from '../EnterDataScreen.style';
import {insertIntoCab, deleteIntoCab, SelectFromCab} from '../Actions';
import {StateContext} from '../../../../Utilities/Context';
import Icon from 'react-native-vector-icons/Ionicons';

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
      <View style={[styles.model, {alignSelf: 'center'}]}>
        <Text style={{color: '#000000', alignSelf: 'center'}}>
          Please add vehcle's registration number
        </Text>
        <TextInput
          placeholder="Enter Rego"
          //keyboardType='numeric'
          keyboardType="numbers-and-punctuation"
          placeholderTextColor="#000000"
          value={state.Rego}
          style={{
            marginTop: 30,
            alignSelf: 'center',
            color: '#000000',
          }}
          onChangeText={(text: string) => {
            dispatch({type: 'UPDATE', payload: {Rego: text}});
          }}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 40,
          }}>
          <TouchableOpacity onPress={pushcab}>
            <Icon name="add-outline" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={deletecab}>
            <Icon name="remove-outline" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch({type: 'UPDATE', payload: {Rego_Modal: false}});
            }}>
            <Icon name="exit-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
