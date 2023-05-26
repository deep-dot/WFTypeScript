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
  const Ref = useRef();

  const onSubmitEditing = () => {
    if (Ref.current) {
    console.log('ref mytext input===', Ref.current?.focus());
    }
    if (!isNaN(Number(value))) {
      nextInputRef.current?.focus();
    } else {
      Alert.alert('Please input a correct number');
      onChangeText(''); // clear the input
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
        ref={Ref}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

export default MyTextInput;
