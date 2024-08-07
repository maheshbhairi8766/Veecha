import {Dimensions, StyleSheet} from 'react-native';
var {width, height} = Dimensions.get('window');
const SearchStyle = StyleSheet.create({
  inputSearch: {
    marginTop: 20,
    borderWidth: 0.5,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 15,
    paddingLeft: 20,
    width: 320,
    borderColor: 'white',
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  cancel: {
    borderColor: 'white',
    borderWidth: 0.5,
    marginTop: 20,
    height: 50,
    marginRight: 9,
    borderRadius: 50,
  },
  result: {
    color: 'white',
    marginTop: 5,
    marginLeft: 15,
    marginBottom: 10,
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  img: {
    marginHorizontal: 'auto',
    borderRadius: 300,
    overflow: 'hidden',
    width: width * 0.6,
    height: height * 0.3,
    marginTop: 30,
    marginBottom: 410,
  },
});

export default SearchStyle;
