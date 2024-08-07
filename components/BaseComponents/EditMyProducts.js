import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from '../../createClinet';
import {launchImageLibrary} from 'react-native-image-picker';
import {DummyImage} from './CardView';
import {ContinousBaseGesture} from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

export default function EditMyProducts({data}) {
  const [res, setRes] = useState([]);
  const [media, setMedia] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const route = useRoute();
  const item = route.params;

  useEffect(() => {
    setName(item.name);
    setDescription(item.description);
    setPrice(String(item.price));
    setNewName(item.name);
    setNewDescription(item.description);
    setNewPrice(String(item.price));
    setImageUrl(item.image_path);
    console.log(item.image_path);
  }, [item]);

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
        console.error('Error uploading image:', error);
        return null;
      }

      const {data: publicUrlData, error: publicUrlError} =
        await supabase.storage.from('images').getPublicUrl(fileName);

      if (publicUrlError) {
        console.error('Error getting public URL:', publicUrlError);
        return null;
      }

      const imageUrlInput = publicUrlData.publicUrl;
      console.log('Public URL:', imageUrlInput);
      console.log('image url as input : ', imageUrlInput);
      console.log('image Url by default', item.image_path);
      setImageUrl(imageUrlInput);

      const {data: insertData, error: insertError} = await supabase
        .from('item_images')
        .update({image_path: imageUrlInput})
        .eq('item_id', item.id);

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
  const UpdateItem = async () => {
    const {data, error} = await supabase
      .from('items')
      .update({
        name: newName,
        description: newDescription,
        price: newPrice,
        image_path: imageUrl,
      })
      .eq('id', item.id);
    afterAddingItems();
    if (error) {
      console.error('Error updating item:', error);
    } else {
      console.log('Item updated successfully:', data);
    }
  };

  useEffect(() => {
    if (item.id !== null) {
    }
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <Text style={{marginTop: 20}}>Name</Text>
        <TextInput
          placeholder="Enter item Name"
          value={newName}
          style={{borderBottomWidth: 0.5, width: 250, marginLeft: 20}}
          onChangeText={input => setNewName(input)}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <Text style={{marginTop: 20}}> Description</Text>
        <TextInput
          value={newDescription}
          placeholder="Enter item description"
          style={{
            borderBottomWidth: 0.5,
            width: 250,
            marginLeft: -10,
          }}
          onChangeText={input => setNewDescription(input)}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <Text style={{marginTop: 20}}>Price</Text>
        <TextInput
          value={newPrice}
          placeholder="Enter item price"
          style={{borderBottomWidth: 0.5, width: 250}}
          onChangeText={input => setNewPrice(input)}
        />
      </View>
      <View>
        <Image source={{uri: item.image_path}} />
      </View>
      <View style={{marginTop: 50, marginHorizontal: 'auto'}}>
        <Button title="Update Photo" onPress={handleChoosePhoto} />
        {media && <Image source={media} style={{width: 300, height: 300}} />}
      </View>
      <TouchableOpacity
        onPress={UpdateItem} // Correct the onPress function call
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
          Edit Item
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
