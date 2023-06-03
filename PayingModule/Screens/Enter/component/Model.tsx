/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Modal,
} from 'react-native';
import Mybutton from '../../../Components/Mybutton';
import db from '../../../Database/databaseService';
import {Transaction, ResultSet} from '../../../Database/databaseTypes';

interface Props {
  onupdate: () => void;
  onCancel: () => void;
  modvisible: boolean;
}

const Model = ({onupdate, onCancel, modvisible}: Props) => {
  const [liftingtotal, setLiftingtotal] = useState<string>('');
  const [liftingdriver, setliftingdriver] = useState<string>('');
  const [levy, setLevy] = useState<string>('');
  const [drivercommrate, setDrivercommrate] = useState<string>('');

  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='UpdateItems'",
          [],
          (_tx: Transaction, res: ResultSet) => {
            console.log(res.rows.length);
            if (res.rows.length === 0) {
              txn.executeSql('DROP TABLE IF EXISTS UpdateItems', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS UpdateItems ( GovLFee NUMERIC, CompanyLFee NUMERIC, DriverLFee NUMERIC, Levy NUMERIC, Driver_Comm_Rate NUMERIC, Company_Comm_Rate NUMERIC)',
                [],
              );
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);

  let UpdateItems = () => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql('Delete from UpdateItems', []);
        txn.executeSql(
          'INSERT INTO UpdateItems ( GovLFee, DriverLFee, Levy, Driver_Comm_Rate, Company_Comm_Rate) VALUES(?,?,?,?,?)',
          [
            liftingtotal,
            liftingdriver,
            levy,
            drivercommrate,
            100 - Number(drivercommrate),
          ],
          (_tx: Transaction, res: ResultSet) => {
            if (res.rowsAffected > 0) {
              onupdate();
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  };

  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT GovLFee, DriverLFee, Levy, Driver_Comm_Rate FROM UpdateItems',
          [],
          (_tx: Transaction, results: ResultSet) => {
            var len = results.rows.length;
            if (len > 0) {
              let res = results.rows.item(0);
              updateallstates(
                res.GovLFee,
                res.DriverLFee,
                res.Levy,
                res.Driver_Comm_Rate,
              );
            } else {
              updateallstates('', '', '', '');
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);
  let updateallstates = (a: string, b: string, c: string, d: string): void => {
    setLiftingtotal(a);
    setliftingdriver(b);
    setLevy(c);
    setDrivercommrate(d);
  };

  // let refs = {
  //   liftdriver: useRef(null),
  //   driverrate: useRef(null),
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        //  transparent={true}
        //presentationStyle={'pageSheet'}
        visible={modvisible}
        animationType={'fade'}
        onRequestClose={() => {}}>
        <ScrollView>
          <View style={styles.model}>
            <View style={styles.textinputview}>
              <Text style={styles.titletext}>Total Lifting Fee</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#ffffff"
                style={styles.textInput}
                keyboardType="numeric"
                onChangeText={(text: string) => setLiftingtotal(text)}
                // value={liftingtotal}
                onSubmitEditing={() => {
                  {
                    if (!liftingtotal) {
                      Alert.alert('Please input a correct number');
                    } else {
                      //refs.liftdriver.current?.focus();
                    }
                  }
                }}>
                <Text style={styles.titletext}>{liftingtotal}</Text>
              </TextInput>
            </View>

            <View style={styles.textinputview}>
              <Text style={styles.titletext}>Driver's Share</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#ffffff"
                //alignItems="center"
                style={styles.textInput}
                keyboardType="numeric"
                onChangeText={(text: string) => setliftingdriver(text)}
                //value={liftingdriver}
                // ref={input => {
                //   liftdriver = input;
                // }}
                onSubmitEditing={() => {
                  {
                    if (!liftingdriver) {
                      Alert.alert('Please input a correct number');
                    } else {
                      //refs.liftcompany.current?.focus();
                    }
                  }
                }}>
                <Text style={styles.titletext}>{liftingdriver}</Text>
              </TextInput>
            </View>

            {/* <View style={styles.textinputview}>
              <Text style={styles.titletext}>Company's Share</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#ffffff"
                style={styles.textInput}
                keyboardType="numeric"
                onChangeText={num => setliftingcompany(num)}
                //value={liftingcompany}
                ref={input => {
                  liftcompany = input;
                }}
                onSubmitEditing={() => {
                  if (isNaN(liftingcompany) && !liftingcompany) {
                    Alert.alert('Please input a correct number');
                  } else {
                    lev.focus();
                  }
                }}
                >
                <Text style={styles.titletext}>{liftingcompany}</Text>
              </TextInput>
            </View> */}

            <View style={styles.textinputview}>
              <Text style={styles.titletext}>Levy</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#ffffff"
                style={styles.textInput}
                keyboardType="numeric"
                onChangeText={(text: string) => setLevy(text)}
                //value={levy}
                // ref={input => {
                //   lev = input;
                // }}
                onSubmitEditing={() => {
                  if (!levy) {
                    Alert.alert('Please input a correct number');
                  } else {
                    // refs.driverrate.current?.focus();
                  }
                }}>
                <Text style={styles.titletext}>{levy}</Text>
              </TextInput>
            </View>

            <View style={styles.textinputview}>
              <Text style={styles.titletext}>
                Driver Commission {'\n'}Rate(%)
              </Text>
              <TextInput
                placeholder="00"
                placeholderTextColor="#ffffff"
                style={styles.textInput}
                keyboardType="numeric"
                onChangeText={(text: string) => setDrivercommrate(text)}
                //value={drivercommrate}
                // ref={input => {
                //   refs.driverrate = input;
                // }}
              >
                <Text style={styles.titletext}>{drivercommrate}</Text>
              </TextInput>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Mybutton title="Submit" customClick={UpdateItems} />
              <Mybutton title="Cancel" customClick={onCancel} />
            </View>
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};

export default Model;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    opacity: 0.5,
    justifyContent: 'center',
  },
  model: {
    margin: 10,
    marginTop: 60,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#35363A',
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    height: 35,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});