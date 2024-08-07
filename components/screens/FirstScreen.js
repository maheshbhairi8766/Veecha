import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';

export default function FirstScreen() {
  return (
    <SafeAreaView>
      <TouchableOpacity>
        <Text>User</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Shop</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Vendor</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Admin</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
