/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {StateContext} from './Context';
import {
  useTheme,
  Title,
  Caption,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {ThemeContext} from './ThemeProvider';
import Icon from 'react-native-vector-icons/Ionicons';

const DrawerContent = (props: DrawerContentComponentProps) => {
  const paperTheme = useTheme();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {toggleTheme} = themeContext;

  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title style={styles.title} />
                <Caption style={styles.caption}>@d_dee</Caption>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.section}>
                {/* <Paragraph style={[styles.paragraph, styles.caption]} /> */}
                <Caption style={styles.caption}>Jobs done</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              label="Payin App"
              icon={({color, size}) => (
                <Icon name="enter-outline" color={color} size={size} />
              )}
              onPress={() => {
                props.navigation.navigate('Enter Data');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="create-outline" color={color} size={size} />
              )}
              label="Edit Week Ending Date"
              onPress={() => {
                dispatch({
                  type: 'UPDATE',
                  payload: {
                    modalVisible: !state.modalVisible,
                  },
                });
              }}
            />
            {/* <DrawerItem
              label="View"
              onPress={() => {
                props.navigation.navigate('View Records');
              }}
            /> */}
          </Drawer.Section>
          <Drawer.Section title="">
            <TouchableRipple
              onPress={() => {
                toggleTheme();
              }}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={paperTheme.dark} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};
export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 26,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
