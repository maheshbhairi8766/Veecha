import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Placesearch from 'react-native-placesearch';

const PlaceSearchComponent = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Placesearch
        apiKey="AIzaSyC7u4_1QP4fLl3CcJfo0cWmcEI-HHax3F8"
        onChangeText={data => console.log(data)} // required *
        onClose={data => console.log(data)}
        country="INDIA" // optional
        coordinate={true} // optional
        removeImg={true} // optional
        StatusBarColor="#FF5733" // optional *only for android
        StatusBarStyle="light-content" // optional default "dark-content" *only for android
        ContainerBackgroundColor="#FFF" // optional
        InputContainer={styles.inputContainer} // optional
        MainContainer={styles.mainContainer} // optional
        ListStyle={styles.listStyle} // optional
        ListTextStyle={styles.listTextStyle} // optional
        ListIconStyle={styles.listIconStyle} // optional
        ImgStyle={styles.imgStyle} // optional
        Img={styles.img} // optional
        textInput={styles.textInput} // optional
        placeHolder="Search for places" // optional
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  inputContainer: {
    // your styles here
  },
  mainContainer: {
    // your styles here
  },
  listStyle: {
    // your styles here
  },
  listTextStyle: {
    // your styles here
  },
  listIconStyle: {
    // your styles here
  },
  imgStyle: {
    // your styles here
  },
  img: {
    // your styles here
  },
  textInput: {
    // your styles here
  },
});

export default PlaceSearchComponent;
