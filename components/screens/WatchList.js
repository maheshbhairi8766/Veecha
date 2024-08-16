import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import Header from '../BaseComponents/Header';
import SearchBar from '../BaseComponents/SearchBar';
import ShopContext from '../../context/ShopContext';
import {supabase} from '../../createClinet';
import {DummyImage} from '../BaseComponents/CardView';
import WatchListCardView from '../WatchList/WatchListCardView';
import WatchListInventoryCardView from '../WatchList/WatchListInventoryCardView';

export default function WatchList() {
  const [items, setItems] = useState(true);
  const [fav, setFav] = useState(true);
  const handleSwitchInventory = () => {
    setFav(false);
    setItems(false);
  };
  const handleSwitchItem = () => {
    setFav(true);
    setItems(true);
  };
  return (
    <SafeAreaView>
      <Header />
      <SearchBar />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginHorizontal: 'auto',
          marginTop: 10,
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={handleSwitchItem}
          style={{
            borderWidth: 0.5,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 5,
            marginRight: 5,
            borderRadius: 30,
            backgroundColor: fav ? 'red' : 'white',
          }}>
          <Text
            style={{
              fontSize: 18,
              color: fav ? 'white' : 'black',
              fontWeight: fav ? 'bold' : '',
              paddingTop: 4,
            }}>
            Items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSwitchInventory}
          style={{
            borderWidth: 0.5,
            borderRadius: 30,
            backgroundColor: fav ? 'white' : 'red',
            height: 35,
            marginHorizontal: 'auto',
          }}>
          <Text
            style={{
              fontSize: 18,
              color: fav ? 'black' : 'white',
              fontWeight: fav ? '' : 'bold',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 5,
            }}>
            Inventory Items
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {items ? (
          <View>
            <WatchListCardView />
          </View>
        ) : (
          <WatchListInventoryCardView />
        )}
      </View>
    </SafeAreaView>
  );
}
