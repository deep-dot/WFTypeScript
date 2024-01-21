/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {View, Image} from 'react-native';

const Logo = () => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Image
        source={require('../Images/WFLogo.png')}
        style={{
          width: 40,
          height: 40,
          borderRadius: 40 / 2,
          marginRight: 15,
        }}
      />
    </View>
  );
};

export default Logo;
