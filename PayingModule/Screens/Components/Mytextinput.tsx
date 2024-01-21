/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TextInput,
  StyleProp,
  ViewStyle,
  TextInputProps,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from 'react-native';

interface MyTextInputProps extends TextInputProps {
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  numberOfLines?: number;
  multiline?: boolean;
  onSubmitEditing?: () => void;
  style?: StyleProp<ViewStyle>;
  value?: string;
  color?: string;
}

const MyTextInput = ({
  placeholder,
  keyboardType,
  returnKeyType,
  numberOfLines,
  multiline,
  onSubmitEditing,
  style,
  value,
  color,
}: MyTextInputProps) => {
  return (
    <View
      style={{
        marginLeft: 35,
        marginRight: 35,
        marginTop: 10,
      }}>
      <TextInput
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        placeholderTextColor="#007FFF"
        keyboardType={keyboardType}
        // onChangeText={onChangeText}
        returnKeyType={returnKeyType}
        numberOfLines={numberOfLines}
        multiline={multiline}
        onSubmitEditing={onSubmitEditing}
        style={{ style, color: color }}
        blurOnSubmit={false}
        value={value}
      />
    </View>
  );
};

export default MyTextInput;
