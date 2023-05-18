import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Linking,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import Calendar from '../../components/Calendar';
import Mybutton from '../../components/Mybutton';
import Mytextinput from '../../components/Mytextinput';
import {openDatabase} from 'react-native-sqlite-storage';
import RNPrint from 'react-native-print';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './DisplayReport.style';
import  envs  from '../../config/env';
const {DATABASE_NAME} = envs
var db = openDatabase(
  {name: DATABASE_NAME, createFromLocation: 1},
  () => {},
  error => {
    console.log('ERROR:' + error);
  },
);

export default function DisplayReport(_props) {
  const [tableHead, setTableHead] = useState([
    'Date',
    'Day',
    'Shift',
    'Taxi',
    'Jobs',
    'Ins',
    'Shift Total',
    'Com Company',
    'Kms',
    'Paid Kms',
    'Eftpos Total',
    'EftposLFee',
    'Dockets',
    'Charge Authority',
    'Manual MPTP Dockets',
    'No.of Manual Lifts',
    'Misc',
    'A/c Fuel',
    'Net Payin',
    'CPK',
  ]);
  const [widthArr, setWidthArr] = useState([
    80,
    80,
    60,
    70,
    50,
    60,
    80,
    60,
    60,
    80,
    80,
    100,
    80,
    80,
    80,
    80,
    60,
    60,
    80,
    50,
  ]);

  const [tableHead1, setTableHead1] = useState([
    'Total Lifting Fee Value',
    'Total No. of Wheelchairs Lifts;',
    'Total No. of Manual MPTP Lifts:',
    'Total Manual Lifting Fee Value:',
    'Total Eftpos Lifting Fee Value:',
    'Total Company Portion of Lifting Fee:',
    'Total Driver Portion of Lifting Fee:',
  ]);
  const [widthArr1, setWidthArr1] = useState([
    150,
    150,
    150,
    150,
    150,
    150,
    150,
  ]);

  const [tableHead2, setTableHead2] = useState([
    'Eftpos',
    'Gov-Sub Manual',
    'Gov-Sub Manual31',
    'Dockets',
    'Charge Authority',
    'Misc',
    'Deductions',
    'Pay Ins-Cash',
  ]);
  const [widthArr2, setWidthArr2] = useState([
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
  ]);

  //displaytable
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='displaytable'",
        [],
        function (_tx, res) {
          console.log('displaytable', res.rows.length);
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS displaytable', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS displaytable (Date TEXT,Day TEXT, Shift TEXT, Taxi TEXT, Jobs NUMERIC, Ins NUMERIC, Shift_Total NUMERIC, Com_GTN NUMERIC, Kms NUMERIC, Paid_Kms NUMERIC, Eftpos_Total NUMERIC, Eftpos_LFee NUMERIC, Dockets NUMERIC, Charge_Authority NUMERIC, Manual_MPTP_Total NUMERIC, No_of_Manual_Lifts NUMERIC,Total_Lifting_Fee_Value NUMERIC, Misc NUMERIC, Acc_Fuel NUMERIC, Net_Payin NUMERIC, manual_lifting_fee_value NUMERIC, no_wheelchair_lifts NUMERIC, company_portion_lifting_fee NUMERIC, driver_portion_lifting_fee NUMERIC, Gov_Sub_Manual31 NUMERIC, CPK NUMERIC, Deductions NUMERIC)',
              [],
            );
          }
        },
      );
    });
  }, []);

  let Report = () => {
    if (!start_date || !finish_date) {
      Alert.alert('Please select Date !');
    } else {
      db.transaction(function (tx) {
        tx.executeSql('Delete from displaytable', []);
        tx.executeSql(
          'INSERT INTO displaytable SELECT Date,Day,Shift,Taxi,Jobs,Ins,Shift_Total,Com_GTN,Kms,Paid_Kms,Eftpos_Total,Eftpos_LFee,Dockets,Charge_Authority,Manual_MPTP_Total,No_of_Manual_Lifts,Total_Lifting_Fee_Value,Misc,Acc_Fuel,Net_Payin,manual_lifting_fee_value,no_wheelchair_lifts,company_portion_lifting_fee,driver_portion_lifting_fee,Gov_Sub_Manual31,CPK, Deductions from datatable where Date >= ? and Date <= ? order by Date',
          [start_date, finish_date],
          (_tx, results) => {
            tx.executeSql(
              'SELECT Date,Day,Shift,Taxi,Jobs,Ins,Shift_Total,Com_GTN,Kms,Paid_Kms,Eftpos_Total,Eftpos_LFee,Dockets,Charge_Authority,Manual_MPTP_Total,No_of_Manual_Lifts,Misc,Acc_Fuel,Net_Payin,CPK FROM displaytable',
              [],
              (_tx, results) => {
                const temp = [];
                var len = results.rows.length;
                if (len > 0) {
                  for (let j = 0; j < len; ++j) {
                    temp.push(results.rows.item(j));
                  }
                  setTable(temp);
                  searchUser();
                  Total();
                } else {
                  Alert.alert('Sorry !', 'Record does not exist.');
                }
              },
            );
          },
        );
      });
    }
  };
  const [table, setTable] = useState([]);
  const tableData = table.map(record => [
    record.Date,
    record.Day,
    record.Shift,
    record.Taxi,
    Number(record.Jobs).toFixed(0),
    Number(record.Ins).toFixed(2),
    Number(record.Shift_Total).toFixed(2),
    Number(record.Com_GTN).toFixed(2),
    Number(record.Kms).toFixed(2),
    Number(record.Paid_Kms).toFixed(2),
    Number(record.Eftpos_Total).toFixed(2),
    Number(record.Eftpos_LFee).toFixed(2),
    Number(record.Dockets).toFixed(2),
    Number(record.Charge_Authority).toFixed(2),
    Number(record.Manual_MPTP_Total).toFixed(2),
    Number(record.No_of_Manual_Lifts).toFixed(0),
    Number(record.Misc).toFixed(2),
    Number(record.Acc_Fuel).toFixed(2),
    Number(record.Net_Payin).toFixed(2),
    Number(record.CPK).toFixed(2),
  ]);

  const [nametable, setNameTable] = useState([]);
  let [userdata, setuserdata] = useState({});

  let searchUser = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT Name, Week_Ending_Date FROM nameweekendingtable',
        [],
        (_tx, results) => {
          var len = results.rows.length;
          console.log('name n wed', len);
          if (len > 0) {
            setuserdata(results.rows.item(0));
            const temp = [];
            temp.push(results.rows.item(0));
            setNameTable(temp);
          } else {
            setuserdata('');
          }
        },
      );
    });
  };

  const tableNameData = nametable.map(record => [
    record.Name,
    record.Week_Ending_Date,
    new Date().toDateString(),
  ]);

  //Toaltable
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='totaltable'",
        [],
        function (_tx, res) {
          console.log('totaltable', res.rows.length);
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS totaltable', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS totaltable (Date TEXT, Day TEXT, Jobs NUMERIC, Ins NUMERIC, Shift_Total NUMERIC, Com_GTN NUMERIC, Kms NUMERIC, Paid_Kms NUMERIC, Unpaid_kms NUMERIC, Eftpos_Total NUMERIC, Eftpos_LFee NUMERIC, Dockets NUMERIC, Charge_Authority NUMERIC, Manual_MPTP_Total NUMERIC, No_of_Manual_Lifts NUMERIC, Total_Lifting_Fee_Value NUMERIC, Misc NUMERIC, Acc_Fuel NUMERIC, Net_Payin NUMERIC, manual_lifting_fee_value NUMERIC, no_wheelchair_lifts NUMERIC, company_portion_lifting_fee NUMERIC, driver_portion_lifting_fee NUMERIC, Gov_Sub_Manual NUMERIC, Gov_Sub_Manual31 NUMERIC, CPK NUMERIC, Deductions NUMERIC)',
              [],
            );
          }
        },
      );
    });
  }, []);

  let [userData, setuserData] = useState({});
  const [total, setTotal] = useState([]);
  const [liftingtable, setLiftingtable] = useState([]);
  const [deducttable, setDeducttable] = useState([]);

  let Total = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT Date as Date, SUM(Jobs) as Jobs, SUM(Ins) as Ins, SUM(Shift_Total) as Shift_Total, SUM(Com_GTN) as Com_GTN, SUM(Kms) as Kms, SUM(Paid_Kms) as Paid_Kms, SUM(Eftpos_Total) as Eftpos_Total, SUM(Eftpos_LFee) as Eftpos_LFee, SUM(Dockets) as Dockets, SUM(Charge_Authority) as Charge_Authority, SUM(Manual_MPTP_Total) as Manual_MPTP_Total, SUM(No_of_Manual_Lifts) as No_of_Manual_Lifts, SUM(Total_Lifting_Fee_Value) as Total_Lifting_Fee_Value, SUM(Misc) as Misc, SUM(Acc_Fuel) as Acc_Fuel, SUM(Net_Payin) as Net_Payin, SUM(manual_lifting_fee_value) as manual_lifting_fee_value, SUM(no_wheelchair_lifts) as no_wheelchair_lifts, SUM(company_portion_lifting_fee) as company_portion_lifting_fee, SUM(driver_portion_lifting_fee) as driver_portion_lifting_fee, SUM(Deductions) as Deductions, SUM(Gov_Sub_Manual31) as Gov_Sub_Manual31, AVG(CPK) as CPK FROM displaytable',
        [],
        (_tx, results) => {
          var len = results.rows.length;
          if (len >= 0) {
            setuserData(results.rows.item(0));
            tx.executeSql('Delete from totaltable', []);
            tx.executeSql(
              'INSERT INTO totaltable (Jobs, Ins, Shift_Total, Com_GTN, Kms, Paid_Kms, Eftpos_Total, Eftpos_LFee, Dockets, Charge_Authority, Manual_MPTP_Total, No_of_Manual_Lifts,Total_Lifting_Fee_Value, Misc, Acc_Fuel, Net_Payin, manual_lifting_fee_value, no_wheelchair_lifts, company_portion_lifting_fee, driver_portion_lifting_fee, Deductions, Gov_Sub_Manual31, CPK) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
              [
                userData.Jobs,
                userData.Ins,
                userData.Shift_Total,
                userData.Com_GTN,
                userData.Kms,
                userData.Paid_Kms,
                userData.Eftpos_Total,
                userData.Eftpos_LFee,
                userData.Dockets,
                userData.Charge_Authority,
                userData.Manual_MPTP_Total,
                userData.No_of_Manual_Lifts,
                userData.Total_Lifting_Fee_Value,
                userData.Misc,
                userData.Acc_Fuel,
                userData.Net_Payin,
                userData.Gov_Sub_Manual31,
                userData.no_wheelchair_lifts,
                userData.company_portion_lifting_fee,
                userData.driver_portion_lifting_fee,
                userData.Deductions,
                userData.Gov_Sub_Manual31,
                userData.CPK,
              ],
              (_tx, results) => {
                console.log('insert into totaltable', results.rowsAffected);
                tx.executeSql(
                  'SELECT Date,Day,Jobs,Ins,Shift_Total,Com_GTN,Kms,Paid_Kms,Eftpos_Total,Eftpos_LFee,Dockets,Charge_Authority,Manual_MPTP_Total,No_of_Manual_Lifts,Misc,Acc_Fuel,Net_Payin,CPK FROM totaltable',
                  [],
                  (tx, results) => {
                    const temp = [];
                    temp.push(results.rows.item(0));
                    setTotal(temp);
                    Lifting();
                    Deduction();
                  },
                );
              },
            );
          } else {
            Alert.alert('No data found');
            setuserData('');
          }
        },
      );
    });
  };
  let Lifting = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT Total_Lifting_Fee_Value, No_of_Manual_Lifts, manual_lifting_fee_value, no_wheelchair_lifts, Eftpos_LFee, company_portion_lifting_fee, driver_portion_lifting_fee FROM totaltable',
        [],
        (tx, results) => {
          const temp = [];
          temp.push(results.rows.item(0));
          setLiftingtable(temp);
        },
      );
    });
  };
  let Deduction = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT Eftpos_Total, Manual_MPTP_Total, Gov_Sub_Manual, Dockets, Charge_Authority, Misc, Deductions FROM totaltable',
        [],
        (tx, results) => {
          const temp = [];
          temp.push(results.rows.item(0));
          setDeducttable(temp);
        },
      );
    });
  };
  const datatotal = total.map(record => [
    'Total',
    '',
    '',
    '',
    Number(userData.Jobs).toFixed(0),
    Number(userData.Ins).toFixed(2),
    Number(userData.Shift_Total).toFixed(2),
    Number(userData.Com_GTN).toFixed(2),
    Number(userData.Kms).toFixed(2),
    Number(userData.Paid_Kms).toFixed(2),
    Number(userData.Eftpos_Total).toFixed(2),
    Number(userData.Eftpos_LFee).toFixed(2),
    Number(userData.Dockets).toFixed(2),
    Number(userData.Charge_Authority).toFixed(2),
    Number(userData.Manual_MPTP_Total).toFixed(2),
    Number(userData.No_of_Manual_Lifts).toFixed(0),
    Number(userData.Misc).toFixed(2),
    Number(userData.Acc_Fuel).toFixed(2),
    Number(userData.Net_Payin).toFixed(2),
    // Number(userData.CPK).toFixed(2),
  ]);

  const liftingdata = liftingtable.map(record => [
    Number(userData.Total_Lifting_Fee_Value).toFixed(2),
    Number(userData.no_wheelchair_lifts).toFixed(0),
    Number(userData.No_of_Manual_Lifts).toFixed(0),
    // Number(userData.manual_lifting_fee_value).toFixed(2),
    Number(userData.Gov_Sub_Manual31).toFixed(2),
    Number(userData.Eftpos_LFee).toFixed(2),
    Number(userData.company_portion_lifting_fee).toFixed(2),
    Number(userData.driver_portion_lifting_fee).toFixed(2),
  ]);

  const Deductdata = deducttable.map(record => [
    Number(userData.Eftpos_Total).toFixed(2),
    Number(userData.Manual_MPTP_Total).toFixed(2),
    Number(userData.Gov_Sub_Manual31).toFixed(2),
    Number(userData.Dockets).toFixed(2),
    Number(userData.Charge_Authority).toFixed(2),
    Number(userData.Misc).toFixed(2),
    Number(userData.Deductions).toFixed(2),
    Number(userData.Net_Payin).toFixed(2),
  ]);

  let printHTML = async () => {
    try {
      var td = '';
      tableData.forEach(le => {
        console.log('le', le);
        td += `<th>${le[1]}</th>
              <tr>
                <td>${le[0]}</td>
                <td>${le[2]}</td>
                <td>${le[3]}</td>
                <td>${le[4]}</td>
                <td>${le[5]}</td>
                <td>$${le[6]}</td>
                <td>$${le[7]}</td>
                <td>${le[8]}</td>
                <td>${le[9]}</td>
                <td>$${le[10]}</td>
                <td>$${le[11]}</td>
                <td>$${le[12]}</td>
                <td>$${le[13]}</td>
                <td>$${le[14]}</td>
                <td>${le[15]}</td>
                <td>$${le[16]}</td>
                <td>$${le[17]}</td>
                <td><span>&#36;</span>${le[18]}</td>                  
                <td>${le[19]}</td>                  
                </tr>
                `;
      });
      var td1 = '';
      tableNameData.forEach(le => {
        td1 = `<tr>
                <td style = "width:5%">Name:</td>
                <td style = "width:20%">${le[0]}</td>
                <td style = "width:23%">Week Ending Date:</td>
                <td style = "width:20%"> ${le[1]} </td>
                <td style = "width:18%">Report making date:</td>
                <td style = "width:19%"> ${le[2]} </td>
              </tr>`;
      });
      var total = '';
      datatotal.forEach(le => {
        console.log('le', le);
        total += `
              <tr>
                <td style = "font-weight:900">${le[0]}</td>
                <td style = "font-weight:900">${le[2]}</td>
                <td style = "font-weight:900">${le[3]}</td>
                <td style = "font-weight:900">${le[4]}</td>
                <td style = "font-weight:900">$${le[5]}</td>
                <td style = "font-weight:900">$${le[6]}</td>
                <td style = "font-weight:900">$${le[7]}</td>
                <td style = "font-weight:900">${le[8]}</td>
                <td style = "font-weight:900">${le[9]}</td>
                <td style = "font-weight:900">$${le[10]}</td>
                <td style = "font-weight:900">$${le[11]}</td>
                <td style = "font-weight:900">$${le[12]}</td>
                <td style = "font-weight:900">$${le[13]}</td>
                <td style = "font-weight:900">$${le[14]}</td>               
                <td style = "font-weight:900">${le[15]}</td>
                <td style = "font-weight:900">$${le[16]}</td>
                <td style = "font-weight:900">$${le[17]}</td>                  
                <td style = "font-weight:900">$${le[18]}</td>                 
                </tr>`;
      });
      var lifting = '';
      liftingdata.forEach(le => {
        console.log('le', le);
        lifting += `<th>.</th>
              <tr>
                <td>$${le[0]}</td>                
                <td>${le[1]}</td>
                <td>${le[2]}</td>
                <td>$${le[3]}</td>                
                <td>$${le[4]}</td>
                <td>$${le[5]}</td>
                <td>$${le[6]}</td>
                </tr>`;
      });
      var deducting = '';
      Deductdata.forEach(le => {
        deducting += `<th>.</th>
              <tr>
                <td>$${le[0]}</td>
                <td>$${le[1]}</td>
                <td>$${le[2]}</td>
                <td>$${le[3]}</td>
                <td>$${le[4]}</td>
                <td>$${le[5]}</td>
                <td>$${le[6]}</td>
                <td>$${le[7]}</td>  
                </tr>`;
      });
      await RNPrint.print({
        isLandscape: true,
        html: `
            <!DOCTYPE html>
                <html>
                    <head>
                      <style>
                      html {
                        position: relative;
                        min-height: 100%;
                      }
                      table{                       
                        border: 0px solid black;
                        border-collapse: collapse;
                        font-weight: 600;
                        margin-bottom:15px;                        
                      }
                      th{
                        text-align: center;
                        margin-bottom:15px;
                        }
                      td {
                        text-align: center;
                      }
                      #td {
                        font-size: 12px;
                        margin-top: 15px;
                        margin-bottom: 15px;
                        font-weight:900px;
                      }
                      #th {
                        font-size: 10px;
                        margin: 10px;
                       }
                       #dataheading {
                        font-size: 10px;
                        margin-top: 10px;
                        margin-bottom: 10px;
                        margin-left: 5px;
                        margin-right: 5px;
                       }
                      #copyright {
                          font-size: 10px;
                          position: absolute;
                          bottom:0;
                        }
                      </style>                   
                    </head>
            <body>     
              <table id="td" style = "width:100%">
                ${td1}
              </table>         
                      <hr>
              <table id="dataheading" style = "width:100%">
                <tr>
                <th> Date </th>
                <th> Shift </th>
                <th> Taxi </th>
                <th> Jobs </th>
                <th> Ins </th>
                <th> Shift <br> Total </th>
                <th> Com <br> Company </th>
                <th> Kms </th>
                <th> Paid <br> Kms </th>
                <th> Eftpos <br> Total </th>
                <th> Eftpos <br> Lfting-Fee </th>
                <th> Dockets </th>
                <th> Charge <br> Authority </th>
                <th> Manual-Mptp <br> Total </th>
                <th> No-of-Manual <br> Lifts </th>
                <th> Misc </th>
                <th> Acc <br> Fuel </th>
                <th> Net-Payin </th>
                <th> Cpk </th>
                </tr>    
                ${td}            
                <th>-----------</th>
                ${total}
              </table>
                      <hr>
              <table id="th">
                <th> Lifting Fees Totals:</th>
              </table>
            <table id="th" style = "width:100%">
              <tr>
                <th> Total Lifting Fee Value </th>
                <th> Total No. of wheelchair lifts </th>
                <th>( Total No of Manual Lifts </th>
                <th> Total Manual lifting fee value )</th>                
                <th> Total Eftpos LFee </th>
                <th> Company portion lifting fee </th>
                <th> Driver portion lifting fee </th>
              </tr>              
                ${lifting}
            </table>
                      <hr>
            <table id="th">
              <th> Shift Deductiions Totals:</th>
            </table>
              <table id="th" style = "width:100%">
                <tr>
                  <th> Total Eftpos </th>
                  <th> Gov Sub-Manual </th>
                  <th> Gov Sub-Manual31 </th>
                  <th> Dockets </th>
                  <th> Charge Authority </th>
                  <th> Misc </th>
                  <th> Deductions </th>
                  <th> Pay Ins-Cash </th>
                </tr>
                  ${deducting}
              </table>
              <footer id = "copyright">
              <p>
                Report produced by "Wage Figurer" Copyright &#169 Dee Dhillon 2021-2022
              </p>
            </footer>  
            </body>              
      </html>
         `,
      });
    } catch (err) {
      // catches errors both in fetch and response.json
      Alert.alert(err.message);
    }
  };

  const startRating = () => {
    Alert.alert(
      'Please Rate us',
      'Would you like to share your review with us? This will help and motivate us a lot.',
      [
        {
          text: 'Sure',
          onPress: () => {
            Linking.openURL(
              'https://itunes.apple.com/us/app/id1560790850',
              //'https://appx.org.au',
            );
          },
        },
        {
          text: 'Done Already!',
          onPress: () => {
            setDone(true);
            setTimeout(() => {
              setDone(false);
              if (!done) {
                setTimeout(() => {
                  printHTML();
                }, 1000);
              }
            }, 1000);
          },
        },
        {
          text: 'Remind me later!',
          onPress: () => {
            setUsingservice(true);
            setTimeout(() => {
              setUsingservice(false);
              if (!usingservice) {
                setTimeout(() => {
                  printHTML();
                }, 1000);
              }
            }, 1000);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  let [start_date, setstart_date] = useState('');
  let [start_day, setstart_day] = useState('');
  let [finish_date, setfinish_date] = useState('');
  let [finish_day, setfinish_day] = useState('');

  //Alert

  const [done, setDone] = useState(false);
  const [usingservice, setUsingservice] = useState(false);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#35363A',}}>
      <AwesomeAlert show={done} title="Done it!" message="Thank you." />
      <AwesomeAlert
        show={usingservice}
        title="Thank you for using our service."
      />

      <ScrollView verical={true}>
        <View style={styles.textinputview}>
          <Calendar
            value={start_date}
            onChange={tareek => setstart_date(tareek)}
            OnChange={tareek => setstart_day(tareek)}
          />
          <Mytextinput
            placeholder="From"
            placeholderTextColor="#ffffff"
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#ffffff',
              paddingBottom: 0,
            }}
            // onChange={(tareek) => setSearch_date(tareek)}
            value={start_date}
            editable={false}
            onSubmitEditing={() => {
              if (!start_date) {
                Alert.alert('Please input Date');
              }
            }}
          />
        </View>

        <View style={styles.textinputview}>
          <Calendar
            value={finish_date}
            onChange={tareek => setfinish_date(tareek)}
            OnChange={tareek => setfinish_day(tareek)}
          />
          <Mytextinput
            placeholder="To"
            placeholderTextColor="#ffffff"
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#ffffff',
              paddingBottom: 0,
            }}
            // onChange={(tareek) => setSearch_date(tareek)}
            value={finish_date}
            editable={false}
            onSubmitEditing={() => {
              if (!finish_date) {
                Alert.alert('Please input Date');
              } else {
              }
            }}
          />
        </View>

        <View style={{ alignItems: 'center'}}>
          <Text>YYYY/MM/DD</Text>
        </View>

        <Mybutton title="Display Data" customClick={Report} />

        <View
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
            Name: {userdata.Name}
          </Text>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
            Payin Summary for the Week Ending:
          </Text>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
            {userdata.Week_Ending_Date}
          </Text>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
            Report creating date: {new Date().toDateString()}
          </Text>

          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
                <Row
                  data={tableHead}
                  widthArr={widthArr}
                  style={styles.header}
                  textStyle={styles.text}
                />
              </Table>
              <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
                {tableData.map((rowdata, index) => (
                  <Row
                    key={index}
                    data={rowdata}
                    widthArr={widthArr}
                    style={[
                      styles.row,
                      index % 0 && {backgroundColor: 'white'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {datatotal.map((rowdata, index) => (
                  <Row
                    key={index}
                    data={rowdata}
                    widthArr={widthArr}
                    style={[
                      styles.row,
                      index % 0 && {backgroundColor: 'white'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>

              <View style={{flex: 1, alignItems: 'flex-start', marginTop: 5}}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                  Lifting Fee Totals:{' '}
                </Text>
              </View>
              <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
                <Row
                  data={tableHead1}
                  widthArr={widthArr1}
                  style={styles.header}
                  textStyle={styles.text}
                />
              </Table>
              <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
                {liftingdata.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={widthArr1}
                    style={[
                      styles.row,
                      index % 0 && {backgroundColor: 'white'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>

              <View style={{flex: 1, alignItems: 'flex-start', marginTop: 5}}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                  Shift Deductions Totals:{' '}
                </Text>
              </View>
              <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
                <Row
                  data={tableHead2}
                  widthArr={widthArr2}
                  style={styles.header}
                  textStyle={styles.text}
                />
              </Table>
              <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
                {Deductdata.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={widthArr2}
                    style={[
                      styles.row,
                      index % 0 && {backgroundColor: 'white'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <View
        style={{
          marginLeft: 60,
          marginRight: 60,
          marginBottom: 10,
          marginTop: -12,
        }}>
        <Mybutton title="Print Report" customClick={startRating} />
      </View>
    </SafeAreaView>
  );
}

