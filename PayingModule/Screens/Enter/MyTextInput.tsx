import React, {useRef} from 'react';
import {Alert, TextInput, Text, View} from 'react-native';
import styles from './EnterDataScreen.style';

type MyTextInputProps = {
  title: string;
  value: string;
  onChangeText: (value: string) => void;
  nextInputRef: React.RefObject<TextInput>;
};

const MyTextInput = ({
  title,
  value,
  onChangeText,
  nextInputRef,
}: MyTextInputProps) => {
  const inputRef = useRef();

  const onSubmitEditing = () => {
    if (!isNaN(Number(value))) {
      nextInputRef.current?.focus();
    } else {
      Alert.alert('Please input a correct number');
      onChangeText(''); // clear the input
    }
  };

  return (
    <View style={styles.textinputview}>
      <Text style={styles.titleText}>{title}</Text>
      <TextInput
        placeholder="0.0"
        placeholderTextColor="#ffffff"
        style={styles.textInput}
        returnKeyType="next"
        keyboardType="numeric"
        onChangeText={onChangeText}
        value={value}
        ref={inputRef}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

export default MyTextInput;
