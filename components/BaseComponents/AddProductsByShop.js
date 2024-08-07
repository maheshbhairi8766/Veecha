import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Image,
  View,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
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

const AddProductsByShop = () => {
  const route = useRoute();
  const item = route.params;
  const {shopId} = useContext(ShopContext);
  const {vendorId} = useContext(ShopContext);
  const {userId} = useContext(ShopContext);
  const [media, setMedia] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [itemId, setItemId] = useState(null);
  const [res, setRes] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  console.log('Add Products By shop : ', item.id);
  const navigation = useNavigation();

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
        Alert.alert('Upload Failed', 'There was an error uploading your file.');
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
    }
  };

  async function addItemm() {
    afterAddingItems();
    const {data, error} = await supabase
      .from('items')
      .insert([
        {
          image_path: imageUrl,
          name: name,
          description: description,
          price: price,
          shop_id: shopId.id_shop,
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
    if (error) {
      console.log('Error hey yaha', error.message);
    } else {
      console.log('Item added successfully');
      navigation.navigate(Routes.Home);
    }

    if (inventoryError) {
      console.log(
        'Error inserting into items_inventory:',
        inventoryError.message,
      );
    } else {
      console.log('Item inventory added successfully:', inventoryData);
      navigation.navigate(Routes.AccountProducts);
    }
  }
  /*
  useEffect(() => {
    if (itemId !== null) {
      afterAddingItems();
    }
  }, [itemId]);
*/
  useEffect(() => {
    if (imageUrl) {
      addItemm();
    }
  }, [imageUrl]);

  const [data, setData] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

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
        <View style={{marginTop: 50, marginHorizontal: 'auto'}}>
          <Button title="Choose Photo" onPress={handleChoosePhoto} />
          {media && <Image source={media} style={{width: 300, height: 300}} />}
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
    </View>
  );
};

export default AddProductsByShop;
