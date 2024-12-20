/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  TextInput,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {upsertLiftingTable} from '../../Utilities/Actions';
import {StateContext} from '../../Utilities/Context';
import Icon from 'react-native-vector-icons/Ionicons';

export const LiftingModel = () => {
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;

  let Save = async () => {
    try {
      dispatch({
        type: 'UPDATE',
        payload: {
          Lifting_Modal_Visible: !state.Lifting_Modal_Visible,
          table: 'datatable',
        },
      });
      const id = state?.liftingId;
      await upsertLiftingTable(state, dispatch, Number(id));
      // console.log('res===', res);
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    dispatch({
      type: 'UPDATE',
      payload: {
        Lifting_Modal_Visible: !state.Lifting_Modal_Visible,
        table: 'datatable',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={
          state.Lifting_Modal_Visible !== undefined
            ? Boolean(state.Lifting_Modal_Visible)
            : undefined
        }
        animationType={'fade'}
        onRequestClose={() => {}}>
        <ScrollView>
          <View style={styles.model}>
            <View style={styles.textinputview}>
              <Text style={styles.titletext}>Total Lifting Fee</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#000"
                style={styles.textInput}
                keyboardType="numeric"
                value={
                  state.Gov_Lifting_Fee === 0
                    ? ''
                    : String(state.Gov_Lifting_Fee)
                }
                onChangeText={(value: string) => {
                  dispatch({
                    type: 'UPDATE',
                    payload: {Gov_Lifting_Fee: value, table: 'datatable'},
                  });
                }}
                onSubmitEditing={() => {}}
              />
            </View>

            <View style={styles.textinputview}>
              <Text style={styles.titletext}>Driver's Share</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#000"
                style={styles.textInput}
                keyboardType="numeric"
                value={
                  state.Driver_Share_In_LiftingFee === 0
                    ? ''
                    : String(state.Driver_Share_In_LiftingFee)
                }
                onChangeText={(value: string) => {
                  dispatch({
                    type: 'UPDATE',
                    payload: {
                      Driver_Share_In_LiftingFee: value,
                      table: 'datatable',
                    },
                  });
                }}
                onSubmitEditing={() => {}}
              />
            </View>

            <View style={styles.textinputview}>
              <Text style={styles.titletext}>Levy</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#000"
                style={styles.textInput}
                keyboardType="numeric"
                value={state.Gov_Levy === 0 ? '' : String(state.Gov_Levy)}
                onChangeText={(value: string) => {
                  dispatch({
                    type: 'UPDATE',
                    payload: {Gov_Levy: value, table: 'datatable'},
                  });
                }}
                onSubmitEditing={() => {}}
              />
            </View>

            <View style={styles.textinputview}>
              <Text style={styles.titletext}>
                Driver Commission {'\n'}Rate(%)
              </Text>
              <TextInput
                placeholder="00"
                placeholderTextColor="#000"
                style={styles.textInput}
                keyboardType="numeric"
                value={
                  state.Driver_Comm_Rate === 0
                    ? ''
                    : String(state.Driver_Comm_Rate)
                }
                onChangeText={(value: string) => {
                  dispatch({
                    type: 'UPDATE',
                    payload: {Driver_Comm_Rate: value, table: 'datatable'},
                  });
                }}
                onSubmitEditing={() => {}}
              />
            </View>

            {/* <View style={styles.textinputview}>
              <Text style={styles.titletext}>
                Company Commission {'\n'}Rate(%)
              </Text>
              <TextInput
                placeholder="00"
                placeholderTextColor="#000"
                style={styles.textInput}
                keyboardType="numeric"
                value={
                  state.Company_Comm_Rate === 0
                    ? ''
                    : String(state.Company_Comm_Rate)
                }
                onChangeText={(value: string) => {
                  dispatch({
                    type: 'UPDATE',
                    payload: {Company_Comm_Rate: value, table: 'datatable'},
                  });
                }}
                onSubmitEditing={() => {}}
              />
            </View> */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 40,
              }}>
              <TouchableOpacity onPress={Save}>
                <Icon name="save-outline" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onCancel}>
                <Icon name="exit-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  model: {
    margin: 10,
    marginTop: 60,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#fff',
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 13,
  },
  textinputview: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#000000',
    margin: 15,
    alignItems: 'center',
    // marginLeft: 10,
    justifyContent: 'space-between',
  },
  buttontext: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    marginTop: 25,
    backgroundColor: '#54cb77',
    borderRadius: 20,
    elevation: 5,
  },
  titletext: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    height: 45,
    fontWeight: 'bold',
    color: '#000',
  },
});
