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
import styles from '../screens.style';
import {insertCab, deleteCab} from '../../Utilities/Actions';
import {StateContext} from '../../Utilities/Context';
import Icon from 'react-native-vector-icons/Ionicons';

export const RegoModal = () => {
  const stateContext = React.useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;

  const handleCabChange = async (action: Function) => {
    if (!state.Taxi) {
      Alert.alert('Please put rego in.');
      return;
    }
    try {
      await action(state.Taxi, dispatch);
      // dispatch({type: 'INSERT', payload: {Rego_Modal: false, table: 'cab'}});
    } catch (error) {
      console.log(error);
    }
  };
  let pushcab = async () => {
    handleCabChange(insertCab);
  };

  const deletecab = async () => {
    handleCabChange(deleteCab);
  };
  return (
    <Modal
      visible={
        state.Rego_Modal !== undefined ? Boolean(state.Rego_Modal) : undefined
      }
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
          value={String(state.Taxi)}
          style={{
            marginTop: 30,
            alignSelf: 'center',
            color: '#000000',
          }}
          onChangeText={(text: string) => {
            dispatch({type: 'INSERT', payload: {Taxi: text, table: 'cab'}});
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
              dispatch({
                type: 'INSERT',
                payload: {Rego_Modal: false, table: 'cab'},
              });
            }}>
            <Icon name="exit-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
