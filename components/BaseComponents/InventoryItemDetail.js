import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from './Header';
import {useRoute} from '@react-navigation/native';
import {StarIcon} from 'react-native-heroicons/solid';
import SimilarStyles from './SimilarStyles';
import {supabase} from '../../createClinet';
import ShopContext from '../../context/ShopContext';
import Carousel from 'react-native-snap-carousel';
import Crusl from './Crusl';

var {width, height} = Dimensions.get('window');
export default function InventoryItemDetail({data}) {
  const [myShops, setMyShops] = useState([]);
  const [qty, setQty] = useState('');
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const route = useRoute();
  const item = route.params;
  const [shopAvailability, setShopAvailability] = useState([1, 2, 3, 4]);
  const [itemsColour, setItemsColour] = useState([]);
  const [itemsImages, setItemsImages] = useState([]);
  const [itemsOccasion, setItemsOccasion] = useState([]);
  const [itemBrand, setItemBrand] = useState('');
  const {userId} = useContext(ShopContext);

  const fetchMyShops = async () => {
    if (userId && userId.id_user) {
      const {data, error} = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', userId.id_user);

      if (error) {
        console.error('Error fetching user data:', error.message);
      } else {
        setMyShops(data);
        //  console.log(myShops);
      }
    } else {
      console.log('User ID is undefined');
    }
    //console.log('MY SHOP DATA : ', myShops);
  };

  const fetchColors = async () => {
    try {
      // Fetch item colors from 'item_colour' table
      const {data: itemColorData, error: itemColorError} = await supabase
        .from('item_colour')
        .select('colour_id')
        .eq('item_id', item.id);

      // console.log('Colour_id : ', itemColorData);

      if (itemColorError) {
        console.error('Error fetching item colors:', itemColorError.message);
        return;
      }

      if (!itemColorData || itemColorData.length === 0) {
        console.log('No colors found for this item');
        return;
      }

      // Extract the color IDs
      const colorIds = itemColorData.map(item => item.colour_id);

      //console.log('Id C :', colorIds);

      if (colorIds.length === 0) {
        console.log('No valid color IDs found');
        return;
      }

      // Fetch color details from 'colours' table using the extracted color IDs
      const {data: colorsData, error: colorsError} = await supabase
        .from('colours')
        .select('*')
        .in('id', colorIds);

      //console.log('Colors Data:', colorsData);

      setItemsColour(colorsData);

      if (colorsError) {
        console.error('Error fetching colors:', colorsError.message);
        return;
      }

      //  console.log('Item Colors:', colorsData);
      // setItemsColour(colorsData); // Uncomment and use the correct state setter if needed
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const fetchOccastion = async () => {
    try {
      // Fetch item colors from 'item_colour' table
      const {data: itemOccasionData, error: itemOccasionError} = await supabase
        .from('item_occasion')
        .select('occasion_id')
        .eq('item_id', item.id);

      // console.log('Colour_id : ', itemColorData);

      if (itemOccasionError) {
        console.error('Error fetching item colors:', itemOccasionError.message);
        return;
      }

      if (!itemOccasionData || itemOccasionData.length === 0) {
        console.log('No colors found for this item');
        return;
      }

      // Extract the color IDs
      const occasionIds = itemOccasionData.map(item => item.occasion_id);

      //console.log('Id C :', colorIds);

      if (occasionIds.length === 0) {
        console.log('No valid color IDs found');
        return;
      }

      // Fetch color details from 'colours' table using the extracted color IDs
      const {data: occasionData, error: occasionError} = await supabase
        .from('occasion')
        .select('*')
        .in('id', occasionIds);

      //console.log('Colors Data:', colorsData);

      setItemsOccasion(occasionData);

      console.log('Item Occasion : ', itemsOccasion);

      if (occasionError) {
        console.error('Error fetching colors:', occasionError.message);
        return;
      }

      //  console.log('Item Colors:', colorsData);
      // setItemsColour(colorsData); // Uncomment and use the correct state setter if needed
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const fetchImages = async () => {
    const {data, error} = await supabase
      .from('item_images')
      .select('*')
      .eq('item_id', item.id);

    //console.log(data);
    setItemsImages(data);
    //console.log('My Images: ', itemsImages);
    //console.log('Images of my item :', data);

    if (error) {
      console.error('Error fetching user data:', error.message);
    } else {
      //   setMyShops(data);
      //  console.log(myShops);
    }

    //console.log('MY SHOP DATA : ', myShops);
  };

  const fetchBrand = async () => {
    const {data, error} = await supabase
      .from('attribute_values')
      .select('*')
      .eq('id', item.brand_attribute_value_id);

    setItemBrand(data[0].value);
    console.log('Item Brand', data[0].value);
    console.log(itemBrand);
  };

  useEffect(() => {
    fetchColors();
    fetchOccastion();
    fetchImages();
    fetchMyShops();
    fetchBrand();
  }, []);

  const renderImageItem = ({item, index}) => {
    console.log('Images if item render :', item);
    return (
      <View key={index}>
        <Image
          source={{uri: item.image_path}} // Change image_url to your actual image URL field
          style={{width: width, height: height * 0.59}}
        />
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Header />
        {itemsImages.length > 0 && (
          <Carousel
            data={itemsImages}
            renderItem={renderImageItem}
            sliderWidth={width}
            itemWidth={width}
            layout={'default'}
          />
        )}
        <View style={{marginLeft: 12}}>
          <View>
            <Text style={{color: 'red', fontWeight: 'bold', fontSize: 20}}>
              {item.name}
            </Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {item.base_price}
            </Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 2,
                }}>
                {star.map((item, index) => {
                  return <StarIcon key={index} color={'black'} size={15} />;
                })}
              </View>
              <Text style={{color: 'black', marginLeft: 10}}>
                {item.rating}
              </Text>
            </View>
            <View>
              <View>
                <Text style={{color: 'black'}}>Description</Text>
                <Text>{item.description}</Text>
              </View>
              <View>
                <Text>Map</Text>
              </View>
            </View>
          </View>

          <View style={{marginTop: 7}}>
            <Text
              style={{color: 'black', fontWeight: 'bold', marginBottom: 10}}>
              Availablility
            </Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              {shopAvailability.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      borderWidth: 0.5,
                      borderRadius: 20,
                      padding: 5,
                      marginRight: 5,
                    }}>
                    <Text>ABC Shop</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={{marginTop: 7}}>
            <Text
              style={{color: 'black', fontWeight: 'bold', marginBottom: 10}}>
              Product Details
            </Text>
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Brand</Text>
                <View>
                  <Text style={{marginLeft: 45}}>Nike</Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Colour</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: 40,
                  }}>
                  {itemsColour.map((item, index) => {
                    return (
                      <View key={index} style={{marginRight: 10}}>
                        <Text style={{fontSize: 15}}>{item.colour}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Price</Text>
                <View style={{marginLeft: 48}}>
                  <Text>{item.base_price}</Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Type</Text>
                <TextInput
                  style={{
                    borderRadius: 20,
                    borderWidth: 0.5,
                    width: 150,
                    height: 10,
                    marginLeft: 49,
                  }}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>
                  Occassion
                </Text>
                <View
                  style={{
                    display: 'flex',
                    marginLeft: 18,
                  }}>
                  {itemsOccasion.map((item, index) => {
                    return (
                      <View key={index} style={{marginRight: 5}}>
                        <Text style={{fontSize: 15}}>{item.name}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Fabric</Text>
                <TextInput
                  style={{
                    borderRadius: 20,
                    borderWidth: 0.5,
                    width: 150,
                    height: 10,
                    marginLeft: 43,
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              Friends Openion
            </Text>
            <View style={{display: 'flex', flexDirection: 'row', marginTop: 2}}>
              {star.map((item, index) => {
                return <StarIcon key={index} color={'black'} size={15} />;
              })}
            </View>
          </View>

          <View style={{marginTop: 10}}>
            <Text
              style={{color: 'black', fontWeight: 'bold', marginBottom: 10}}>
              Add Product to my Shop
            </Text>
            <View>
              {myShops.map((shop, index) => {
                return (
                  <View key={index}>
                    <View
                      style={{
                        borderBottomWidth: 0.5,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 5,
                      }}>
                      <Text style={{color: 'black', fontWeight: 'bold'}}>
                        {shop.name}
                      </Text>
                      <TextInput
                        style={{
                          borderWidth: 0.5,
                          borderRadius: 10,
                          height: 30,
                          fontSize: 18,
                          paddingLeft: 10,
                          paddingRight: -2,
                          paddingTop: -20,
                          paddingBottom: -7,
                          marginLeft: 80,
                        }}
                        placeholder="0"
                        value={qty}
                        onChangeText={text => setQty(text)}
                      />
                      <TouchableOpacity
                        //onPress={() => handleAddToShop(shop.id)}
                        style={{
                          backgroundColor: 'green',
                          borderRadius: 10,
                          padding: 10,
                          height: 30,
                          paddingBottom: -3,
                          paddingTop: 3,
                          marginRight: 30,
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                          }}>
                          Add
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={{marginTop: 10}}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              Similar Style
            </Text>
            <SimilarStyles />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
