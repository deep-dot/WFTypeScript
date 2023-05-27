import React, {useRef} from 'react';
import {Alert, TextInput, Text, View} from 'react-native';
import styles from './EnterDataScreen.style';

type MyTextInputProps = {
  title: string;
  value: string;
  textColor: string;
  placeholderTextColor: string;
  onChangeText: (value: string) => void;
  nextInputRef: React.RefObject<TextInput>;
};

const MyTextInput = ({
  title,
  value,
  onChangeText,
  nextInputRef,
  textColor,
  placeholderTextColor,
}: MyTextInputProps) => {
  const onSubmitEditing = () => {
    console.log(title, value);
    if (!isNaN(Number(value))) {
      nextInputRef.current?.focus();
    } else {
      Alert.alert('Please input a correct number');
      onChangeText('');
    }
  };

  return (
    <View style={styles.textinputview}>
      <Text style={[styles.titleText, {color: textColor}]}>{title}</Text>
      <TextInput
        placeholder="0.0"
        placeholderTextColor={placeholderTextColor}
        style={[styles.textInput, {color: textColor}]}
        returnKeyType="next"
        keyboardType="numeric"
        onChangeText={onChangeText}
        value={value}
        ref={nextInputRef}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

export default MyTextInput;
