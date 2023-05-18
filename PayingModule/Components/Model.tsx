import React, {useState, useEffect} from 'react';
import {
  Alert,
  TextInput,
  ScrollView,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Modal,
} from 'react-native';
import Mybutton from './Mybutton';
import {openDatabase} from 'react-native-sqlite-storage';
import {updateLocale} from 'moment';
var db = openDatabase(
  {name: 'database.db', createFromLocation: 1},
  () => {},
  error => {
    console.log('ERROR: ' + error);
  },
);
const {height, width} = Dimensions.get('window');

const Model = props => {
  const [liftingtotal, setLiftingtotal] = useState('');
  const [liftingdriver, setliftingdriver] = useState('');
  const [liftingcompany, setliftingcompany] = useState('');
  const [levy, setLevy] = useState('');
  const [drivercommrate, setDrivercommrate] = useState('');
  const [companycommrate, setCompanycommrate] = useState('');

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='UpdateItems'",
        [],
        function (_tx, res) {
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
  }, []);

  let UpdateItems = () => {
    db.transaction(function (tx) {
      tx.executeSql('Delete from UpdateItems', []);
      tx.executeSql(
        'INSERT INTO UpdateItems ( GovLFee, CompanyLFee, DriverLFee, Levy, Driver_Comm_Rate, Company_Comm_Rate) VALUES(?,?,?,?,?,?)',
        [
          liftingtotal,
          liftingcompany,
          liftingdriver,
          levy,
          drivercommrate,
          (100 - drivercommrate),
        ],
        (_tx, results) => {
          if (results.rowsAffected > 0) {
            props.onupdate();
          } 
        },
      );
    });
  };

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT GovLFee, CompanyLFee, DriverLFee, Levy, Driver_Comm_Rate, Company_Comm_Rate FROM UpdateItems',
        [],
        (_tx, results) => {
          var len = results.rows.length;
          if (len > 0) {         
            let res = results.rows.item(0);
            updateallstates(
              res.GovLFee,
              res.CompanyLFee,
              res.DriverLFee,
              res.Levy,
              res.Driver_Comm_Rate,
              res.Company_Comm_Rate,
            );
            /*  setuserdata(results.rows.item(0));
            setLiftingtotal(Number(userdata.GovLFee).toFixed(2));
            setliftingcompany(Number(userdata.CompanyLFee).toFixed(2));
            setliftingdriver(Number(userdata.DriverLFee).toFixed(2));
            setLevy(Number(userdata.Levy).toFixed(2));
            setDrivercommrate(Number(userdata.Driver_Comm_Rate).toFixed(0));
            setCompanycommrate(Number(userdata.Company_Comm_Rate).toFixed(0));*/
          } else {
            updateallstates('','','','','','');
          }
        },
      );
    });
  }, []);
  let updateallstates = (a, b, c, d, e, f) => {
    setLiftingtotal(a);
    setliftingcompany(b);
    setliftingdriver(c);
    setLevy(d);
    setDrivercommrate(e);
    setCompanycommrate(f);
  };
  let lev, liftdriver, liftcompany, driverrate, companyrate;

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        transparent={true}
        presentaitonStyle={'pageSheet'}
        visible={props.modvisible}
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
                onChangeText={num => setLiftingtotal(num)}
               // value={liftingtotal}
                onSubmitEditing={() => {
                  {
                    if (isNaN(liftingtotal)) {
                      Alert.alert('Please input a correct number');
                    } else {
                      //setLiftingtotal(Number(liftingtotal).toFixed(2));
                      liftdriver.focus();
                    }
                  }
                }}
                >
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
                onChangeText={num => setliftingdriver(num)}
                //value={liftingdriver}
                ref={input => {
                  liftdriver = input;
                }}
                onSubmitEditing={() => {
                  {
                    if (!liftingdriver && isNaN(liftingdriver)) {
                      Alert.alert('Please input a correct number');
                    } else {
                      liftcompany.focus();
                    }
                  }
                }}
                >
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
                onChangeText={num => setLevy(num)}
                //value={levy}
                ref={input => {
                  lev = input;
                }}
                onSubmitEditing={() => {
                  if (isNaN(levy) && !levy) {
                    Alert.alert('Please input a correct number');
                  } else {
                    driverrate.focus();
                  }
                }}
                >
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
                onChangeText={num => setDrivercommrate(num)}
                //value={drivercommrate}
                ref={input => {
                  driverrate = input;
                }}
                onSubmitEditing={() => {
                  companyrate.focus();
                }}
                >
                <Text style={styles.titletext}>{drivercommrate}</Text>
              </TextInput>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Mybutton title="Submit" customClick={UpdateItems} />
              <Mybutton title="Cancel" customClick={props.onCancel} />
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
