import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {
  ArrowRightStartOnRectangleIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
} from 'react-native-heroicons/solid';
import {HeartIcon as HeartIconOutline} from 'react-native-heroicons/outline';
import {HeartIcon as HeartIconSolid} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import {supabase} from '../../createClinet';
import ShopContext from '../../context/ShopContext';
import Carousel from 'react-native-snap-carousel';

var {width, height} = Dimensions.get('window');

export const DummyImage =
  'https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg';

export default function InventoryCardView({data}) {
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const [fav, setFav] = useState(false);
  const navigation = useNavigation();
  const [itemsInventory, setItemsInventory] = useState([]);
  const {userId} = useContext(ShopContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [myShops, setMyShops] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState('');
  const [watchListItemsDetail, setWatchListItemsDetail] = useState([]);

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

  const fetchDataProducts = async () => {
    try {
      const {data, error} = await supabase.from('items_inventory').select('*');

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

      console.log('ItemInventory  With Images are is  ->  ', itemsWithImages);
    } catch (e) {
      console.error('Error in fetchDataProducts:', e);
    }
  };

  useEffect(() => {
    fetchDataProducts();
    fetchMyShops();
  }, []);

  const handleAddToShop = async shopId => {
    const totalQty = selectedItem.qty;
    const newQty = parseInt(qty, 10);

    if (newQty > totalQty) {
      Alert.alert(
        'Error',
        'You cannot add more than the total available quantity.',
      );
      return;
    }
    //console.log('Selected Item :', selectedItem);
    if (selectedItem && qty) {
      console.log('inside the data');
      /*
      const {data, error} = await supabase
        .from('items_inventory')
        .select('*')
        .eq('item_id', selectedItem.item_id)
        .eq('shop_id', shopId);

      if (data.length > 0) {
        const item = data[0];
        const updatedQty = item.qty + newQty;

        if (updatedQty > totalQty) {
          Alert.alert(
            'Error',
            'You cannot add more than the total available quantity.',
          );
          return;
        }

        const {error: updateError} = await supabase
          .from('items_inventory')
          .update({qty: updatedQty})
          .eq('item_id', selectedItem.item_id)
          .eq('shop_id', shopId);

        if (updateError) {
          console.error('Error updating quantity:', updateError.message);
        }
      } else {
       */
      const {data, error: insertError} = await supabase.from('items').insert([
        {
          name: selectedItem.name,
          description: selectedItem.description,
          price: selectedItem.base_price,
          shop_id: shopId,
          brand_attribute_value_id: selectedItem.brand_attribute_value_id,
          //user_id: userId.id_user,
          created_by: userId.id_user,
          owner_id: userId.id_user,
          fabric_attribute_value_id: selectedItem.fabric_attribute_value_id,
          qty: newQty,
        },
      ]);
      console.log('Inserting Data : ', data);
      if (insertError) {
        console.error('Error adding item:', insertError.message);
      }

      console.log('Selected Item :-> ', selectedItem);
      //}
      // Update the original inventory quantity
      const updatedOriginalQty = totalQty - newQty;
      const {error: updateError} = await supabase
        .from('items_inventory')
        .update({qty: updatedOriginalQty})
        .eq('id', selectedItem.id);

      if (updateError) {
        console.error('Error updating original quantity:', updateError.message);
      } else {
        // Update the local state to reflect the changes in the UI
        const updatedItemsInventory = itemsInventory.map(item =>
          item.item_id === selectedItem.id
            ? {...item, qty: updatedOriginalQty}
            : item,
        );
        setItemsInventory(updatedItemsInventory);
      }

      setQty('');
      setModalVisible(false);
      fetchDataProducts();
    }
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

  const handleHeart = async itemId => {
    // console.log('Heart Color ', fav);
    // console.log('WatchList ItemId:', itemId);

    const {data, error} = await supabase
      .from('watchList')
      .select('*')
      .eq('inventory_id', itemId)
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
            inventory_id: itemId,
          },
        ]);
      setFav(true);
      if (watchListError) {
        console.error('Error inserting into WatchList:', watchListError);
      } else {
        setFav(true);
        console.log(' Added into WatchList ', watchListData);
      }
    } else {
      const response = await supabase
        .from('watchList')
        .delete()
        .eq('inventory_id', itemId)
        .eq('user_id', userId.id_user);
      setFav(false);
      if (response) {
        setFav(false);
        console.log('removed from WatchList:');
      } else {
        //Alert.alert('Faild while deleting item');
      }
    }
    console.log('Heart Color After ', fav);
  };

  //getting from watchList
  const GettingFromWatchList = async () => {
    let watchListItems = [];

    if (userId && userId.id_user) {
      const {data: watchListData, error: watchListError} = await supabase
        .from('watchList')
        .select('inventory_id')
        .eq('user_id', userId.id_user);

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
        return watchListItemIds.includes(shopItem.id) ? shopItem.id : null;
      });
    } else {
      // If userId is not defined or no user, all watchListItems will be null
      watchListItems = itemsInventory.map(() => null);
    }

    //console.log('Inventory-Items in WatchList or null: ', watchListItems);
    setWatchListItemsDetail(watchListItems);
  };

  useEffect(() => {
    GettingFromWatchList();
  }, [watchListItemsDetail]);
  return (
    <SafeAreaView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {itemsInventory.map((item, index) => {
          if (item.qty > 0) {
            return (
              <TouchableOpacity
                style={{marginBottom: -35}}
                key={index}
                onPress={() =>
                  navigation.navigate(Routes.InventoryItemDetail, item)
                }>
                <View
                  style={{
                    marginTop: 15,
                    height: height * 0.429,
                    width: width * 0.45,
                    marginLeft: 12,
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
                    onPress={() => handleHeart(item.id)}
                    style={{
                      position: 'absolute',
                      zIndex: 0.5,
                      marginLeft: 152,
                      marginTop: 5,
                    }}>
                    <HeartIcon
                      size={19}
                      color={
                        watchListItemsDetail.includes(item?.id)
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
                  {/*
                  {item.owner_id !== userId.id_user ? (
                    <View style={styles.container}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedItem(item);
                          setModalVisible(true);
                        }}
                        style={{
                          position: 'absolute',
                          zIndex: 0.5,
                          marginLeft: 70,
                          marginTop: 210,
                          borderWidth: 0.5,
                          borderRadius: 5,
                          paddingLeft: 10,
                          paddingRight: 10,
                          backgroundColor: 'green',
                        }}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>
                          Add to Shop
                        </Text>
                      </TouchableOpacity>

                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                          setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                            <Text>
                              Total Qty: {selectedItem ? selectedItem.qty : 0}
                            </Text>
                            {myShops.map((shop, index) => {
                              return (
                                <View key={index}>
                                  <View
                                    style={{
                                      borderBottomWidth: 0.5,
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                    }}>
                                    <Text style={{fontSize: 18}}>
                                      {shop.name}
                                    </Text>
                                    <TextInput
                                      style={{
                                        borderWidth: 0.5,
                                        borderRadius: 10,
                                        height: 40,
                                        fontSize: 18,
                                        paddingLeft: 12,
                                      }}
                                      placeholder="0"
                                      value={qty}
                                      onChangeText={text => setQty(text)}
                                    />
                                    <TouchableOpacity
                                      onPress={() => handleAddToShop(shop.id)}
                                      style={{
                                        backgroundColor: 'green',
                                        borderRadius: 10,
                                        padding: 10,
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

                            <TouchableOpacity
                              style={styles.button}
                              onPress={() => setModalVisible(!modalVisible)}>
                              <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  ) : (
                    ''
                  )}
                  */}

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
                            ? item.description.slice(0, 10) + '...'
                            : item.description}
                        </Text>
                      </View>
                      <ArrowRightStartOnRectangleIcon
                        style={{
                          position: 'absolute',
                          zIndex: 0.5,
                          marginLeft: 155,
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
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'blue',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
