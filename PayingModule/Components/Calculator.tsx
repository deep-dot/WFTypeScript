/* eslint-disable curly */
/* eslint-disable no-eval */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

interface Props {
  loading?: boolean;
  Transparency?: any;
  calculatorVisible: boolean;
  CAcalcu: (value: any) => void;
  Docketcalcu: (value: any) => void;
  Cancelcalcu: () => void;
}

const Calculator: React.FC<Props> = props => {
  const {calculatorVisible} = props;
  const [resultText, setresultText] = useState('');
  const [calculationText, setcalculationText] = useState('');
  const operations = ['<', '+', '-', '*', '/'];

  const calculator = () => {
    try {
      if (resultText === '') {
        setcalculationText('');
      } else {
        setcalculationText(eval(resultText));
      }
    } catch (e) {
      Alert.alert('Entered wrong number');
    }
  };
  const validate = () => {
    switch (resultText.slice(-1)) {
      case '+':
      case '-':
      case '*':
      case '/':
        return false;
    }
    return true;
  };

  const _onPress = (text: string | number) => {
    if (text === '=') {
      return validate() && calculator();
    }
    setresultText(resultText + text);
  };

  const operate = (operation: string) => {
    switch (operation) {
      case '<':
        let text = resultText.split('');
        text.pop();
        setresultText(text.join(''));
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        const lastChar = resultText.split('').pop();
        if (operations.indexOf(lastChar as string) > 0) return;
        if (resultText === '') return;
        setresultText(resultText + operation);
    }
  };

  let rows = [];
  let nums = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['.', 0, '='],
  ];

  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      row.push(
        <TouchableOpacity
          key={nums[i][j]}
          style={styles.btn}
          onPress={() => _onPress(nums[i][j])}>
          <Text style={styles.btnText}>{nums[i][j]}</Text>
        </TouchableOpacity>,
      );
    }
    rows.push(
      <View key={i} style={styles.row}>
        {row}
      </View>,
    );
  }

  let ops = [];
  for (let i = 0; i < 5; i++) {
    ops.push(
      <TouchableOpacity
        key={operations[i]}
        style={styles.btnOperations}
        onPress={() => operate(operations[i])}>
        <Text style={[styles.btnTextOperations]}>{operations[i]}</Text>
      </TouchableOpacity>,
    );
  }
  const clearData = () => {
    setresultText('');
    setcalculationText('0.00');
  };

  const Authoritycalculator = () => {
    props.CAcalcu(calculationText);
  };

  const CCcalculator = () => {
    props.Docketcalcu(calculationText);
  };

  const Cancelcalculator = () => {
    props.Cancelcalcu();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#54cb77'}}>
      <Modal
        // transparent={true}
        // presentationStyle={'pageSheet'}
        visible={calculatorVisible}
        animationType={'fade'}
        onRequestClose={() => {}}>
        <ScrollView>
          <View style={styles.model}>
            <View style={styles.result}>
              <ScrollView>
                <Text style={styles.resultText}>{resultText}</Text>
              </ScrollView>
            </View>
            <View style={styles.calculation}>
              <TouchableHighlight
                onPress={clearData}
                style={{
                  marginLeft: 10,
                  width: 100,
                  height: 60,
                  backgroundColor: '#35363A',
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#55a8fa',
                    fontWeight: 'bold',
                  }}>
                  {' '}
                  {calculationText}{' '}
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={clearData}
                style={{
                  marginRight: 10,
                  width: 60,
                  height: 60,
                  backgroundColor: '#35363A',
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 25,
                    color: '#54cb77',
                    fontWeight: 'bold',
                  }}>
                  {' '}
                  C{' '}
                </Text>
              </TouchableHighlight>
            </View>
            <View
              style={{
                flex: 7,
                marginTop: 15,
                flexDirection: 'row',
              }}>
              <View style={styles.numbers}>{rows}</View>
              <View style={styles.operations}>{ops}</View>
            </View>

            <TouchableHighlight
              style={styles.button}
              onPress={Authoritycalculator}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 12,
                }}>
                Charge Authority Calculation{' '}
              </Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.button} onPress={CCcalculator}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 12,
                }}>
                Dockets Calculation
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                padding: 5,
                margin: 5,
                marginBottom: 15,
                width: 100,
                backgroundColor: '#35363A',
                borderRadius: 10,
                elevation: 5,
                alignItems: 'center',
                alignSelf: 'center',
              }}
              onPress={Cancelcalculator}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 12,
                }}>
                Cancel
              </Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};

export default Calculator;

const styles = StyleSheet.create({
  model: {
    marginTop: 20,
    margin: 10,
    height: 600,
    // backgroundColor: '#d5d5d3',
    backgroundColor: '#555555',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 13,
  },
  //Calculator
  button: {
    padding: 8,
    margin: 10,
    backgroundColor: '#35363A',
    width: 230,
    borderRadius: 10,
    elevation: 5,
    alignSelf: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  resultText: {
    fontSize: 20,
    marginBottom: 5,
    color: '#ffffff',
  },
  btnText: {
    fontSize: 25,
    color: '#ffffff',
  },
  btnTextOperations: {
    fontSize: 25,
    color: '#54cb77',
  },
  btn: {
    flex: 1,
    margin: 5,
    backgroundColor: '#35363A',
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  btnOperations: {
    //flex: 1,
    margin: 10,
    backgroundColor: '#35363A',
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
  },
  result: {
    flex: 2,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 10,
  },
  calculation: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    alignItems: 'center',
  },
  calculationText: {
    fontSize: 15,
    margin: 5,
    color: '#ffffff',
  },
  numbers: {
    flex: 3,
    padding: 4,
  },
  operations: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
