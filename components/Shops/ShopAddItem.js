import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Image,
  View,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {supabase} from '../../createClinet';
import {Routes} from '../../navigation/Routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import ShopContext from '../../context/ShopContext';
import {BrandAttributeStyle} from '../styles/BrandAttributeStyle';
import {Dropdown} from 'react-native-element-dropdown';
import {AtSymbolIcon} from 'react-native-heroicons/outline';
import CheckBox from 'react-native-check-box';

const ShopAddItem = props => {
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

  //const colors
  const [isChecked, setIsChecked] = useState({
    Green: 'false',
    Yellow: 'false',
    Blue: 'false',
    Pink: 'false',
    Brown: 'false',
    Black: 'false',
  });

  //const route = useRoute(props);
  const item = props.item;
  //const item = route.params;
  const {shopId, vendorId, userId} = useContext(ShopContext);
  const [media, setMedia] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [itemId, setItemId] = useState(null);
  const [res, setRes] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedColour, setSelectedColour] = useState([]);
  const [data, setData] = useState([]);
  const [value, setValue] = useState(null);
  const [fabric, setFabric] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [colorData, setColorData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!item) {
      console.error("Route params 'item' is undefined");
      return;
    }

    console.log("Route params 'item':", item);
  }, [item]);

  const addItem = async () => {
    if (!item) {
      Alert.alert('Error', 'Item information is missing');
      return;
    }

    const {data: inventoryData, error: inventoryError} = await supabase
      .from('items_inventory')
      .insert([
        {
          name: name,
          description: description,
          base_price: price,
          shop_id: item.id,
          brand_attribute_value_id: value,
          user_id: userId.id_user,
          created_by: item.id,
          owner_id: userId.id_user,
          qty: quantity,
          fabric_attribute_value_id: fabric,
        },
      ])
      .select('id');

    if (inventoryError) {
      console.log('Error hey yaha', inventoryError.message);
      return; // Exit if there's an error
    }

    // Ensure inventoryData is not undefined and has at least one item
    if (inventoryData && inventoryData.length > 0) {
      setItemId(inventoryData[0].id);

      // Insert data into the 'shop_items'
      const {data: shopData, error: shopError} = await supabase
        .from('shop_items')
        .insert([
          {
            inventory_id: inventoryData[0].id,
            price: price,
            qty: quantity,
          },
        ]);

      if (shopError) {
        console.log('Error inserting into items :', shopError.message);
      } else {
        console.log('Item added successfully');
        navigation.navigate(Routes.ShopView);
      }
    } else {
      console.log('No inventory data returned');
    }
  };

  useEffect(() => {
    if (itemId) {
      console.log('My Item id is in UseEffect ::->', itemId);

      const addItemOccasions = async () => {
        const occasionInsertData = selectedOccasions.map(occasionId => ({
          item_id: itemId,
          occasion_id: occasionId,
        }));
        const {error: occasionError} = await supabase
          .from('item_occasion')
          .insert(occasionInsertData);

        if (occasionError) {
          console.log('Error in items_Occation:', occasionError.message);
        } else {
          console.log('Occasions added successfully');
        }
      };

      const addItemColour = async () => {
        const colourInsertData = selectedColour.map(colourId => ({
          item_id: itemId,
          colour_id: colourId,
        }));
        const {error: colourError} = await supabase
          .from('item_colour')
          .insert(colourInsertData);

        if (colourError) {
          console.log('Error in items_colour:', colourError.message);
        } else {
          console.log('Colour added successfully');
        }
      };

      addItemOccasions();
      addItemColour();
      afterAddingItems(itemId);
    }
  }, [itemId]);

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
  const renderColour = () => {
    if (value || isFocus) {
      return (
        <Text style={[BrandAttributeStyle.label, isFocus && {color: 'blue'}]}>
          Select Colour
        </Text>
      );
    }
    return null;
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
  const FetchColorAttribute = async () => {
    const {data, error} = await supabase.from('attribute_values').select('*');
    if (error) {
      console.error(error);
      return;
    }

    const transformedData = data.map(item => ({
      label: item.value, // Assuming 'value' is the field you want to display
      value: item.id, // Assuming 'id' is the unique identifier
    }));

    setColorData(transformedData);
  };
  useEffect(() => {
    FetchBrandAttribute();
    FetchColorAttribute();
  }, []);

  const handleOccasionCheck = occasionId => {
    setSelectedOccasions(prev => {
      if (prev.includes(occasionId)) {
        return prev.filter(id => id !== occasionId);
      } else {
        return [...prev, occasionId];
      }
    });
  };

  const handleColourCheck = colourId => {
    setSelectedColour(prev => {
      if (prev.includes(colourId)) {
        return prev.filter(id => id !== colourId);
      } else {
        return [...prev, colourId];
      }
    });
  };

  const [quantity, setQuantity] = useState('1');

  const handleQuantityChange = text => {
    // Ensure the input only contains numbers
    if (/^\d*$/.test(text)) {
      setQuantity(text);
    }
  };

  //Uploading images into supabase
  const handleChoosePhoto = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 0, // 0 means unlimited selection
    };
    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log(response);
        setRes(response.assets);
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
    }
  };

  const uploadToSupabase = async (file, itemId) => {
    const fileUri = file.uri;
    const fileName = fileUri.split('/').pop();

    try {
      const {data, error} = await supabase.storage
        .from('images')
        .upload(fileName, {uri: fileUri, name: fileName, type: file.type});

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      const {data: publicUrlData, error: publicUrlError} =
        await supabase.storage.from('images').getPublicUrl(fileName);

      if (publicUrlError) {
        console.error('Error getting public URL:', publicUrlError);
        return null;
      }

      const imageUrl = publicUrlData.publicUrl;
      console.log('Public URL:', imageUrl);

      const {data: insertData, error: insertError} = await supabase
        .from('item_images')
        .insert([{image_path: imageUrl, item_id: itemId}]);

      if (insertError) {
        console.error('Error inserting image data:', insertError);
        return null;
      } else {
        console.log('Image data inserted successfully:', insertData);
        return imageUrl;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };

  const afterAddingItems = async itemId => {
    const uploadPromises = res.map(file => uploadToSupabase(file, itemId));
    const uploadResults = await Promise.all(uploadPromises);

    const successfulUploads = uploadResults.filter(result => result !== null);

    if (successfulUploads.length === res.length) {
      Alert.alert('Upload Successful', 'All files have been uploaded.');
    } else {
      Alert.alert('Upload Failed', 'Some files failed to upload.');
    }
  };

  return (
    <View>
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text
            style={{
              marginTop: 20,
              fontWeight: 'bold',
              fontSize: 17,
            }}>
            Name{' '}
          </Text>
          <TextInput
            placeholder="Enter item name"
            style={{borderBottomWidth: 0.5, width: 250}}
            onChangeText={input => setName(input)}
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text
            style={{
              marginTop: 20,
              fontWeight: 'bold',
              fontSize: 17,
            }}>
            Description{' '}
          </Text>
          <TextInput
            placeholder="Enter item description"
            style={{borderBottomWidth: 0.5, width: 250, marginLeft: -30}}
            onChangeText={input => setDescription(input)}
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text
            style={{
              marginTop: 20,
              fontWeight: 'bold',
              fontSize: 17,
            }}>
            Price{' '}
          </Text>
          <TextInput
            placeholder="Enter item price"
            style={{borderBottomWidth: 0.5, width: 250}}
            onChangeText={input => setPrice(input)}
          />
        </View>
        <View style={{marginTop: 10}}>
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
                  color={isFocus ? 'blue' : 'black'}
                  name="Safety"
                  size={20}
                />
              )}
            />
          </View>
        </View>
        <View style={{marginLeft: 20, marginTop: 20}}>
          <Text style={{fontSize: 20, marginBottom: 4}}>Select Colour</Text>
          <View style={{display: 'flex'}}>
            {occasionData.map((item, index) => (
              <CheckBox
                key={index}
                isChecked={selectedColour.includes(item.value)}
                onClick={() => handleColourCheck(item.value)}
                rightText={item.name}
                rightTextStyle={{
                  fontSize: 19,
                  color: selectedColour.includes(item.value)
                    ? 'green'
                    : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
            ))}
          </View>
        </View>
        <View style={{marginLeft: 20, marginTop: 20}}>
          <Text style={{fontSize: 20, marginBottom: 4}}>Select Occasion</Text>
          <View style={{display: 'flex'}}>
            {occasionData.map((item, index) => (
              <CheckBox
                key={index}
                isChecked={selectedOccasions.includes(item.value)}
                onClick={() => handleOccasionCheck(item.value)}
                rightText={item.name}
                rightTextStyle={{
                  fontSize: 19,
                  color: selectedOccasions.includes(item.value)
                    ? 'green'
                    : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
            ))}
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <View style={BrandAttributeStyle.container}>
            {renderColour()}
            <Dropdown
              style={[
                BrandAttributeStyle.dropdown,
                isFocus && {borderColor: 'blue'},
              ]}
              placeholderStyle={BrandAttributeStyle.placeholderStyle}
              selectedTextStyle={BrandAttributeStyle.selectedTextStyle}
              inputSearchStyle={BrandAttributeStyle.inputSearchStyle}
              iconStyle={BrandAttributeStyle.iconStyle}
              data={colorData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Fabric' : '...'}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setFabric(item.value);
                console.log('Fabric id:', item.value);
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <AtSymbolIcon
                  style={BrandAttributeStyle.icon}
                  color={isFocus ? 'blue' : 'black'}
                  name="Safety"
                  size={20}
                />
              )}
            />
          </View>
        </View>
        {/*
          <View style={{marginTop: 50, marginHorizontal: 'auto'}}>
            <Button title="Choose Photo" onPress={handleChoosePhoto} />
            {media && (
              <Image source={media} style={{width: 300, height: 300}} />
            )}
          </View>
          */}

        <Button title="Choose Photos" onPress={handleChoosePhoto} />
        <View style={{marginBottom: 100}}>
          {media.length > 0 && (
            <View>
              {media.map((m, index) => (
                <Image
                  key={index}
                  source={{uri: m}}
                  style={{width: 100, height: 100}}
                />
              ))}
            </View>
          )}
        </View>
        <View
          style={{
            marginLeft: 20,
            marginTop: 20,
            display: 'flex',
            flexDirection: 'row',
          }}>
          <Text style={{fontSize: 18, marginTop: 15}}>Qty :</Text>
          <TextInput
            placeholder="Enter Qty"
            //style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={handleQuantityChange}
          />
        </View>
        <TouchableOpacity
          onPress={addItem}
          style={{
            backgroundColor: 'blue',
            padding: 8,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 20,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 18,
              marginHorizontal: 'auto',
            }}>
            Add Item
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShopAddItem;
