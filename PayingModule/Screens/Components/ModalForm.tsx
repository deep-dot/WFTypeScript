/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Calendar} from './Calendar';
import styles from '../screens.style';
import {StateContext} from '../../Utilities/Context';
import {saveWeekEndingData} from '../../Utilities/Actions';
import Icon from 'react-native-vector-icons/Ionicons';

const ModalForm = () => {
  const stateContext = React.useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;

  const inCloud = () => {};

  let load = () => {
    if (!state.Week_Ending_Date || !state.Name) {
      Alert.alert('Put name and date in');
    } else {
      const id = state.WEid;
      saveWeekEndingData(state, dispatch, Number(id));
    }
  };

  let cancel = () => {
    if (!state.Week_Ending_Date || !state.Name) {
      Alert.alert('Put name and date in');
    } else {
      dispatch({
        type: 'INSERT',
        payload: {modalVisible: false, table: 'datatable'},
      });
    }
  };
  return (
    <Modal
      visible={
        state.modalVisible !== undefined
          ? Boolean(state.modalVisible)
          : undefined
      }
      animationType={'fade'}
      onRequestClose={() => {}}>
      <ScrollView>
        <View style={styles.model}>
          <Text style={[styles.titleText, {alignSelf: 'center'}]}>
            Enter Name & Week Ending Date
          </Text>

          <TextInput
            placeholder="Your Name"
            placeholderTextColor="#000"
            style={{
              color: '#000',
              marginTop: 20,
              fontSize: 13,
              alignSelf: 'center',
            }}
            onChangeText={(Name: string) => {
              dispatch({
                type: 'INSERT',
                payload: {
                  Name,
                  table: 'weekEndingTable',
                },
              });
            }}
            value={String(state.Name)}
          />

          <View style={{marginTop: 40, alignItems: 'center', marginBottom: 20}}>
            <Calendar
              value={String(state.Date)}
              onChange={(date: string, day: string) => {
                dispatch({
                  type: 'INSERT',
                  payload: {
                    Week_Ending_Date: date,
                    Week_Ending_Day: day,
                    table: 'weekEndingTable',
                  },
                });
              }}
            />
            <Text style={{fontSize: 15, padding: 5, color: '#55a8fa'}}>
              {state.Week_Ending_Date
                ? state.Week_Ending_Day + ' ' + state.Week_Ending_Date
                : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
            </Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={load}>
              <Icon name="save-outline" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={inCloud}>
              <Icon name="cloud-outline" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={cancel}>
              <Icon name="exit-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default ModalForm;
