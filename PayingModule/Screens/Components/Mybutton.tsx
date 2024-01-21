import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface Props {
  customClick: () => void;
  title: string;
}

const MyButton = ({customClick, title}: Props) => {
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
