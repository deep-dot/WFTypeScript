/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TextInput, Modal} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Calendar} from '../../Components/Calendar';
import MyButton from '../../Components/Mybutton';
import styles from './HomeScreen.style';
import {StateContext} from '../../../Utilities/Context';

type ModalFormProps = {
  load: () => void;
};
const ModalForm = ({load}: ModalFormProps) => {
  const stateContext = React.useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;
  let cancel = () => {
    dispatch({type: 'UPDATE', payload: {modalVisible: false}});
  };
  return (
    <Modal
      visible={state.modalVisible}
      animationType={'fade'}
      onRequestClose={() => {}}>
      <ScrollView>
        <View style={styles.model}>
          <Text style={styles.titletext}>Enter Name & Week Ending Date</Text>

          <TextInput
            placeholder="Enter Your Name"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            onChangeText={(name: string) => {
              dispatch({
                type: 'UPDATE',
                payload: {
                  name,
                },
              });
            }}
            value={state.name}
          />

          <View style={{marginTop: 40, alignItems: 'center', marginBottom: 20}}>
            <Calendar
              value={state.Date}
              onChange={(date: string, day: string) => {
                dispatch({
                  type: 'UPDATE',
                  payload: {
                    date,
                    day,
                  },
                });
              }}
            />
            <Text style={{height: 35, padding: 5, color: '#55a8fa'}}>
              {state.date
                ? state.day + ' ' + state.date
                : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
            </Text>
          </View>

          <MyButton
            background-Color="#555555"
            title="Save"
            customClick={load}
          />
          <MyButton title="Exit" customClick={cancel} />
        </View>
      </ScrollView>
    </Modal>
  );
};

export default ModalForm;
