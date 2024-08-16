import {createStackNavigator} from '@react-navigation/stack';
import Home from '../components/screens/Home';
import {Routes} from './Routes';
import ProductDetail from '../components/BaseComponents/ProductDetail';
import MapScreen from '../components/screens/MapScreen';
import BottomTabNavigation from './BottomTabNavigation';
import Login from '../components/BaseComponents/Login';
import ModulesAsk from '../components/BaseComponents/ModulesAsk';
import RegisterShop from '../components/BaseComponents/RegisterShop';
import Products from '../components/screens/AccountProducts';
import AccountProducts from '../components/screens/AccountProducts';
import AddProductsByShop from '../components/BaseComponents/AddProductsByShop';
import EditMyProducts from '../components/BaseComponents/EditMyProducts';
import AddProductsByInventory from '../components/BaseComponents/AddProductsByInventory';
import RegisterVendor from '../components/BaseComponents/RegisterVendor';
import AccountVendorProducts from '../components/screens/AccountVendorProducts';
import AddProductsByVendor from '../components/BaseComponents/AddProductsByVendor';
import DrawerNavigation from './DrawerNavigation';
import UserRegistration from '../components/BaseComponents/UserRegistration';
import MyShops from '../components/BaseComponents/MyShops';
import ShopView from '../components/screens/ShopView';
import ShopAddingProducts from '../components/Shops/ShopAddingProducts';
import AddVendor from '../components/BaseComponents/AddVendor';
import MyVendorShops from '../components/Vendor/MyVendorShops';
import VendorView from '../components/Vendor/VendorView';
import PlaceSearch from '../components/BaseComponents/SearchAddress';
import Map from '../components/SearchMap/Map';
import StartMap from '../components/SearchMap/StartMap';
import PlaceSearchComponent from '../components/SearchMap/PlaceSearchComponent';
import ShopAddItem from '../components/Shops/ShopAddItem';
import InventoryItemDetail from '../components/BaseComponents/InventoryItemDetail';
import InventoryItemDetailEdit from '../components/BaseComponents/InventoryItemDetailEdit';
import EditImages from '../components/BaseComponents/EditImages';
import Shop from '../components/Shops/Shop';
import MapEnter from '../components/SearchMap/MapEnter';
import EditProfile from '../components/BaseComponents/EditProfile';
import MapView from 'react-native-maps';

const Stack = createStackNavigator();

function MainNavigation() {
  return (
    <Stack.Navigator
      initialRouteName={Routes.DrawerNavigation}
      screenOptions={{header: () => null}}>
      <Stack.Screen
        name={Routes.DrawerNavigation}
        component={DrawerNavigation}
      />

      <Stack.Screen
        name={Routes.BottomTabNavigation}
        component={BottomTabNavigation}
      />
      <Stack.Screen name={Routes.ShopView} component={ShopView} />
      <Stack.Screen name={Routes.MyShops} component={MyShops} />
      <Stack.Screen name={Routes.ProductDetail} component={ProductDetail} />
      <Stack.Screen name={Routes.MapScreen} component={MapScreen} />
      <Stack.Screen name={Routes.Login} component={Login} />
      <Stack.Screen name={Routes.ModulesAsk} component={ModulesAsk} />
      <Stack.Screen name={Routes.RegisterShop} component={RegisterShop} />
      <Stack.Screen name={Routes.AccountProducts} component={AccountProducts} />
      <Stack.Screen name={Routes.EditMyProducts} component={EditMyProducts} />
      <Stack.Screen name={Routes.AddVendor} component={AddVendor} />
      <Stack.Screen name={Routes.MyVendorShops} component={MyVendorShops} />
      <Stack.Screen name={Routes.VendorView} component={VendorView} />
      <Stack.Screen name={Routes.PlaceSearch} component={PlaceSearch} />
      <Stack.Screen name={Routes.Map} component={Map} />
      <Stack.Screen name={Routes.StartMap} component={StartMap} />
      <Stack.Screen name={Routes.ShopAddItem} component={ShopAddItem} />
      <Stack.Screen name={Routes.EditImages} component={EditImages} />
      <Stack.Screen name={Routes.Shop} component={Shop} />
      <Stack.Screen
        name={Routes.InventoryItemDetailEdit}
        component={InventoryItemDetailEdit}
      />
      <Stack.Screen
        name={Routes.InventoryItemDetail}
        component={InventoryItemDetail}
      />
      <Stack.Screen
        name={Routes.ShopAddingProducts}
        component={ShopAddingProducts}
      />
      <Stack.Screen
        name={Routes.UserRegistration}
        component={UserRegistration}
      />
      <Stack.Screen
        name={Routes.AddProductsByInventory}
        component={AddProductsByInventory}
      />
      <Stack.Screen
        name={Routes.AddProductsByShop}
        component={AddProductsByShop}
      />
      <Stack.Screen name={Routes.RegisterVendor} component={RegisterVendor} />
      <Stack.Screen
        name={Routes.AccountVendorProducts}
        component={AccountVendorProducts}
      />
      <Stack.Screen
        name={Routes.AddProductsByVendor}
        component={AddProductsByVendor}
      />
      <Stack.Screen
        name={Routes.PlaceSearchComponent}
        component={PlaceSearchComponent}
      />
      <Stack.Screen name={Routes.MapEnter} component={MapEnter} />
      <Stack.Screen name={Routes.EditProfile} component={EditProfile} />
      <Stack.Screen name={Routes.MapView} component={MapView} />
    </Stack.Navigator>
  );
}
export default MainNavigation;
