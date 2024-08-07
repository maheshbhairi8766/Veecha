import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Routes} from './Routes';
import BottomTabNavigation from './BottomTabNavigation';
import DrawerProfile from '../components/BaseComponents/DrawerProfile';
import CustomDrawerContent from '../components/BaseComponents/CustomDrawerContent';
import AddShop from '../components/BaseComponents/AddShop';
import AddVendor from '../components/BaseComponents/AddVendor';
export default function DrawerNavigation() {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{header: () => null}}>
      <Drawer.Screen
        name={Routes.BottomTabNavigation}
        component={BottomTabNavigation}
      />
      <Drawer.Screen name={Routes.AddShop} component={AddShop} />
      <Drawer.Screen name={Routes.AddVendor} component={AddVendor} />
    </Drawer.Navigator>
  );
}
