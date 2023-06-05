/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, View, Text, TextInput} from 'react-native';
import MyButton from '../../../Components/Mybutton';
import styles from '../EnterDataScreen.style';
import {Action} from '../../../../Utilities/Actions';

interface RegoModalProps {
  visible: boolean;
  state: {
    Rego_Modal: boolean;
    Rego: string;
  };
  dispatch: React.Dispatch<Action>;
  pushcab: () => void;
  deletecab: () => void;
}

export const RegoModal = ({
  visible,
  state,
  dispatch,
  pushcab,
  deletecab,
}: RegoModalProps) => {
  return (
    <Modal visible={visible} animationType={'fade'} onRequestClose={() => {}}>
      <View style={styles.model}>
        <Text style={{color: '#000000'}}>
          Please add vehcle's registration number.
        </Text>
        <TextInput
          placeholder="Enter Rego"
          //keyboardType='numeric'
          keyboardType="numbers-and-punctuation"
          placeholderTextColor="#000000"
          style={{
            marginTop: 30,
            borderColor: '#000000',
            borderBottomWidth: 1,
            textAlign: 'center',
            color: '#000000',
          }}
          onChangeText={(rego: string) => {
            dispatch({type: 'UPDATE', payload: {Rego: rego}});
          }}>
          <Text style={styles.titleText}>{state.Rego}</Text>
        </TextInput>
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
