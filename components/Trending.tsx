import { useState } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { CustomAnimation } from 'react-native-animatable';
import * as Animatable from 'react-native-animatable';
import { FlatList, TouchableOpacity, ImageBackground, Image, ViewToken } from 'react-native';
import { icons } from '../constants';
import { Models } from 'react-native-appwrite';


const zoomIn: CustomAnimation = {
  0: {
    transform: [{ scale: 0.9 }]
  },
  1: {
   transform: [{ scale: 1.1 }]
  },
};

const zoomOut: CustomAnimation = {
  0: {
    transform: [{ scale: 1.1 }]
  },
  1: {
   transform: [{ scale: 0.9 }]
  },
};

interface TrendingItemProps {
  activeItem: string;
  item: Models.Document;
}

const TrendingItem: React.FC<TrendingItemProps> = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (!status.isLoaded) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

interface TrendingProps {
  posts: Models.Document[];
}

const Trending: React.FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[1]?.$id || '');

  const viewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => <TrendingItem activeItem={activeItem} item={item} />}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentContainerStyle={{ paddingLeft: 170 }}
    />
  );
};

export default Trending;