import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {StarIcon} from 'react-native-heroicons/solid';
import {Routes} from '../../navigation/Routes';

const SimilarData = [
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

var {width, height} = Dimensions.get('window');
export default function SimilarStyles() {
  const navigation = useNavigation();
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  return (
    <SafeAreaView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {SimilarData.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.ProductDetail, item)}
              key={index}
              style={{
                borderWidth: 0.1,
                marginRight: 10,
                marginBottom: 10,
                marginTop: 5,
              }}>
              <Image
                style={{width: width * 0.3, height: height * 0.2}}
                source={{uri: item.image}}
              />
              <View style={{marginLeft: 6}}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>
                  {item.title}
                </Text>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{color: 'black', marginRight: 15}}>Price</Text>
                  <Text style={{color: 'red', fontWeight: 'bold'}}>
                    {item.price}
                  </Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{color: 'black', marginRight: 5}}>Rating</Text>
                  {star.map((item, index) => {
                    return (
                      <StarIcon
                        key={index}
                        style={{marginTop: 5}}
                        color="black"
                        size={12}
                      />
                    );
                  })}
                </View>
                <TouchableOpacity
                  style={{
                    borderWidth: 0.5,
                    borderColor: 'red',
                    marginHorizontal: 'auto',
                    paddingLeft: 12,
                    paddingRight: 12,
                    marginRight: 8.5,
                    marginTop: 6,
                    marginBottom: 6,
                  }}>
                  <Text style={{color: 'black'}}>Want to Buy</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
