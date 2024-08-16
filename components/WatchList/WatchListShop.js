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
  HeartIcon,
  HeartIcon as HeartIconSolid,
  StarIcon,
} from 'react-native-heroicons/solid';
import Carousel from 'react-native-snap-carousel';
import {DummyImage} from '../BaseComponents/CardView';

var {width, height} = Dimensions.get('window');
export default function WatchListShop(props) {
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const [watchListItemsDetail, setWatchListItemsDetail] = useState([]);
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

  const GettingFromWatchList = async () => {
    const {data: shopItems, error: shopItemsError} = await supabase
      .from('shop_items')
      .select('*');

    if (shopItemsError) {
      console.error('Error fetching shop items:', shopItemsError);
      return;
    }

    let watchListItems = [];

    if (item && item.id) {
      const {data: watchListData, error: watchListError} = await supabase
        .from('watchList')
        .select('item_id')
        .eq('shop_id', item.id);

      if (watchListError) {
        console.error('Error fetching watch list data:', watchListError);
        return;
      }

      console.log('WatchList Data is -> ', watchListData);
      // Extract item IDs from WatchList
      const watchListItemIds = watchListData.map(
        watchItem => watchItem.item_id,
      );

      // Map through shopItems and check if each item is in the WatchList
      console.log('Shop Data is -> ', shopItem);
      watchListItems = shopItem.map(shopItem => {
        return watchListItemIds.includes(shopItem.id) ? shopItem : null;
      });
    } else {
      // If userId is not defined or no user, all watchListItems will be null
      watchListItems = shopItem.map(() => null);
    }

    setWatchListItemsDetail(watchListItems);
    console.log(
      ' Shop WatchList Items in WatchList or null: : :-> ',
      watchListItemsDetail,
    );
  };

  useEffect(() => {
    GettingFromWatchList();
  }, [watchListItemsDetail]);

  return (
    <SafeAreaView>
      <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {watchListItemsDetail.map((item, index) => {
          const inventoryItem = itemsInventory.find(
            inventory => inventory.inventory_id === item?.id,
          );

          if (inventoryItem) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(Routes.ProductDetail, item)}>
                <View
                  style={{
                    marginTop: 15,

                    height: height * 0.379,
                    width: width * 0.45,
                    marginLeft: 12,
                  }}>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      zIndex: 0.5,
                      marginLeft: 152,
                      marginTop: 5,
                    }}>
                    <HeartIcon size={19} color="red" />
                  </TouchableOpacity>

                  <View>
                    <Carousel
                      ref={carouselRef}
                      data={inventoryItem.images}
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
                      {inventoryItem.name}
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
                        {shopItem ? shopItem[index].price : '0'}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 3,
                      }}>
                      <Text style={{color: 'black'}}>Rating</Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginTop: 2,
                          marginLeft: 6,
                        }}>
                        {star.map((item, index) => {
                          return (
                            <StarIcon key={index} color={'black'} size={15} />
                          );
                        })}
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          } else {
            return null;
          }
        })}
      </View>
    </SafeAreaView>
  );
}
