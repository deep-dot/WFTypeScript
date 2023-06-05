/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useContext} from 'react';
import {
  TouchableOpacity,
  ScrollView,
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
  selectCountFromDataTable,
  deleteDataInTable,
} from '../../Components/dbUtility';
import Calendar from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App';
import {useNavigation} from '@react-navigation/core';
import {FormValues, initialValues} from '../../Components/EnterDataValues';
import MyButton from '../../Components/Mybutton';
import {StateContext} from '../../../Utilities/Context';

const ViewRecords = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'View Records'>>();
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [flatListItems, setFlatListItems] = useState([{}]);
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch} = stateContext;

  let SearchRecord = async (start_date: string, finish_date: string) => {
   // console.log('start date==', start_date);
    const current_date = new Date().toLocaleDateString();
    const startDate = start_date ? start_date : current_date;
    const endDate = finish_date ? finish_date : current_date;
    try {
      const res = await ViewRecordsByDate(startDate, endDate);
     // console.log('res===', res);
      setFormValues(prevState => ({
        ...prevState,
        totalrecords: res.length.toString(),
      }));
      setFlatListItems(res);
      if (res.length === 0) {
        setFormValues(prevState => ({
          ...prevState,
          sorryAlert: true,
        }));
        setFlatListItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Delete = async (id: string, date: string) => {
    const res = await deleteDataInTable(id, date);
    if (res === 'Deleted successfully') {
      selectCountFromDataTable()
        .then(({len, temp}) => {
          //  console.log(len, temp);
          setFormValues(prevState => ({
            ...prevState,
            totalrecords: len.toString(),
          }));
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
      const searchedData = await UpdateData(searchDate, dispatch);
      dispatch({type: 'UPDATE', payload: searchedData});
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
      <View style={{backgroundColor: '#ffffff', marginTop: 10, padding: 5}}>
        <View style={styles.textinputview}>
          <MyButton
            title="Delete"
            customClick={() =>
              DeleteRecord(item?.Record_id.toString(), item?.Date)
            }
          />
          <MyButton
            title="Update"
            customClick={() => handleRefresh(item?.Date)}
          />
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
    setFormValues(prevState => ({
      ...prevState,
      sorryAlert: false,
      show2Alert: false,
    }));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#35363A'}}>
      <AwesomeAlert
        show={formValues.sorryAlert}
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
        show={formValues.show2Alert}
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
      <ScrollView>
        <Text style={{color: '#ffffff', textAlign: 'center'}}>
          Total Number of Entries = {formValues.totalrecords}
        </Text>

        <View style={styles.textinputview}>
          <Calendar
            value={formValues.start_date}
            onChange={async (date: string, day: string) => {
              setFormValues(prevValues => ({
                ...prevValues,
                start_date: date,
                start_day: day,
              }));
              await SearchRecord(date, formValues.finish_date);
            }}
          />
          <Text style={styles.Textinput}>
            {formValues.start_date
              ? formValues.start_day + ' ' + formValues.start_date
              : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Calendar
            value={formValues.finish_date}
            onChange={async (date: string, day: string) => {
              setFormValues(prevValues => ({
                ...prevValues,
                finish_date: date,
                finish_day: day,
              }));
              await SearchRecord(formValues.start_date, date);
            }}
          />
          <Text style={styles.Textinput}>
            {formValues.finish_date
              ? formValues.finish_day + ' ' + formValues.finish_date
              : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
          </Text>
        </View>

        <View style={{borderBottomWidth: 1, alignItems: 'center'}}>
          <Text style={styles.Textinput}>
            {' '}
            Display Records = {formValues.totalrecords}
          </Text>
        </View>
      </ScrollView>

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
          padding: 15,
          borderTopColor: 'white',
          borderTopWidth: 2,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            flexDirection: 'column',
          }}>
          {/* <Icon name="home" size={20} color="#fff" /> */}
          <Text
            style={{
              color: '#ffffff',
              fontSize: 10,
              textAlign: 'center',
            }}>
            HOME
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textinputview: {
    flexDirection: 'row',
    borderColor: '#ffffff',
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
