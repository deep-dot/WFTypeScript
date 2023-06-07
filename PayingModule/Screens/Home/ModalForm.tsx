/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TextInput, Modal, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Calendar} from '../../Components/Calendar';
import MyButton from '../../Components/Mybutton';
import styles from './HomeScreen.style';
import {StateContext} from '../../../Utilities/Context';
import {InsertData} from '../Enter/Actions';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App';

interface Props {
  navigation: StackNavigationProp<StackParamList>;
}

const ModalForm = ({navigation}: Props) => {
  const stateContext = React.useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;

  let register = () => {
    InsertData(state, dispatch);
  };

  let load = () => {
    if (!state.Week_Ending_Date || !state.Name) {
      Alert.alert('Put name and date in');
    } else {
      register();
      dispatch({type: 'UPDATE', payload: {modalVisible: false}});
    }
  };
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
            style={{color: '#fff', marginTop: 20, fontSize: 25}}
            onChangeText={(Name: string) => {
              dispatch({
                type: 'UPDATE',
                payload: {
                  Name,
                },
              });
            }}
            value={state.Name}
          />

          <View style={{marginTop: 40, alignItems: 'center', marginBottom: 20}}>
            <Calendar
              value={state.Date}
              onChange={(date: string, day: string) => {
                dispatch({
                  type: 'UPDATE',
                  payload: {
                    Week_Ending_Date: date,
                    Week_Ending_Day: day,
                  },
                });
              }}
            />
            <Text style={{fontSize: 25, padding: 5, color: '#55a8fa'}}>
              {state.Week_Ending_Date
                ? state.Week_Ending_Day + ' ' + state.Week_Ending_Date
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
