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
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  AtSymbolIcon,
  PencilSquareIcon,
  StarIcon,
  TrashIcon,
} from 'react-native-heroicons/solid';
import SimilarStyles from './SimilarStyles';
import {supabase} from '../../createClinet';
import ShopContext from '../../context/ShopContext';
import Carousel from 'react-native-snap-carousel';
import Crusl from './Crusl';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import CheckBox from 'react-native-check-box';
import {Routes} from '../../navigation/Routes';

var {width, height} = Dimensions.get('window');
export default function InventoryItemDetailEdit() {
  const [isFocus, setIsFocus] = useState(false);
  const [myShops, setMyShops] = useState([]);
  const [value, setValue] = useState(null);
  const [qty, setQty] = useState('');
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const route = useRoute();
  const item = route.params;
  const [shopAvailability, setShopAvailability] = useState([1, 2, 3, 4]);
  const [itemsColour, setItemsColour] = useState([]);
  const [itemsImages, setItemsImages] = useState([]);
  const [itemsOccasion, setItemsOccasion] = useState([]);
  const [occasionData, setOccasionData] = useState([]);
  const [itemBrand, setItemBrand] = useState('');
  const [data, setData] = useState([]);
  const {userId} = useContext(ShopContext);
  const [selectedColour, setSelectedColour] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  //editing items
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [colourData, setColourData] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    setNewName(item.name);
    setNewDescription(item.description);
    setNewPrice(String(item.base_price));
    console.log('My new Name ', newName);
    console.log('My item name ', item.name);
  }, [item]);
  /*
  const occasionData = [
    {value: '1', name: 'Wedding'},
    {value: '2', name: 'Traditional attire'},
    {value: '3', name: 'Formal wear'},
    {value: '4', name: 'Business Outfit'},
    {value: '5', name: 'Festive attire'},
    {value: '6', name: 'Stylish attire'},
    {value: '7', name: 'Religious'},
    {value: '8', name: 'Jumpsuits'},
    {value: '9', name: 'Midi Dresses'},
    {value: '10', name: 'Blazers & Trousers'},
    {value: '11', name: 'Skirt & Blouse'},
    {value: '12', name: 'Summer'},
  ];
  */

  /*
  const colourData = [
    {value: '1', name: 'Black'},
    {value: '2', name: 'White'},
    {value: '3', name: 'Red'},
    {value: '4', name: 'Blue'},
    {value: '5', name: 'Yellow'},
    {value: '6', name: 'Green'},
    {value: '7', name: 'Orange'},
    {value: '8', name: 'Pink'},
    {value: '9', name: 'Purple'},
    {value: '10', name: 'Brown'},
    {value: '11', name: 'Gray'},
  ];*/

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
      const {data: itemColorData, error: itemColorError} = await supabase
        .from('item_colour')
        .select('colour_id')
        .eq('item_id', item.id);

      if (itemColorError) {
        console.error('Error fetching item colors:', itemColorError.message);
        return;
      }

      if (!itemColorData || itemColorData.length === 0) {
        console.log('No colors found for this item');
        return;
      }

      const colorIds = itemColorData.map(item => item.colour_id);

      if (colorIds.length === 0) {
        console.log('No valid color IDs found');
        return;
      }

      const {data: colorsData, error: colorsError} = await supabase
        .from('colours')
        .select('*')
        .in('id', colorIds);

      if (colorsError) {
        console.error('Error fetching colors:', colorsError.message);
        return;
      }

      //     console.log("COLORS ID'S before :", colorIds);
      const {data: colorFetchData, error: colorFetchError} = await supabase
        .from('colours')
        .select('*')
        .not('id', 'in', `(${colorIds.join(',')})`);

      setColourData(colorFetchData);
      //.not('id', 'in', colorIds);

      //      console.log('Color Not equal is :', colorFetchData);

      setItemsColour(colorsData);

      // Set the selected colors based on the fetched color IDs
      setSelectedColour(colorIds);
      //      console.log('My COLOR DATA :', colorsData);
      //      console.log("COLORS ID'S :", colorIds);
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

      const {data: occasionFetchData, error: occasionFetchError} =
        await supabase
          .from('occasion')
          .select('*')
          .not('id', 'in', `(${occasionIds.join(',')})`);

      setItemsOccasion(occasionData);
      setSelectedOccasions(occasionIds);
      setOccasionData(occasionFetchData);

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

    setValue(item.brand_attribute_value_id);
    setItemBrand(data[0].value);
    console.log('Item Brand', data[0].value);
    console.log(itemBrand);
  };

  const FetchBrandAttribute = async () => {
    const {data, error} = await supabase.from('attribute_values').select('*');
    if (error) {
      console.error(error);
      return;
    }

    const transformedData = data.map(item => ({
      label: item.value, // Assuming 'value' is the field you want to display
      value: item.id, // Assuming 'id' is the unique identifier
    }));

    setData(transformedData);
  };

  const handleOccasionCheck = occasionId => {
    setSelectedOccasions(prev => {
      const newState = prev.includes(occasionId)
        ? prev.filter(id => id !== occasionId)
        : [...prev, occasionId];
      console.log('Updated selectedOccasions:', newState);
      return newState;
    });
  };

  const handleColourCheck = colourId => {
    /*setSelectedColour(prev => {
      if (prev.includes(colourId)) {
        return prev.filter(id => id !== colourId);
      } else {
        return [...prev, colourId];
      }
    });*/
    setSelectedColour(prev => {
      const newState = prev.includes(colourId)
        ? prev.filter(id => id !== colourId)
        : [...prev, colourId];
      console.log('Updated Colour Occasions:', newState);
      return newState;
    });
  };
  useEffect(() => {
    FetchBrandAttribute();
    fetchColors();
    fetchOccastion();
    fetchImages();
    fetchMyShops();
    fetchBrand();
  }, []);

  const renderImageItem = ({item, index}) => {
    //console.log('Images if item render :', item);
    return (
      <View key={index}>
        <Image
          source={{uri: item.image_path}} // Change image_url to your actual image URL field
          style={{width: width, height: height * 0.59}}
        />
      </View>
    );
  };

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[BrandAttributeStyle.label, isFocus && {color: 'blue'}]}>
          Select Brand
        </Text>
      );
    }
    return null;
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <Header />
        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.EditImages, itemsImages)}
          style={{
            position: 'absolute',
            zIndex: 0.5,
            marginTop: 70,
            marginLeft: 360,
          }}>
          <PencilSquareIcon size={20} color="black" />
        </TouchableOpacity>
        {itemsImages.length > 0 && (
          <Carousel
            data={itemsImages}
            renderItem={renderImageItem}
            sliderWidth={width}
            itemWidth={width}
            layout={'default'}
            autoplay={true}
            autoplayInterval={3000}
          />
        )}
        <View style={{marginLeft: 12}}>
          <View>
            <TextInput
              style={{color: 'red', fontWeight: 'bold', fontSize: 20}}
              placeholder="Enter Name"
              value={newName}
              onChangeText={input => setNewName(input)}
            />
            <TextInput
              style={{
                color: 'black',
                fontWeight: 'bold',
                marginBottom: -15,
                marginTop: -15,
                marginLeft: -4,
              }}
              value={newPrice}
              onChangeText={input => setNewPrice(input)}
            />

            <View>
              <View>
                <Text style={{color: 'black', fontWeight: 'bold'}}>
                  Description
                </Text>
                <TextInput
                  style={{marginTop: -10, marginBottom: -8, marginLeft: -4}}
                  value={newDescription}
                  onChangeText={input => setNewDescription(input)}
                />
              </View>
              <View>
                <Text>Map</Text>
              </View>
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
                <View style={{marginTop: -10, marginLeft: 28}}>
                  {/* <Text style={{marginLeft: 45}}>{itemBrand}</Text> */}
                  <View style={BrandAttributeStyle.container}>
                    {renderLabel()}
                    <Dropdown
                      style={[
                        BrandAttributeStyle.dropdown,
                        isFocus && {borderColor: 'blue'},
                      ]}
                      placeholderStyle={BrandAttributeStyle.placeholderStyle}
                      selectedTextStyle={BrandAttributeStyle.selectedTextStyle}
                      inputSearchStyle={BrandAttributeStyle.inputSearchStyle}
                      iconStyle={BrandAttributeStyle.iconStyle}
                      data={data}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Select Brand' : '...'}
                      searchPlaceholder="Search..."
                      value={value}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setValue(item.value);
                        console.log(item.value);
                        setIsFocus(false);
                      }}
                      renderLeftIcon={() => (
                        <AtSymbolIcon
                          style={BrandAttributeStyle.icon}
                          color={isFocus ? 'red' : 'green'}
                          name="Safety"
                          size={16}
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Colour</Text>

                {/*
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
                */}
              </View>
              <View style={{marginLeft: 80, marginTop: -20}}>
                {itemsColour.map((item, index) => (
                  <CheckBox
                    key={index}
                    isChecked={selectedColour.includes(item.id)}
                    onClick={() => handleColourCheck(item.id)}
                    rightText={item.colour}
                    rightTextStyle={{
                      fontSize: 13,
                      color: selectedColour.includes(item.id)
                        ? 'green'
                        : 'black',
                      fontWeight: 'bold',
                    }}
                    checkedCheckBoxColor="green"
                    uncheckedCheckBoxColor="black"
                  />
                ))}
              </View>
              <View style={{marginLeft: 80}}>
                {colourData.map((item, index) => (
                  <CheckBox
                    key={index}
                    isChecked={selectedColour.includes(item.id)}
                    onClick={() => handleColourCheck(item.id)}
                    rightText={item.colour}
                    rightTextStyle={{
                      fontSize: 13,
                      color: selectedColour.includes(item.id)
                        ? 'green'
                        : 'gray',
                      fontWeight: 'bold',
                    }}
                    checkedCheckBoxColor="green"
                    uncheckedCheckBoxColor="black"
                  />
                ))}
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

                {/*
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
                  */}
              </View>
              <View style={{marginLeft: 80, marginTop: -20}}>
                {itemsOccasion.map(item => (
                  <CheckBox
                    key={item.id}
                    isChecked={selectedOccasions.includes(item.id)}
                    onClick={() => handleOccasionCheck(item.id)}
                    rightText={item.name}
                    rightTextStyle={{
                      fontSize: 13,
                      color: selectedOccasions.includes(item.id)
                        ? 'green'
                        : 'gray',
                      fontWeight: 'bold',
                    }}
                    checkedCheckBoxColor="green"
                    uncheckedCheckBoxColor="black"
                  />
                ))}
                {occasionData.map(item => (
                  <CheckBox
                    key={item.id}
                    isChecked={selectedOccasions.includes(item.id)}
                    onClick={() => handleOccasionCheck(item.id)}
                    rightText={item.name}
                    rightTextStyle={{
                      fontSize: 13,
                      color: selectedOccasions.includes(item.id)
                        ? 'green'
                        : 'gray',
                      fontWeight: 'bold',
                    }}
                    checkedCheckBoxColor="green"
                    uncheckedCheckBoxColor="black"
                  />
                ))}
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text
                  style={{color: 'black', fontWeight: 'bold', marginTop: 12}}>
                  Fabric
                </Text>
                <View style={BrandAttributeStyle.container}>
                  {renderLabel()}
                  <Dropdown
                    style={[
                      BrandAttributeStyle.dropdown,
                      isFocus && {borderColor: 'blue'},
                    ]}
                    placeholderStyle={BrandAttributeStyle.placeholderStyle}
                    selectedTextStyle={BrandAttributeStyle.selectedTextStyle}
                    inputSearchStyle={BrandAttributeStyle.inputSearchStyle}
                    iconStyle={BrandAttributeStyle.iconStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select Brand' : '...'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setValue(item.value);
                      console.log(item.value);
                      setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                      <AtSymbolIcon
                        style={BrandAttributeStyle.icon}
                        color={isFocus ? 'red' : 'green'}
                        name="Safety"
                        size={16}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 10,
            }}>
            <TouchableOpacity
              style={{
                borderWidth: 0.5,
                backgroundColor: 'gray',
                display: 'flex',
                flexDirection: 'row',
                marginHorizontal: 'auto',
                paddingLeft: 50,
                paddingRight: 50,
                paddingTop: 5,
                borderRadius: 10,
              }}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>
                Save
              </Text>
              <PencilSquareIcon size={20} color={'red'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 0.5,
                backgroundColor: 'gray',
                display: 'flex',
                flexDirection: 'row',
                marginHorizontal: 'auto',
                paddingLeft: 50,
                paddingRight: 40,
                paddingTop: 5,
                borderRadius: 10,
              }}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>
                Cancel
              </Text>
              <TrashIcon size={20} color={'red'} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const BrandAttributeStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: 250,
    fontSize: 13,
    padding: 16,
  },
  dropdown: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 13,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 13,
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 13,
  },
  selectedTextStyle: {
    fontSize: 13,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 13,
  },
});
