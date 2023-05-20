/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import Mybutton from '../../components/Mybutton';
import Mytextinput from '../../components/Mytextinput';
import {openDatabase} from 'react-native-sqlite-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import Calendar from '../../components/Calendar';
import styles from './Delete.style';
import envs from '../../config/env';
const {DATABASE_NAME} = envs;
var db = openDatabase(
  {name: DATABASE_NAME, createFromLocation: 1},
  () => {},
  error => {
    console.log('ERROR:' + error);
  },
);

export default function deleteRecord(props) {
  const [id, setId] = useState('');
  let [search_date, setSearch_date] = useState('');
  const [day, setDay] = useState('');
  let [flatListItems, setFlatListItems] = useState([]);

  const ShowRecord = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM  datatable where Date = ? or user_id = ? ',
        [search_date, id],
        (_tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var temp = [];
            for (let i = 0; i < len; i++) {
              temp.push(results.rows.item(i));
            }
            setFlatListItems(temp);
            DeleteRecord();
          } else {
            setFlatListItems('');
            Alert.alert('Sorry!', 'Record does not exist on this ID or Date');
          }
        },
      );
    });
  };

  const DeleteRecord = () => {
    if (!search_date && !id) {
      Alert.alert('Please select Date or input Id!');
    } else {
      Alert.alert(
        'Please confirm!',
        'Do you wish to delete the record?',
        [
          {
            text: 'Yes',
            onPress: () => {
              Delete();
            },
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }
  };
  const Delete = () => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  datatable where Date = ? or user_id = ? ',
        [search_date, id],
        (_tx, results) => {
          Alert.alert('Record deleted successfully!');
        },
      );
    });
  };

  let listViewItemSeparator = () => {
    return <View style={{height: 3, width: '100%'}} />;
  };

  let listItemView = item => {
    return (
      <View
        key={item.user_id}
        style={{backgroundColor: '#ffffff', marginTop: 10, padding: 5}}>
        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Record Id</Text>
          <Text style={styles.titletext}>{item.user_id}</Text>
        </View>
        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Day</Text>
          <TextInput
            placeholder="Day"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Day}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Date</Text>
          <TextInput
            placeholder="Date"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Date}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Shift Worked</Text>
          <TextInput
            placeholder="----"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Shift}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Taxi Number</Text>
          <TextInput
            placeholder="Rego No."
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Taxi}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Number Of Jobs</Text>
          <TextInput
            placeholder="00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Jobs}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Insurancefee</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Ins}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total fare</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Shift_Total}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Commission Company</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Com_GTN}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Km</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Kms}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Paid Km</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Paid_Kms}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Eftpos</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Eftpos_Total}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Eftpos Lifting</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Eftpos_LFee}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Dockets</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Dockets}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Charge Authority</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Charge_Authority}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Gov Sub Manual</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Manual_MPTP_Total}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Gov Sub Manual-31</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Gov_Sub_Manual31}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Number Of Manual Lifts</Text>
          <TextInput
            placeholder="00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.No_of_Manual_Lifts}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Lifting Fee Value</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Total_Lifting_Fee_Value}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Misc</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Misc}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Fuel</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Acc_Fuel}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>CPK</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.CPK}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>
            Manual docket value {'\n'} (For M31 or M30){' '}
          </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>
              {item.manual_lifting_fee_value}
            </Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Number of chairs</Text>
          <TextInput
            placeholder="00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.no_wheelchair_lifts}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Company lifting fee</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>
              {item.company_portion_lifting_fee}
            </Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Driver lifting fee</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>
              {item.driver_portion_lifting_fee}
            </Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Deductions</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={styles.titletext}>{item.Deductions}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
            Net Cash
          </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#000000"
            style={styles.textInput}>
            <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
              {item.Net_Payin}
            </Text>
          </TextInput>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#35363A'}}>
      <View style={styles.textinputview}>
        <Calendar
          value={search_date}
          onChange={tareek => setSearch_date(tareek)}
          OnChange={din => setDay(din)}
        />
        <TextInput
          placeholder="Search by Date"
          placeholderTextColor="#ffffff"
          style={{height: 45, padding: 0}}
          editable={false}
          onSubmitEditing={() => {
            if (!date) {
              Alert.alert('Please input Date');
            } else {
              insurance.focus();
            }
          }}>
          <Text style={styles.titleText}>{search_date}</Text>
        </TextInput>
      </View>

      <View style={styles.textinputview}>
        <Text style={{color: '#ffffff', fontSize: 18, fontWeight: '500'}}>
          Search by ID:
        </Text>
        <TextInput
          style={{
            borderColor: '#ffffff',
            width: '15%',
            borderBottomWidth: 2,
            marginRight: 20,
          }}
          keyboardType="numeric"
          onChangeText={num => setId(num)}
          //value={id}
        >
          <Text style={styles.titleText}>{id}</Text>
        </TextInput>
      </View>

      <View style={{borderBottomWidth: 0, alignItems: 'center'}}>
        <Text style={{color: '#000000'}}>yyyy/mm/dd</Text>
      </View>

      <Mybutton title="Delete" customClick={ShowRecord} />
      <FlatList
        data={flatListItems}
        ItemSeparatorComponent={listViewItemSeparator}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({item}) => listItemView(item)}
      />
    </SafeAreaView>
  );
}
