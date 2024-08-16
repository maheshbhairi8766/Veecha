import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {color} from 'react-native-elements/dist/helpers';
import {Routes} from './Routes';
import {supabase} from '../createClinet';
import {useNavigation} from '@react-navigation/native';
import {DummyImage} from '../components/BaseComponents/CardView';
import {
  ArrowRightStartOnRectangleIcon,
  PencilSquareIcon,
} from 'react-native-heroicons/solid';
import MyItems from '../components/Shops/MyItems';
import ShopAddItem from '../components/Shops/ShopAddItem';
import WatchListShop from '../components/WatchList/WatchListShop';
const TabBar = createMaterialTopTabNavigator();

var {width, height} = Dimensions.get('window');

export default function ShopTabBar(props) {
  //console.log('Shop Data :', props.item);
  const [shopItem, setShopItem] = useState([]);
  const [inventoryItem, setInventoyItem] = useState([]);
  const navigation = useNavigation();
  const fetchItemData = async () => {
    const {data: inventoryData, error: inventoryError} = await supabase
      .from('items_inventory')
      .select('*')
      .eq('shop_id', props.item.id);

    setInventoyItem(inventoryData);
    console.log('Inventory Items :', inventoryItem);
    if (inventoryError) {
      console.error(
        'Error fetching items from items_inventory:',
        inventoryError,
      );
      return;
    }

    if (inventoryData && inventoryData.length > 0) {
      const shopItemsPromises = inventoryData.map(async inventoryItem => {
        const {data: shopData, error: shopError} = await supabase
          .from('shop_items')
          .select('*')
          .eq('inventory_id', inventoryItem.id);

        if (shopError) {
          console.error(
            `Error fetching shop items for inventory ID ${inventoryItem.id}:`,
            shopError,
          );
          return null;
        }

        return shopData;
      });

      const shopItemsResults = await Promise.all(shopItemsPromises);
      //console.log('Shop Items :', shopItemsResults.flat());
      setShopItem(shopItemsResults.flat());
      //console.log('Shop Items :', shopItem);
    } else {
      console.log('No items found in items_inventory for this shop.');
    }
  };

  const Tab1 = () => {
    return (
      <View>
        <MyItems item={props.item} />
      </View>
    );
  };
  const Tab2 = () => {
    return (
      <View>
        <ShopAddItem item={props.item} />
      </View>
    );
  };
  const Tab3 = () => {
    return (
      <View>
        <WatchListShop item={props.item} />
      </View>
    );
  };
  const Tab4 = () => {
    return (
      <View>
        <Text>This is Tab4</Text>
      </View>
    );
  };

  useEffect(() => {
    //fetchItemData();
  }, []);
  return (
    <View style={{marginTop: 12}}>
      <TabBar.Navigator
        screenOptions={{
          tabBarStyle: {backgroundColor: '#f44336'}, // Set the background color here
          tabBarIndicatorStyle: {backgroundColor: 'white'}, // Customize the indicator style
          tabBarActiveTintColor: 'white', // Color of the active tab label
          tabBarInactiveTintColor: 'gray', // Color of the inactive tab label
        }}
        initialRouteName="Tab1">
        <TabBar.Screen name={'My Items'} component={Tab1} />
        <TabBar.Screen name={'Add Item'} component={Tab2} />
        <TabBar.Screen name={'WatchList'} component={Tab3} />
        <TabBar.Screen name={'Tab4'} component={Tab4} />
      </TabBar.Navigator>
    </View>
  );
}
