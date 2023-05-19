/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import MyButton from '../../Components/Mybutton';
import {useNavigation} from '@react-navigation/native';

type NavigationButtonsProps = {
  changeweekendingdate: () => void;
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  changeweekendingdate,
}) => {
  const navigation = useNavigation();
  return (
    <ScrollView style={{marginEnd: 20, marginStart: 20, marginTop: 10}}>
      <Image
        style={{width: 100, height: 100, alignSelf: 'center'}}
        source={require('../../Components/Images/WFLogo.png')}
      />
      <MyButton
        title="Add"
        customClick={() => navigation.navigate('Enter Data')}
      />
      <MyButton
        title="Update"
        customClick={() => navigation.navigate('Update')}
      />
      <MyButton
        title="View"
        customClick={() => navigation.navigate('ViewRecords')}
      />
      <MyButton
        title="Delete"
        customClick={() => navigation.navigate('Delete')}
      />
      <MyButton
        title="Create Report"
        customClick={() => navigation.navigate('DisplayReport')}
      />
      <MyButton title="Update W E D" customClick={changeweekendingdate} />
      <MyButton
        title="Youtube Link"
        customClick={() => Linking.openURL('https://youtu.be/ZlgtKUnXd-w')}
      />
    </ScrollView>
  );
};

export default NavigationButtons;
