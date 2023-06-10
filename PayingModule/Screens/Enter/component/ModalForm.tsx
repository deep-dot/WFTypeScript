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
import {Calendar} from '../../../Components/Calendar';
import styles from '../EnterDataScreen.style';
import {StateContext} from '../../../../Utilities/Context';
import {InsertData} from '../Actions';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../../App';
import Icon from 'react-native-vector-icons/Ionicons';

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

  const inCloud = () => {};
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
          <Text style={[styles.titleText, {alignSelf: 'center'}]}>
            Enter Name & Week Ending Date
          </Text>

          <TextInput
            placeholder="Enter Your Name"
            placeholderTextColor="#000"
            style={{
              color: '#fff',
              marginTop: 20,
              fontSize: 15,
              alignSelf: 'center',
            }}
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
