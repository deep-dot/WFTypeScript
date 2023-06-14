/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useContext} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  ViewRecordsByDate,
  UpdateData,
  SelectCountFromDataTable,
  deleteDataInTable,
} from './Actions';
import {Calendar} from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
import {NavigationProp} from '@react-navigation/native';
import {StackParamList} from '../../../App';
import {useNavigation} from '@react-navigation/core';
import {FormValues} from '../../Components/EnterDataValues';
import {StateContext} from '../../../Utilities/Context';
import Icon from 'react-native-vector-icons/Ionicons';

const ViewRecords = () => {
  const navigation =
    useNavigation<NavigationProp<StackParamList, 'View Records'>>();
  const [flatListItems, setFlatListItems] = useState([{}]);
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch, starRating} = stateContext;

  let SearchRecord = async (start_date: string, finish_date: string) => {
    // console.log('start date==', start_date);
    const current_date = new Date().toLocaleDateString();
    const startDate = start_date ? start_date : current_date;
    const endDate = finish_date ? finish_date : current_date;
    try {
      const res = await ViewRecordsByDate(startDate, endDate);
      // console.log('res===', res);
      dispatch({
        type: 'UPDATE',
        payload: {totalrecords: res.length.toString()},
      });
      setFlatListItems(res);
      if (res.length === 0) {
        dispatch({
          type: 'UPDATE',
          payload: {sorryAlert: true},
        });
        setFlatListItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Delete = async (id: string, date: string) => {
    const res = await deleteDataInTable(id, date);
    if (res === 'Deleted successfully') {
      SelectCountFromDataTable(dispatch)
        .then(temp => {
          setFlatListItems(temp);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const DeleteRecord = (id: string, date: string) => {
    Alert.alert(
      'Please confirm!',
      'Do you wish to delete the record?',
      [
        {
          text: 'Yes',
          onPress: () => {
            Delete(id, date);
          },
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  let listViewItemSeparator = () => {
    return (
      <View style={{height: 10, width: '100%', backgroundColor: '#000'}} />
    );
  };

  const handleRefresh = async (searchDate: string) => {
    try {
      await UpdateData(searchDate, dispatch);
      navigation.navigate('Enter Data');
    } catch (error) {
      // handle error
      console.error(error);
    }
  };

  let listItemView = (item: FormValues) => {
    console.log('item in flatlist==', item?.Day);
    if (item == null || item === undefined) {
      return null;
    }
    return (
      <View style={{backgroundColor: '#ffffff', padding: 20}}>
        <View style={[styles.textinputview, {borderColor: '#fff'}]}>
          <TouchableOpacity
            onPress={() => {
              DeleteRecord(item?.Record_id.toString(), item?.Date);
            }}>
            <Icon name="trash-outline" size={20} color="tomato" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleRefresh(item?.Date);
            }}>
            <Icon name="create-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Record Id</Text>
          <Text style={styles.titletext}>{item?.Record_id}</Text>
        </View>
        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Day</Text>
          <Text style={styles.titletext}>{item?.Day}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Date</Text>
          <Text style={styles.titletext}>{item?.Date}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Shift Worked</Text>
          <Text style={styles.titletext}>{item?.Shift}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Taxi Number</Text>
          <Text style={styles.titletext}>{item?.Taxi}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Number Of Jobs</Text>
          <Text style={styles.titletext}>{item?.Jobs_Done}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Insurancefee</Text>
          <Text style={styles.titletext}>{item?.Insurance}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Eftpos</Text>
          <Text style={styles.titletext}>{item?.Eftpos}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Eftpos Lifting</Text>
          <Text style={styles.titletext}>{item?.Eftpos_Lifting_Value}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Dockets</Text>
          <Text style={styles.titletext}>{item?.M3_Dockets}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Charge Authority</Text>
          <Text style={styles.titletext}>
            {item?.Electronic_Account_Payments}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Gov Sub Manual</Text>
          <Text style={styles.titletext}>
            {item?.Total_Manual_MPTP31_And_MPTP_Values}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Number Of Manual Lifts</Text>
          <Text style={styles.titletext}>
            {item?.Number_Of_Manual_Liftings}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Misc</Text>
          <Text style={styles.titletext}>{item?.Misc}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Fuel</Text>
          <Text style={styles.titletext}>{item?.Fuel}</Text>
        </View>
      </View>
    );
  };

  const HideAlert = () => {
    dispatch({type: 'UPDATE', payload: {sorryAlert: false, show2Alert: false}});
  };

  return (
    <SafeAreaView
      style={{display: 'flex', flex: 1, backgroundColor: '#35363A'}}>
      <AwesomeAlert
        show={state.sorryAlert}
        showProgress={false}
        title="SORRY !"
        message="No data found."
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#54cb77"
        onConfirmPressed={HideAlert}
      />
      <AwesomeAlert
        show={state.show2Alert}
        showProgress={false}
        title=""
        message="Please select Date !"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#54cb77"
        onConfirmPressed={HideAlert}
      />

      <View
        style={{
          backgroundColor: '#fff',
          borderColor: '#000',
          borderBottomWidth: 0.5,
        }}>
        <Text style={{textAlign: 'center', color: 'green', paddingTop: 20}}>
          Total Entries = {state.Number_Of_Entries}
        </Text>

        <View style={[styles.textinputview, {borderColor: '#fff'}]}>
          <Calendar
            value={state.start_date}
            onChange={async (date: string, day: string) => {
              dispatch({
                type: 'UPDATE',
                payload: {start_date: date, start_day: day},
              });
              await SearchRecord(date, state.finish_date);
            }}
          />
          <Text style={styles.Textinput}>
            {state.start_date
              ? state.start_day + ' ' + state.start_date
              : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
          </Text>
        </View>

        <View style={[styles.textinputview, {borderColor: '#fff'}]}>
          <Calendar
            value={state.finish_date}
            onChange={async (date: string, day: string) => {
              dispatch({
                type: 'UPDATE',
                payload: {finish_date: date, finish_day: day},
              });
              await SearchRecord(state.start_date, date);
            }}
          />
          <Text style={styles.Textinput}>
            {state.finish_date
              ? state.finish_day + ' ' + state.finish_date
              : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
          </Text>
        </View>

        <Text style={[styles.Textinput, {alignSelf: 'center'}]}>
          {' '}
          Display Records = {state.totalrecords}
        </Text>
      </View>

      <FlatList
        data={flatListItems}
        ItemSeparatorComponent={listViewItemSeparator}
        keyExtractor={(item: FormValues, index: number) => index.toString()}
        renderItem={({item}: {item: FormValues}) => listItemView(item)}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#444444',
          paddingHorizontal: 35,
          paddingVertical: 10,
          borderTopColor: 'white',
          borderTopWidth: 2,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Enter Data')}>
          <Icon name="enter-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
             navigation.navigate('Display Report');
          }}>
          <Icon name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textinputview: {
    flexDirection: 'row',
    borderColor: '#000',
    borderBottomWidth: 0.5,
    marginRight: 10,
    marginTop: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titletext: {
    color: '#000',
    fontSize: 14,
  },
  textInput: {
    height: 45,
    padding: 0,
    color: '#ffffff',
  },
  Textinput: {
    height: 35,
    padding: 5,
    color: '#55a8fa',
  },
});
export default ViewRecords;
