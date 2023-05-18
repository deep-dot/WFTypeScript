import React, {FC} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface MyButtonProps {
  customClick: () => void;
  title: string;
}

const MyButton: FC<MyButtonProps> = ({customClick, title}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={customClick}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default MyButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#434343',
    borderRadius: 10,
    elevation: 10,
    padding: 5,
    marginTop: 20,
    margin: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
