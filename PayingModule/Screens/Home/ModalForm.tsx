/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TextInput, Modal} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Calendar from '../../Components/Calendar';
import MyButton from '../../Components/Mybutton';
import styles from './HomeScreen.style';

type ModalFormProps = {
  modalvisible: boolean;
  load: () => void;
  cancel: () => void;
  name: string;
  date: string;
  setName: (value: string) => void;
  setDate: (value: string) => void;
  setDay: (value: string) => void;
};
const ModalForm = ({
  modalvisible,
  load,
  cancel,
  name,
  date,
  setName,
  setDate,
  setDay,
}: ModalFormProps) => (
  <Modal
    visible={modalvisible}
    animationType={'fade'}
    onRequestClose={() => {}}>
    <ScrollView>
      <View style={styles.model}>
        <Text style={styles.titletext}>Enter Name & Week Ending Date</Text>

        <TextInput
          placeholder="Enter Your Name"
          placeholderTextColor="#ffffff"
          style={styles.textInput}
          onChangeText={setName}
          value={name}
        />

        <View style={{marginTop: 40, alignItems: 'center', marginBottom: 20}}>
          <Calendar onChange={setDate} OnChange={setDay} value={''} />

          <TextInput
            placeholder="Select Date"
            editable={false}
            placeholderTextColor="#ffffff"
            style={{
              margin: 15,
              backgroundColor: '#434343',
              textAlign: 'center',
              color: '#ffffff',
              fontSize: 18,
            }}
            value={date}
          />

          <Text>YYYY/MM/DD</Text>
        </View>

        <MyButton
          background-Color="#555555"
          title="Submit"
          customClick={load}
        />
        <MyButton title="Exit" customClick={cancel} />
      </View>
    </ScrollView>
  </Modal>
);

export default ModalForm;
