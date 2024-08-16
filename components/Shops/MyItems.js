import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from '../../createClinet';
import {Routes} from '../../navigation/Routes';
import {HeartIcon as HeartIconOutline} from 'react-native-heroicons/outline';
import {
  ArrowRightStartOnRectangleIcon,
  HeartIcon as HeartIconSolid,
} from 'react-native-heroicons/solid';
import Carousel from 'react-native-snap-carousel';
import {DummyImage} from './ShopItemsCardView';

var {width, height} = Dimensions.get('window');
export default function MyItems(props) {
  const [shopItem, setShopItem] = useState([]);
  const [inventoryItem, setInventoyItem] = useState([]);
  const navigation = useNavigation();
  const [itemsInventory, setItemsInventory] = useState([]);
  const item = props.item;
  const fetchItemData = async () => {
    const {data: inventoryData, error: inventoryError} = await supabase
      .from('items_inventory')
      .select('*')
      .eq('shop_id', item.id);

    setInventoyItem(inventoryData);
    // console.log('Inventory Items :', inventoryItem);
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

  const fetchDataProducts = async () => {
    try {
      const {data, error} = await supabase
        .from('items_inventory')
        .select('*')
        .eq('shop_id', item.id);

      if (error) {
        console.error('Error fetching inventory items:', error.message);
        return;
      }

      if (!data || !Array.isArray(data)) {
        console.error('Unexpected data format:', data);
        return;
      }

      // Fetch images for each inventory item
      const fetchImages = async inventoryId => {
        const {data: images, error: imagesError} = await supabase
          .from('item_images')
          .select('image_path')
          .eq('item_id', inventoryId);

        if (imagesError) {
          console.error(
            `Error fetching images for inventory_id ${inventoryId}:`,
            imagesError.message,
          );
          return [];
        }

        return images.map(img => img.image_path);
      };

      const itemsWithImages = await Promise.all(
        data.map(async item => {
          const images = await fetchImages(item.id);
          return {
            ...item,
            images: images.length > 0 ? images : [DummyImage], // Fallback to DummyImage if no images found
          };
        }),
      );

      setItemsInventory(itemsWithImages);
      console.log('Items With Images aree -> ', itemsWithImages);

      console.log('Item With Images are is kaltu ->  ', itemsWithImages);
    } catch (e) {
      console.error('Error in fetchDataProducts:', e);
    }
  };

  useEffect(() => {
    fetchItemData();
    fetchDataProducts();
  }, []);

  const renderCarouselItem = ({item}) => (
    <Image
      style={{
        height: height * 0.2,
        width: width * 0.35,
      }}
      source={{uri: item}}
    />
  );
  const carouselRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.snapToNext();
      }
    }, 1500); // Slide every 1 second

    return () => clearInterval(interval);
  }, []);
  //slite Error in this for Vistual list to remove that remove scroll view horizontal
  return (
    <SafeAreaView>
      <View>
        <Text>Saree's</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 15}}>
          {itemsInventory.map((item, index) => {
            if (item.qty > 0) {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate(Routes.InventoryItemDetail, item)
                  }>
                  <View
                    style={{
                      marginTop: 15,
                      height: height * 0.45,
                      width: width * 0.35,
                      marginRight: 10,
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                        zIndex: 0.5,
                        marginTop: 3,
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{color: 'black', marginRight: 3, marginLeft: 5}}>
                        Qty :
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          backgroundColor: 'green',
                          borderRadius: 10,
                          padding: 5,
                          fontSize: 10,
                        }}>
                        {item.qty}
                      </Text>
                    </View>

                    <TouchableOpacity
                      //onPress={() => (fav ? setFav(false) : setFav(true))}
                      style={{
                        position: 'absolute',
                        zIndex: 0.5,
                        marginLeft: 110,
                        marginTop: 5,
                      }}>
                      <HeartIconOutline size={19} color="black" />
                    </TouchableOpacity>

                    <View>
                      <Carousel
                        ref={carouselRef}
                        data={item.images}
                        renderItem={renderCarouselItem}
                        sliderWidth={width * 0.45}
                        itemWidth={width * 0.45}
                        loop={true}
                        autoplay={true}
                        autoplayInterval={2000}
                      />
                    </View>

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
                          {'₹'}
                          {item.base_price}
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
                          <Text
                            style={{
                              marginLeft: 8,
                              color: 'black',
                              fontWeight: 'bold',
                            }}>
                            {item.description.length > 10
                              ? item.description.slice(0, 7) + '...'
                              : item.description}
                          </Text>
                        </View>
                        <ArrowRightStartOnRectangleIcon
                          style={{
                            position: 'absolute',
                            zIndex: 0.5,
                            marginLeft: 120,
                          }}
                          color="black"
                          size={19}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
