import {Linking, Alert} from 'react-native';
import RNPrint from 'react-native-print';
import {FormValues} from '../../Components/EnterDataValues';
import {Action} from '../../../Utilities/Actions';

export const starRating = (
  state: FormValues,
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
                printHTML(state, dispatch);
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
                printHTML(state, dispatch);
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

let printHTML = async (state: FormValues, dispatch: React.Dispatch<Action>) => {
  try {
    var td = '';
    state.tableData.forEach(le => {
      console.log('le', le);
      const currencyIndices = new Set([6, 7, 10, 11, 12, 13, 14, 16, 17, 18]);
      td += le
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

    var td1 = '';
    state.tableNameData.forEach(le => {
      td1 = `<tr>
                <td>Name:</td>
                <td>${le[0]}</td>
                <td>Week Ending Date:</td>
                <td> ${le[1]} </td>
                <td>Report making date:</td>
                <td> ${le[2]} </td>
              </tr>`;
    });

    let total = '';
    let le = state.datatotal;
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

    var lifting = '';
    state.liftingdata.forEach(le => {
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
    let deducting = '';
    state.Deductdata.forEach(le => {
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
