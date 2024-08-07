import React, {useState} from 'react';
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
  ShareIcon,
  StarIcon,
} from 'react-native-heroicons/solid';
import {HeartIcon as HeartIconOutline} from 'react-native-heroicons/outline';
import {HeartIcon as HeartIconSolid} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';

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
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const [fav, setFav] = useState(false);
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {CardData.map((item, index) => {
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
                  onPress={() => (fav ? setFav(false) : setFav(true))}
                  style={{
                    position: 'absolute',
                    zIndex: 0.5,
                    marginLeft: 152,
                    marginTop: 5,
                  }}>
                  <HeartIconOutline size={19} color="black" />
                </TouchableOpacity>

                <Image
                  style={{
                    height: height * 0.3,
                    width: width * 0.45,
                    overflow: 'hidden',
                  }}
                  source={{
                    uri: item.image || DummyImage,
                  }}
                />

                <View
                  style={{
                    borderBottomWidth: 0.2,
                    borderBlockColor: 'gray',
                  }}>
                  <Text style={{color: 'blue', fontWeight: 'bold'}}>
                    {item.title}
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
                      {item.price}
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
