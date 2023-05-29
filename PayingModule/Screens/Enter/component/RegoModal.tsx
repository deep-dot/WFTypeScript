/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, View, Text, TextInput} from 'react-native';
import MyButton from '../../../Components/Mybutton';
import styles from '../EnterDataScreen.style';

interface RegoModalProps {
  formValues: {
    regomodal: boolean;
    rego: string;
  };
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  pushcab: () => void;
  deletecab: () => void;
}

export const RegoModal = ({
  formValues,
  setFormValues,
  pushcab,
  deletecab,
}: RegoModalProps) => {
  return (
    <Modal
      visible={formValues.regomodal}
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
          style={{
            marginTop: 30,
            borderColor: '#000000',
            borderBottomWidth: 1,
            textAlign: 'center',
            color: '#000000',
          }}
          onChangeText={(num: string) =>
            setFormValues((prevValues: {rego: string}) => ({
              ...prevValues,
              rego: num,
            }))
          }>
          <Text style={styles.titleText}>{formValues.rego}</Text>
        </TextInput>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <MyButton title="Add" customClick={pushcab} />
          <MyButton title="Delete" customClick={deletecab} />
          <MyButton
            title="Cancel"
            customClick={() =>
              setFormValues((prevValues: {regomodal: boolean}) => ({
                ...prevValues,
                regomodal: false,
              }))
            }
          />
        </View>
      </View>
    </Modal>
  );
};
