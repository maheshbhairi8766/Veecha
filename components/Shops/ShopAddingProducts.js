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

const ShopAddingProducts = () => {
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

  const route = useRoute();
  const item = route.params;
  const {shopId, vendorId, userId} = useContext(ShopContext);
  const [media, setMedia] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [itemId, setItemId] = useState(null);
  const [res, setRes] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [data, setData] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();
  if (item) {
    console.log('Add Products By shop  , Shop Id: ', item.id);
  }
  console.log('Add Products By shop User id: ', userId.id_user);
  //const navigation = useNavigation();

  const handleChoosePhoto = async () => {
    const options = {mediaType: 'photo'};
    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log(response);
        setRes(response);
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
    }
  };

  const uploadToSupabase = async file => {
    const fileUri = file.uri;
    const fileName = fileUri.split('/').pop();

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: file.type,
    });

    try {
      const {data, error} = await supabase.storage
        .from('images')
        .upload(fileName, formData);

      if (error) {
        // console.log('Error uploading image:', error);
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
      setImageUrl(imageUrl);

      const {data: insertData, error: insertError} = await supabase
        .from('item_images')
        .insert([{image_path: imageUrl, item_id: itemId}]);

      if (insertError) {
        console.error('Error inserting product data:', insertError);
        return null;
      } else {
        console.log('Product data inserted successfully:', data);
        return data;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };

  const afterAddingItems = async () => {
    const response = res;
    const options = {mediaType: 'photo'};
    try {
      const source = {uri: response.assets[0].uri};
      setMedia(source);

      const uploadResult = await uploadToSupabase(response.assets[0]);

      if (uploadResult) {
        Alert.alert('Upload Successful', 'Your file has been uploaded.');
      } else {
        //Alert.alert('Upload Failed', 'There was an error uploading your file.');
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
    }
  };

  async function addItemm() {
    const {data, error} = await supabase
      .from('items')
      .insert([
        {
          image_path: imageUrl,
          name: name,
          description: description,
          price: price,
          shop_id: item.id,
          brand_attribute_value_id: value,
          created_by: item.id,
          owner_id: userId.id_user,
        },
      ])
      .select('id');

    //inserting data into the 'items_inventory'
    const {data: inventoryData, error: inventoryError} = await supabase
      .from('items_inventory')
      .insert([
        {
          image_path: imageUrl,
          name: name,
          description: description,
          base_price: price,
          shop_id: item.id,
          brand_attribute_value_id: value,
          user_id: userId.id_user,
          created_by: item.id,
          owner_id: userId.id_user,
        },
      ]);

    console.log('data return after adding item', data[0].id);
    setItemId(data[0].id);

    console.log('My Item id is ::->', itemId);

    const occasionInsertData = selectedOccasions.map(occasionId => ({
      item_id: itemId,
      occasion_id: occasionId,
    }));
    const {error: occasionError} = await supabase
      .from('item_occasion')
      .insert(occasionInsertData);

    if (occasionError) {
      console.log('Error in items_Occation');
    }

    if (error) {
      console.log('Error hey yaha', error.message);
    }
    if (inventoryError) {
      console.log(
        'Error inserting into items_inventory:',
        inventoryError.message,
      );
    } else {
      console.log('Item added successfully');
      navigation.navigate(Routes.ShopView);
    }
  }

  useEffect(() => {
    if (res !== null) {
      afterAddingItems();
    }
  }, [res]);

  useEffect(() => {
    if (imageUrl) {
      addItemm();
    }
  }, [imageUrl]);

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
  useEffect(() => {
    FetchBrandAttribute();
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

  return (
    <View>
      <ScrollView>
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
            <Text style={{fontSize: 20}}>Select Colour</Text>
            <View>
              <CheckBox
                isChecked={isChecked.Green}
                onClick={() =>
                  setIsChecked({...isChecked, Green: !isChecked.Green})
                }
                rightText="Green"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Green ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
              <CheckBox
                isChecked={isChecked.Black}
                onClick={() =>
                  setIsChecked({...isChecked, Black: !isChecked.Black})
                }
                rightText="Black"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Black ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
              <CheckBox
                isChecked={isChecked.Blue}
                onClick={() =>
                  setIsChecked({...isChecked, Blue: !isChecked.Blue})
                }
                rightText="Blue"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Blue ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
              <CheckBox
                isChecked={isChecked.Pink}
                onClick={() =>
                  setIsChecked({...isChecked, Pink: !isChecked.Pink})
                }
                rightText="Pink"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Pink ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
              <CheckBox
                isChecked={isChecked.Brown}
                onClick={() =>
                  setIsChecked({...isChecked, Brown: !isChecked.Brown})
                }
                rightText="Brown"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Brown ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
              <CheckBox
                isChecked={isChecked.Yellow}
                onClick={() =>
                  setIsChecked({...isChecked, Yellow: !isChecked.Yellow})
                }
                rightText="Yellow"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Yellow ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
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

          {/*
          <View style={{marginTop: 50, marginHorizontal: 'auto'}}>
            <Button title="Choose Photo" onPress={handleChoosePhoto} />
            {media && (
              <Image source={media} style={{width: 300, height: 300}} />
            )}
          </View>
          */}
          <TouchableOpacity
            onPress={addItemm}
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
      </ScrollView>
    </View>
  );
};

export default ShopAddingProducts;

{
  /*
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

const ShopAddingProducts = () => {
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

  const route = useRoute();
  const item = route.params;
  const {shopId, vendorId, userId} = useContext(ShopContext);
  const [media, setMedia] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [itemId, setItemId] = useState(null);
  const [res, setRes] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [data, setData] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();
  if (item) {
    console.log('Add Products By shop  , Shop Id: ', item.id);
  }
  console.log('Add Products By shop User id: ', userId.id_user);
  //const navigation = useNavigation();

  const handleChoosePhoto = async () => {
    const options = {mediaType: 'photo'};
    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log(response);
        setRes(response);
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
    }
  };

  const uploadToSupabase = async file => {
    const fileUri = file.uri;
    const fileName = fileUri.split('/').pop();

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: file.type,
    });

    try {
      const {data, error} = await supabase.storage
        .from('images')
        .upload(fileName, formData);

      if (error) {
        // console.log('Error uploading image:', error);
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
      setImageUrl(imageUrl);

      const {data: insertData, error: insertError} = await supabase
        .from('item_images')
        .insert([{image_path: imageUrl, item_id: itemId}]);

      if (insertError) {
        console.error('Error inserting product data:', insertError);
        return null;
      } else {
        console.log('Product data inserted successfully:', data);
        return data;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };

  const afterAddingItems = async () => {
    const response = res;
    const options = {mediaType: 'photo'};
    try {
      const source = {uri: response.assets[0].uri};
      setMedia(source);

      const uploadResult = await uploadToSupabase(response.assets[0]);

      if (uploadResult) {
        Alert.alert('Upload Successful', 'Your file has been uploaded.');
      } else {
        //Alert.alert('Upload Failed', 'There was an error uploading your file.');
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
    }
  };

  async function addItemm() {
    const {data, error} = await supabase
      .from('items')
      .insert([
        {
          image_path: imageUrl,
          name: name,
          description: description,
          price: price,
          shop_id: item.id,
          brand_attribute_value_id: value,
          created_by: item.id,
          owner_id: userId.id_user,
        },
      ])
      .select('id');

    //inserting data into the 'items_inventory'
    const {data: inventoryData, error: inventoryError} = await supabase
      .from('items_inventory')
      .insert([
        {
          image_path: imageUrl,
          name: name,
          description: description,
          base_price: price,
          shop_id: item.id,
          brand_attribute_value_id: value,
          user_id: userId.id_user,
          created_by: item.id,
          owner_id: userId.id_user,
        },
      ]);

    console.log('data return after adding item', data[0].id);
    setItemId(data[0].id);

    console.log('My Item id is ::->', itemId);

    const occasionInsertData = selectedOccasions.map(occasionId => ({
      item_id: itemId,
      occasion_id: occasionId,
    }));
    const {error: occasionError} = await supabase
      .from('item_occasion')
      .insert(occasionInsertData);

    if (occasionError) {
      console.log('Error in items_Occation');
    }

    if (error) {
      console.log('Error hey yaha', error.message);
    }
    if (inventoryError) {
      console.log(
        'Error inserting into items_inventory:',
        inventoryError.message,
      );
    } else {
      console.log('Item added successfully');
      navigation.navigate(Routes.ShopView);
    }
  }

  useEffect(() => {
    if (res !== null) {
      afterAddingItems();
    }
  }, [res]);

  useEffect(() => {
    if (imageUrl) {
      addItemm();
    }
  }, [imageUrl]);

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
  useEffect(() => {
    FetchBrandAttribute();
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

  return (
    <View>
      <ScrollView>
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
            <Text style={{fontSize: 20}}>Select Colour</Text>
            <View>
              <CheckBox
                isChecked={isChecked.Green}
                onClick={() =>
                  setIsChecked({...isChecked, Green: !isChecked.Green})
                }
                rightText="Green"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Green ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
              <CheckBox
                isChecked={isChecked.Black}
                onClick={() =>
                  setIsChecked({...isChecked, Black: !isChecked.Black})
                }
                rightText="Black"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Black ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
              <CheckBox
                isChecked={isChecked.Blue}
                onClick={() =>
                  setIsChecked({...isChecked, Blue: !isChecked.Blue})
                }
                rightText="Blue"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Blue ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
              <CheckBox
                isChecked={isChecked.Pink}
                onClick={() =>
                  setIsChecked({...isChecked, Pink: !isChecked.Pink})
                }
                rightText="Pink"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Pink ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
              <CheckBox
                isChecked={isChecked.Brown}
                onClick={() =>
                  setIsChecked({...isChecked, Brown: !isChecked.Brown})
                }
                rightText="Brown"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Brown ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
              <CheckBox
                isChecked={isChecked.Yellow}
                onClick={() =>
                  setIsChecked({...isChecked, Yellow: !isChecked.Yellow})
                }
                rightText="Yellow"
                rightTextStyle={{
                  fontSize: 19,
                  color: isChecked.Yellow ? 'green' : 'black',
                  fontWeight: 'bold',
                }}
                checkedCheckBoxColor="green"
                uncheckedCheckBoxColor="black"
              />
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

          <View style={{marginTop: 50, marginHorizontal: 'auto'}}>
            <Button title="Choose Photo" onPress={handleChoosePhoto} />
            {media && (
              <Image source={media} style={{width: 300, height: 300}} />
            )}
          </View>
          <TouchableOpacity
            onPress={addItemm}
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
      </ScrollView>
    </View>
  );
};

export default ShopAddingProducts;
*/
}

{
  /*import React, { useContext, useEffect, useState } from 'react';
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
import { launchImageLibrary } from 'react-native-image-picker';
import { supabase } from '../../createClinet';
import { Routes } from '../../navigation/Routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import ShopContext from '../../context/ShopContext';
import { BrandAttributeStyle } from '../styles/BrandAttributeStyle';
import { Dropdown } from 'react-native-element-dropdown';
import { AtSymbolIcon } from 'react-native-heroicons/outline';
import CheckBox from 'react-native-check-box';

const ShopAddingProducts = () => {
  const occasionData = [
    { value: '1', name: 'Wedding' },
    { value: '2', name: 'Traditional attire' },
    { value: '3', name: 'Formal wear' },
    { value: '4', name: 'Business Outfit' },
    { value: '5', name: 'Festive attire' },
    { value: '6', name: 'Stylish attire' },
    { value: '7', name: 'Religious' },
    { value: '8', name: 'Jumpsuits' },
    { value: '9', name: 'Midi Dresses' },
    { value: '10', name: 'Blazers & Trousers' },
    { value: '11', name: 'Skirt & Blouse' },
    { value: '12', name: 'Summer' },
  ];

  const [isChecked, setIsChecked] = useState({
    Green: false,
    Yellow: false,
    Blue: false,
    Pink: false,
    Brown: false,
    Black: false,
  });

  const route = useRoute();
  const item = route.params;
  const { shopId, vendorId, userId } = useContext(ShopContext);
  const [media, setMedia] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [itemId, setItemId] = useState(null);
  const [res, setRes] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [data, setData] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();
  if (item) {
    console.log('Add Products By shop  , Shop Id: ', item.id);
  }
  console.log('Add Products By shop User id: ', userId.id_user);

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
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, { uri: fileUri, name: fileName, type: file.type });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      const { data: publicUrlData, error: publicUrlError } = await supabase.storage.from('images').getPublicUrl(fileName);

      if (publicUrlError) {
        console.error('Error getting public URL:', publicUrlError);
        return null;
      }

      const imageUrl = publicUrlData.publicUrl;
      console.log('Public URL:', imageUrl);

      const { data: insertData, error: insertError } = await supabase
        .from('item_images')
        .insert([{ image_path: imageUrl, item_id: itemId }]);

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

  const afterAddingItems = async (itemId) => {
    const uploadPromises = res.map((file) => uploadToSupabase(file, itemId));
    const uploadResults = await Promise.all(uploadPromises);

    const successfulUploads = uploadResults.filter((result) => result !== null);

    if (successfulUploads.length === res.length) {
      Alert.alert('Upload Successful', 'All files have been uploaded.');
    } else {
      Alert.alert('Upload Failed', 'Some files failed to upload.');
    }
  };

  const addItemm = async () => {
    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          name: name,
          description: description,
          price: price,
          shop_id: item.id,
          brand_attribute_value_id: value,
          created_by: item.id,
          owner_id: userId.id_user,
        },
      ])
      .select('id');

    if (error) {
      console.log('Error inserting item:', error.message);
      return;
    }

    const itemId = data[0].id;
    setItemId(itemId);

    const occasionInsertData = selectedOccasions.map((occasionId) => ({
      item_id: itemId,
      occasion_id: occasionId,
    }));
    const { error: occasionError } = await supabase
      .from('item_occasion')
      .insert(occasionInsertData);

    if (occasionError) {
      console.log('Error inserting item occasions:', occasionError.message);
    }

    await afterAddingItems(itemId);

    navigation.navigate(Routes.ShopView);
  };

  useEffect(() => {
    if (res.length > 0) {
      addItemm();
    }
  }, [res]);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[BrandAttributeStyle.label, isFocus && { color: 'blue' }]}>
          Select Brand
        </Text>
      );
    }
    return null;
  };

  const FetchBrandAttribute = async () => {
    const { data, error } = await supabase.from('attribute_values').select('*');
    if (error) {
      console.error(error);
      return;
    }

    const transformedData = data.map((item) => ({
      label: item.value,
      value: item.id,
    }));

    setData(transformedData);
  };
  useEffect(() => {
    FetchBrandAttribute();
  }, []);
  const handleOccasionCheck = (occasionId) => {
    setSelectedOccasions((prev) => {
      if (prev.includes(occasionId)) {
        return prev.filter((id) => id !== occasionId);
      } else {
        return [...prev, occasionId];
      }
    });
  };

  return (
    <View>
      <ScrollView>
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
              style={{ borderBottomWidth: 0.5, width: 250 }}
              onChangeText={(input) => setName(input)}
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
              style={{ borderBottomWidth: 0.5, width: 250, marginLeft: -30 }}
              onChangeText={(input) => setDescription(input)}
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
              style={{ borderBottomWidth: 0.5, width: 250 }}
              onChangeText={(input) => setPrice(input)}
            />
          </View>
          <View>
            {data && (
              <View style={BrandAttributeStyle.container}>
                {renderLabel()}
                <Dropdown
                  style={[
                    BrandAttributeStyle.dropdown,
                    isFocus && { borderColor: 'blue' },
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
                  placeholder={!isFocus ? 'Select brand' : '...'}
                  searchPlaceholder="Search..."
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setValue(item.value);
                    setIsFocus(false);
                  }}
                />
              </View>
            )}
          </View>

          <View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'center',
                marginTop: 20,
              }}>
              Select Occasions
            </Text>
            {occasionData.map((occasion) => (
              <CheckBox
                key={occasion.value}
                style={{ flex: 1, padding: 10 }}
                onClick={() => handleOccasionCheck(occasion.value)}
                isChecked={selectedOccasions.includes(occasion.value)}
                rightText={occasion.name}
              />
            ))}
          </View>

          <Button title="Choose Photos" onPress={handleChoosePhoto} />
        </View>
        <View style={{ marginBottom: 100 }}>
          {media.length > 0 && (
            <View>
              {media.map((m, index) => (
                <Image
                  key={index}
                  source={{ uri: m }}
                  style={{ width: 100, height: 100 }}
                />
              ))}
            </View>
          )}
          <TouchableOpacity
            onPress={addItemm}
            style={{
              backgroundColor: '#005249',
              height: 50,
              width: 150,
              marginLeft: 100,
              marginTop: 50,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                color: '#FFFFFF',
                textAlign: 'center',
                marginTop: 10,
              }}>
              Add Item
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopAddingProducts;
 */
}
