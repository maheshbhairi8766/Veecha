import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../components/screens/Home';
import {Routes} from './Routes';
import {
  HeartIcon,
  HomeIcon,
  HomeModernIcon,
  IdentificationIcon,
  UserCircleIcon,
} from 'react-native-heroicons/solid';
import Inventory from '../components/screens/Inventory';
import Account from '../components/screens/Account';
import WatchList from '../components/screens/WatchList';
import Profile from '../components/screens/Profile';
import {useContext, useEffect, useState} from 'react';
import ShopContext from '../context/ShopContext';
import {supabase} from '../createClinet';

const Tab = createBottomTabNavigator();

function BottomTabNavigation() {
  const [shopPresent, setShopPresent] = useState(true);
  const {shopId} = useContext(ShopContext);
  const {vendorId} = useContext(ShopContext);
  const {userId} = useContext(ShopContext);
  const [shopOrVendor, setShopOrVendor] = useState(false);
  //console.log('Bottam Tab : ', userId.id_user);

  {
    async function CheckUser() {
      // Fetching shops
      const {data, error} = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', userId.id_user);

      if (error) {
        //console.error('Error fetching shops:', error);
      } else if (data && data.length > 0) {
        //console.log('Shops data:', data);
        console.log('True shop');
        setShopOrVendor(true);
      } else {
        console.log('No shops found for user:', userId.id_user);
      }

      // Fetching supplier_locations
      const {data: Vdata, error: Verror} = await supabase
        .from('supplier_locations')
        .select('*')
        .eq('owner_id', userId.id_user);

      if (Verror) {
        //console.error('Error fetching supplier_locations:', Verror);
      } else if (Vdata && Vdata.length > 0) {
        //console.log('Supplier locations data:', Vdata);
        console.log('True vendor');
        setShopOrVendor(true);
      } else {
        console.log('No supplier locations found for user:', userId.id_user);
      }

      //console.log('shopOrVendor:', shopOrVendor);
    }

    useEffect(() => {
      CheckUser();
    }, [userId]);
  }

  return (
    <Tab.Navigator screenOptions={{header: () => null}}>
      <Tab.Screen
        name={Routes.Home}
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => <HomeIcon color={color} size={20} />,
        }}
      />
      {shopOrVendor ? (
        <Tab.Screen
          name={Routes.Inventory}
          component={Inventory}
          options={{
            tabBarLabel: 'Inventory',
            tabBarIcon: ({color, size}) => (
              <HomeModernIcon color={color} size={20} />
            ),
          }}
        />
      ) : null}

      <Tab.Screen
        name={Routes.Account}
        component={Account}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({color, size}) => (
            <IdentificationIcon color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.WatchList}
        component={WatchList}
        options={{
          tabBarLabel: 'Watchlist',
          tabBarIcon: ({color, size}) => <HeartIcon color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name={Routes.Profile}
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <UserCircleIcon color={color} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default BottomTabNavigation;
