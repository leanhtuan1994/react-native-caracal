import { Image } from 'react-native';

export function BrandMark() {
  return (
    <Image
      source={require('../../../assets/icon.png')}
      className="size-[38px] rounded-xl"
      accessible={false}
    />
  );
}
