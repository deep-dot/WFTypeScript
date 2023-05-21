/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import MyButton from '../../Components/Mybutton';

type NavigationButtonsProps = {
  navigation: DrawerNavigationProp<DrawerParamList, 'Enter Data'>;
  changeweekendingdate: () => void;
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  navigation,
  changeweekendingdate,
}) => {
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
        customClick={() => navigation.navigate('Update Record')}
      />
      <MyButton
        title="View"
        customClick={() => navigation.navigate('View Records')}
      />
      <MyButton
        title="Delete"
        customClick={() => navigation.navigate('Delete Record')}
      />
      <MyButton
        title="Create Report"
        customClick={() => navigation.navigate('Display Report')}
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
