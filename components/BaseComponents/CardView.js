import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowRightStartOnRectangleIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import {supabase} from '../../createClinet';
import Carousel from 'react-native-snap-carousel';
import ShopContext from '../../context/ShopContext';

var {width, height} = Dimensions.get('window');
const CardData = [
  {
    title: 'Men Solid Polo',
    image:
      'https://static.magicpin.com/storage/blog/images/myntra-online-shopping-for-mens_Casual_Sweatshirt.jpg',
    price: '$25.12',
    rating: '5k',
    heart: 'false',
    description:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.',
    special: false,
    key: 0,
  },
  {
    title: 'Roadstar',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-AWWA466ibmzVStzAp6oeX5IbquxiL80wPm7jSd1N1PdfP4x2oWi_mX1-zrvUJkK9S-0&usqp=CAU',
    price: '$25.12',
    rating: 5,
    special: false,
    key: 1,
  },
  {
    title: 'Beyoung',
    image:
      'https://static.magicpin.com/storage/blog/images/myntra-online-shopping-for-mens_Casual_GreenShirt.jpg',
    price: '$25.12',
    rating: '4.25k',
    special: false,
    description:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.',
    heart: 'false',
    key: 2,
  },
  {
    title: 'Philippe Sport',
    image:
      'https://static.magicpin.com/storage/blog/images/myntra-online-shopping-for-mens_Formal_Shirt.jpg',
    price: '$25.12',
    rating: '4.55k',
    special: false,
    heart: 'false',
    description:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.',
    key: 3,
  },
  {
    title: 'Red Tape',
    image:
      'https://static.magicpin.com/storage/blog/images/myntra-online-shopping-for-mens_PartyWear_CheckBlazer.jpg',
    price: '$25.12',
    rating: '4.15k',
    special: false,
    heart: 'false',
    description:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.',
    key: 4,
  },
  {
    title: 'Here&Now',
    image:
      'https://lh3.googleusercontent.com/MsbpuXyX44IdGszW088tdtgfRo2CsD7wyc2depVZ_CTIotxCbU_I1GZprmsdwPDvnDAksB6F5etAFnidaIaxMiOdVzXVPWkRXvVb6lw=w360-rw',
    price: '$25.12',
    rating: '3.5k',
    special: false,
    heart: 'false',
    description:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.',
    key: 5,
  },
  {
    title: 'Zara',
    image:
      'https://static.magicpin.com/storage/blog/images/myntra-online-shopping-for-mens_Formal_Pants.jpg',
    price: '$25.12',
    rating: '3.68k',
    special: false,
    heart: 'false',
    description:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.',
    key: 6,
  },
  {
    title: 'Maxx',
    image:
      'https://lh3.googleusercontent.com/wCfjm5IQJ_kAdtHd9fM8Re3P7CljX1asN-VWEHCP7BKmkjFKrJu57QlB_vqXNLPB3ZkJ228fYNXrmc5Wz6FJ1Fm0jtCQSiHQFZDwS9eN=w360-rw',
    price: '$25.12',
    rating: '4.9k',
    special: false,
    description:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.',
    heart: 'false',
    key: 7,
  },
  {
    title: 'Venus',
    image:
      'https://lh3.googleusercontent.com/phchnwK5mlBblJlJQJE9RGDKrKqqiakoOOUtpgWJxVaBbsClZVXHP9RcxjGcCjSx0GdCWDogFpJNnA9wcMjGE-iEO07gBbs7yIpxD9Y=w360-rw',
    price: '$25.12',
    rating: '4.25k',
    special: false,
    heart: 'false',
    description:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.',
    key: 8,
  },
  {
    title: 'Roadstar',
    image:
      'https://lh3.googleusercontent.com/IrXT3mdHeBgEHNVKLKTy_FeP1Ut0fPVoCLzVtd2rtrwK309qRZrxNJsBpcEdU2ffnE74wvhadQuv6rHjE99yH60b-Lf2TLVagW_cajVK6w=w360-rw',
    price: '$25.12',
    rating: '4.25k',
    special: false,
    heart: 'false',
    description:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.',
    key: 9,
  },
  {
    title: 'Locomotive',
    image:
      'https://static.magicpin.com/storage/blog/images/myntra-online-shopping-for-mens_Casual_Jeans.jpg',
    price: '$25.12',
    rating: '4.25k',
    special: false,
    heart: 'false',
    description:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humor.',
    key: 10,
  },
];

export const DummyImage =
  'https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg';

export default function CardView({data}) {
  const {userId} = useContext(ShopContext);
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const [fav, setFav] = useState(false);
  const navigation = useNavigation();
  const [shopItem, setShopItem] = useState([]);
  const [inventoryItem, setInventoyItem] = useState([]);
  const [itemsInventory, setItemsInventory] = useState([]);
  const [watchListItemsDetail, setWatchListItemsDetail] = useState([]);

  const fetchItemData = async () => {
    const {data: inventoryData, error: inventoryError} = await supabase
      .from('items_inventory')
      .select('*');

    setInventoyItem(inventoryData);
    //console.log('Home inventory Items :', inventoryData);

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

      //console.log('Shop Shop Home Items :', shopItem);

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

      // console.log('Home Images of INventory items :   ', itemsInventory);
    } else {
      console.log('No items found in items_inventory for this shop.');
    }
  };

  useEffect(() => {
    fetchItemData();
    //fetchDataProducts();
  }, []);

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
        .eq('item_id', itemId)
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
        return watchListItemIds.includes(shopItem.id) ? shopItem.id : null;
      });
    } else {
      // If userId is not defined or no user, all watchListItems will be null
      watchListItems = shopItem.map(() => null);
    }

    //console.log('Items in WatchList or null: ', watchListItems);
    setWatchListItemsDetail(watchListItems);
  };

  useEffect(() => {
    GettingFromWatchList();
  }, [watchListItemsDetail]);

  return (
    <SafeAreaView>
      <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {itemsInventory.map((item, index) => {
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
                      400
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
        })}
      </View>
    </SafeAreaView>
  );
}
