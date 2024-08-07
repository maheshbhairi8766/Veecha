import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowRightStartOnRectangleIcon,
  PencilSquareIcon,
  ShareIcon,
  StarIcon,
} from 'react-native-heroicons/solid';
import {HeartIcon as HeartIconOutline} from 'react-native-heroicons/outline';
import {HeartIcon as HeartIconSolid} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import {supabase} from '../../createClinet';
import ShopContext from '../../context/ShopContext';

var {width, height} = Dimensions.get('window');

export const DummyImage =
  'https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg';

export default function ShopItemsCardView(props) {
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const [fav, setFav] = useState(false);
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  //console.log(props);

  //getting data from SupaBase
  const fetchDataProducts = async () => {
    const {data, error} = await supabase
      .from('items')
      .select('*')
      .eq('shop_id', props.data.id);

    setItems(data);
    //console.log('Fetching Products of My shop', items);
  };
  const DeleteItem = async id => {
    const response = await supabase.from('items').delete().eq('id', id);
    if (response) {
      Alert.alert('Deleted Successfully');
    } else {
      Alert.alert('Faild while deleting item');
    }
  };

  useEffect(() => {
    fetchDataProducts();
  }, [items]);

  return (
    <SafeAreaView>
      <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {items.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(Routes.ProductDetail, item)}>
              <View
                style={{
                  marginTop: 15,
                  height: height * 0.429,
                  width: width * 0.45,
                  marginLeft: 12,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(Routes.EditMyProducts, item)
                  }
                  style={{
                    position: 'absolute',
                    zIndex: 0.5,
                    marginLeft: 152,
                    marginTop: 5,
                  }}>
                  <PencilSquareIcon size={19} color="black" />
                </TouchableOpacity>

                <Image
                  style={{
                    height: height * 0.3,
                    width: width * 0.45,
                    overflow: 'hidden',
                  }}
                  source={{
                    uri: item.image_path || DummyImage,
                  }}
                />

                <View
                  style={{
                    borderBottomWidth: 0.2,
                    borderBlockColor: 'gray',
                  }}>
                  <Text style={{color: 'blue', fontWeight: 'bold'}}>
                    {item.name}
                  </Text>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text style={{color: 'black'}}>Price</Text>
                    <Text
                      style={{
                        color: 'red',
                        fontWeight: 'bold',
                        marginLeft: 10,
                      }}>
                      {' '}
                      {item.price}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: 3,
                    }}>
                    <Text style={{color: 'black'}}>Description</Text>
                    <View>
                      <Text>{item.description}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => DeleteItem(item.id)}
                      style={{
                        position: 'absolute',
                        zIndex: 0.5,
                        marginLeft: 155,
                      }}>
                      <ArrowRightStartOnRectangleIcon color="black" size={19} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
