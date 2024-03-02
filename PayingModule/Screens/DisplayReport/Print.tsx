import {Linking, Alert} from 'react-native';
import RNPrint from 'react-native-print';
import {appData} from '../Components/EnterDataValues';
import {Action} from '../../Utilities/Actions';

export const starRating = (
  state: appData,
  dispatch: React.Dispatch<Action>,
) => {
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
          dispatch({type: 'UPDATE', payload: {done: true}});
          setTimeout(() => {
            dispatch({type: 'UPDATE', payload: {done: false}});
            if (!state.done) {
              setTimeout(() => {
                printHTML(state);
              }, 1000);
            }
          }, 1000);
        },
      },
      {
        text: 'Remind me later!',
        onPress: () => {
          dispatch({type: 'UPDATE', payload: {usingservice: true}});
          setTimeout(() => {
            dispatch({type: 'UPDATE', payload: {usingservice: false}});
            if (!state.usingservice) {
              setTimeout(() => {
                printHTML(state);
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

let printHTML = async (state: appData) => {
  console.log('in printhtml==', state.liftingdata);
  try {
    var td = '';
    state.tabledata.forEach(le => {
      // console.log('le', le);
      const currencyIndices = new Set([6, 7, 10, 11, 12, 13, 14, 16, 17, 18]);
      td += Object.values(le)
        .map((entry, index) => {
          const formattedEntry = currencyIndices.has(index)
            ? `$${entry}`
            : entry;
          return index === 1
            ? `<th>${formattedEntry}</th>`
            : `<td>${formattedEntry}</td>`;
        })
        .join('\n');
      td += '</tr>\n';
    });
    let td1 = `<tr>
                <td>Name:</td>
                <td>${state.Name}</td>
                <td>Week Ending Date:</td>
                <td> ${state.Week_Ending_Date} </td>
                <td>Report making date:</td>
                <td> ${state.Week_Ending_Day} </td>
              </tr>`;
    let total = '';
    let le = state.datatotal;
    total += `
        <tr> 27
            <td style = "font-weight:900">${le[0]}</td>
            <td style = "font-weight:900">${le[2]}</td>
            <td style = "font-weight:900">${le[3]}</td>
            <td style = "font-weight:900">${le[4]}</td>
            <td style = "font-weight:900">${le[5]}</td>
            <td style = "font-weight:900">$${le[6]}</td>
            <td style = "font-weight:900">${le[7]}</td>
            <td style = "font-weight:900">${le[8]}</td>
            <td style = "font-weight:900">${le[9]}</td>
            <td style = "font-weight:900">$${le[10]}</td>
            <td style = "font-weight:900">${le[11]}</td>
            <td style = "font-weight:900">${le[12]}</td>
            <td style = "font-weight:900">${le[13]}</td>
            <td style = "font-weight:900">${le[14]}</td>
            <td style = "font-weight:900">${le[15]}</td>
            <td style = "font-weight:900">${le[16]}</td>
            <td style = "font-weight:900">$${le[17]}</td>
            <td style = "font-weight:900">${le[18]}</td>
            <td style = "font-weight:900">$${le[19]}</td>
            <td style = "font-weight:900">$${le[18]}</td>
            <td style = "font-weight:900">$${le[18]}</td>
            <td style = "font-weight:900">$${le[18]}</td>
            <td style = "font-weight:900">$${le[18]}</td>
            <td style = "font-weight:900">$${le[18]}</td>
            <td style = "font-weight:900">${le[18]}</td>
            <td style = "font-weight:900">$${le[18]}</td>
        </tr>`;
    let lifting = `<tr>
                    <td>${state.Gov_Lifting_Fee}</td> 
                    <td>$${state.Number_Of_Chairs}</td>
                    <td>$${state.Driver_Share_In_LiftingFee}</td>
                  </tr>`;
    let deducting = `<th>.</th>
              <tr>
              <td>${state.Deductions}</td> 
              <td>$${state.Net_Payin}</td>
                </tr>`;
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
                <th> Day </th>
                <th> Shift </th>
                <th> Taxi </th>
                <th> Jobs </th>
                <th> Ins </th>
                <th> Hours Worked </th>
                <th> Shift <br> Total </th>
                <th> Kms </th>
                <th> Paid <br> Kms </th>
                <th> Eftpos <br> Total </th>
                <th> Manuals </th>
                <th> Manuals $ </th>
                <th> Dockets </th>
                <th> Electronic <br> Payments </th>
                <th> Car Wash </th>
                <th> Misc </th>
                <th> Fuel </th>
                <th> Cpk </th>
                <th> Net-Payin </th>                
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
                <th> Total Lifting Fee </th>                             
                <th> Total Liftings </th>
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
                  <th> Deductions </th>
                  <th> Pay Ins-Cash </th>
                </tr>
                  ${deducting}
              </table>
              <footer id = "copyright">
              <p>
                Report produced by "Wage Figurer" Copyright &#169 Dee Dhillon 2021-2023
              </p>
            </footer>  
            </body>              
      </html>
         `,
    });
  } catch (err: any) {
    Alert.alert(err.message);
  }
};
