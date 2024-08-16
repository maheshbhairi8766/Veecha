import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../BaseComponents/Header';
import SearchBar from '../BaseComponents/SearchBar';
import ShopContext from '../../context/ShopContext';
import {supabase} from '../../createClinet';
import {DummyImage} from '../BaseComponents/CardView';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import {HeartIcon, StarIcon} from 'react-native-heroicons/solid';
import Carousel from 'react-native-snap-carousel';

var {width, height} = Dimensions.get('window');
export default function WatchListInventoryCardView() {
  const {userId} = useContext(ShopContext);
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const [watchListItemsDetail, setWatchListItemsDetail] = useState([]);
  const [itemsInventory, setItemsInventory] = useState([]);
  const [shopItem, setShopItem] = useState([]);
  const [inventoryItem, setInventoyItem] = useState([]);
  const navigation = useNavigation();

  const fetchItemData = async () => {
    const {data: inventoryData, error: inventoryError} = await supabase
      .from('items_inventory')
      .select('*');

    setInventoyItem(inventoryData);
    console.log('WatchList inventory Items :', inventoryData);

    if (inventoryError) {
      console.error(
        'Error fetching items from items_inventory:',
        inventoryError,
      );
      return;
    }

    if (inventoryData && inventoryData.length > 0) {
      const shopItemsPromises = inventoryData.map(async inventoryItem => {
        const {data, error} = await supabase
          .from('shop_items')
          .select('*')
          .eq('inventory_id', inventoryItem.id);

        //console.log('Home Inventory Items', data);
        if (error) {
          console.error(
            `Error fetching shop items for inventory ID ${inventoryItem.id}:`,
            inventoryError,
          );
          return null;
        }

        return data;
      });

      const shopItemsResults = await Promise.all(shopItemsPromises);
      //console.log('Shop Items :', shopItemsResults.flat());
      setShopItem(shopItemsResults.flat());

      //console.log('Watchlist Shop Home Items : :', shopItem);

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
        inventoryData.map(async item => {
          const images = await fetchImages(item.id);
          return {
            ...item,
            images: images.length > 0 ? images : [DummyImage], // Fallback to DummyImage if no images found
          };
        }),
      );

      setItemsInventory(itemsWithImages);

      //console.log('WatchList Images of INventory items : in Inventory -> ', itemsInventory);
    } else {
      console.log('No items found in items_inventory for this shop.');
    }
  };

  useEffect(() => {
    fetchItemData();
  }, []);
  const GettingFromWatchList = async () => {
    const {data: shopItems, error: shopItemsError} = await supabase
      .from('shop_items')
      .select('*');

    if (shopItemsError) {
      console.error('Error fetching shop items:', shopItemsError);
      return;
    }

    let watchListItems = [];

    if (userId && userId.id_user) {
      const {data: watchListData, error: watchListError} = await supabase
        .from('watchList')
        .select('inventory_id')
        .eq('user_id', userId.id_user);

      //console.log('Fetching Inventory Data ', watchListData);

      if (watchListError) {
        console.error('Error fetching watch list data:', watchListError);
        return;
      }

      // Extract item IDs from WatchList
      const watchListItemIds = watchListData.map(
        watchItem => watchItem.inventory_id,
      );

      // Map through shopItems and check if each item is in the WatchList
      watchListItems = itemsInventory.map(shopItem => {
        return watchListItemIds.includes(shopItem.id) ? shopItem : null;
      });
    } else {
      // If userId is not defined or no user, all watchListItems will be null
      watchListItems = itemsInventory.map(() => null);
    }

    //console.log('WatchList Items in WatchList or null: :-> ', watchListItems);
    setWatchListItemsDetail(watchListItems);
    //  console.log('WatchList Items in WatchList Inventory or null: : :-> ',watchListItems);
  };

  useEffect(() => {
    GettingFromWatchList();
  }, [watchListItemsDetail]);

  /*
  const GettingWatchListFavItems = async () => {
    const {data: shopItems, error: shopItemsError} = await supabase
      .from('shop_items')
      .select('*');

    if (shopItemsError) {
      console.error('Error fetching shop items:', shopItemsError);
      return;
    }

    let watchListItems = [];

    if (userId && userId.id_user) {
      const {data: watchListData, error: watchListError} = await supabase
        .from('watchList')
        .select('item_id')
        .eq('user_id', userId.id_user);

      if (watchListError) {
        console.error('Error fetching watch list data:', watchListError);
        return;
      }

      // Extract item IDs from WatchList
      const watchListItemIds = watchListData.map(
        watchItem => watchItem.item_id,
      );

      // Map through shopItems and check if each item is in the WatchList
      watchListItems = shopItem.map(shopItem => {
        return watchListItemIds.includes(shopItem.id) ? shopItem : null;
      });
    } else {
      // If userId is not defined or no user, all watchListItems will be null
      watchListItems = shopItem.map(() => null);
    }

    console.log('WatchList Items in WatchList or null: ->  ', watchListItems);
    setWatchListItemsDetail(watchListItems);
  };

  useEffect(() => {
    GettingWatchListFavItems();
  }, []);
  */

  const handleHeart = async itemId => {
    // console.log('Heart Color ', fav);
    // console.log('WatchList ItemId:', itemId);

    const {data, error} = await supabase
      .from('watchList')
      .select('*')
      .eq('item_id', itemId)
      .eq('user_id', userId.id_user);

    if (error) {
      console.error('Error fetching from WatchList:', error);
      return;
    }

    //  console.log('Getting from WatchList:', data);

    if (data.length === 0) {
      console.log('Inserting into WatchList');
      const {data: watchListData, error: watchListError} = await supabase
        .from('watchList') // Correct table name here
        .insert([
          {
            user_id: userId.id_user,
            item_id: itemId,
          },
        ]);
      //setFav(true);
      if (watchListError) {
        console.error('Error inserting into WatchList:', watchListError);
      } else {
        //setFav(true);
        console.log(' Added into WatchList ', watchListData);
      }
    } else {
      const response = await supabase
        .from('watchList')
        .delete()
        .eq('item_id', itemId)
        .eq('user_id', userId.id_user);
      //  setFav(false);
      if (response) {
        //setFav(false);
        console.log('removed from WatchList:');
      } else {
        //Alert.alert('Faild while deleting item');
      }
    }
    //  console.log('Heart Color After ', fav);
  };

  const renderCarouselItem = ({item}) => (
    <Image
      style={{
        height: height * 0.3,
        width: width * 0.45,
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
  return (
    <SafeAreaView>
      <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {watchListItemsDetail.map((item, index) => {
          const inventoryItem = itemsInventory.find(
            inventory => inventory.id === item?.id,
          );
          // console.log('inventoryItem', inventoryItem);
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
                    onPress={() =>
                      handleHeart(shopItem ? shopItem[index].id : null)
                    }
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

        {/*
        itemsInventory.map((item, index) => {
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
                  onPress={() =>
                    handleHeart(shopItem ? shopItem[index].id : null)
                  }
                  style={{
                    position: 'absolute',
                    zIndex: 0.5,
                    marginLeft: 152,
                    marginTop: 5,
                  }}>
                  <HeartIcon
                    size={19}
                    color={
                      shopItem &&
                      watchListItemsDetail.includes(shopItem[index]?.id)
                        ? 'red'
                        : 'white'
                    }
                  />
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
        })

        */}
      </View>
    </SafeAreaView>
  );
}
