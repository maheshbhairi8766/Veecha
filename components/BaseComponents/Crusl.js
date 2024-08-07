import React from 'react';
import {Dimensions, Image, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';

var {width, height} = Dimensions.get('window');
export default function Crusl({data}) {
  return (
    <View>
      <Carousel
        data={data}
        renderItem={({item}) => <Card item={item} />}
        firstItem={1}
        inactiveSlideOpacity={0.5}
        sliderWidth={width}
        itemWidth={width * 0.62}
        slideStyle={{display: 'flex', alignItems: 'center'}}
      />
    </View>
  );
}
const Card = ({item}) => {
  return (
    <TouchableOpacity>
      <Image
        source={{uri: item.image_path}}
        style={{
          height: height * 0.5,
          width: width * 0.6,
          borderRadius: 20,
          margin: 10,
        }}
      />
    </TouchableOpacity>
  );
};
