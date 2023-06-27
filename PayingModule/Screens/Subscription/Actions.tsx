import React from 'react';
import {Alert} from 'react-native';
import {Action} from '../../../Utilities/Actions';

export const validate = async (receipt, dispatch: React.Dispatch<Action>) => {
  const receiptBody = {
    productId: JSON.parse(receipt).productId,
    purchaseToken: JSON.parse(receipt).purchaseToken,
  };
  console.log('reciept body=======', receiptBody);

  try {
    await fetch(
      'https://australia-southeast1-pc-api-7263938244868821830-612.cloudfunctions.net/receipt',
      {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({data: receiptBody}),
      },
    ).then(res => {
      res.json().then(r => {
        dispatch({type: 'UPDATE', payload: {checking: false}});
        if (r.result.error == -1) {
          Alert.alert('Oops!', 'There is something wrong with your purchase');
        } else if (r.result.isActiveSubscription) {
          dispatch({type: 'UPDATE', payload: {purchased: true}});
        } else {
          dispatch({type: 'UPDATE', payload: {ShowAlert: true}});
        }
      });
    });
  } catch (error) {
    console.log('Error!', error.message);
  }
};
