import {Dimensions, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 375; // iPhone 6/7/8 width
const guidelineBaseHeight = 667; // iPhone 6/7/8 height

const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export {scale, verticalScale, moderateScale};
