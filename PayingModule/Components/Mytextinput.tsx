/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
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
}

const MyTextInput: FC<MyTextInputProps> = props => {
  return (
    <View
      style={{
        marginLeft: 35,
        marginRight: 35,
        marginTop: 10,
      }}>
      <TextInput
        underlineColorAndroid="transparent"
        placeholder={props.placeholder}
        placeholderTextColor="#007FFF"
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        returnKeyType={props.returnKeyType}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        onSubmitEditing={props.onSubmitEditing}
        style={props.style}
        blurOnSubmit={false}
        value={props.value}
      />
    </View>
  );
};

export default MyTextInput;
