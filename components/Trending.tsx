import { useState, useEffect } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';
import { CustomAnimation } from 'react-native-animatable';
import * as Animatable from 'react-native-animatable';
import { FlatList, TouchableOpacity, ImageBackground, Image, ViewToken, View, Dimensions } from 'react-native';
import { icons } from '../constants';
import { Models } from 'react-native-appwrite';

const { width: screenWidth } = Dimensions.get('window');

// Optimized animations - less dramatic for smoother feel
const zoomIn: CustomAnimation = {
  0: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9
  },
  1: {
   transform: [{ scale: 1 }],
   opacity: 1
  },
};

const zoomOut: CustomAnimation = {
  0: {
    transform: [{ scale: 1 }],
    opacity: 1
  },
  1: {
   transform: [{ scale: 0.95 }],
   opacity: 0.8
  },
};

interface TrendingItemProps {
  activeItem: string;
  item: Models.Document;
}

const TrendingItem: React.FC<TrendingItemProps> = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  const isActive = activeItem === item.$id;
  
  // Responsive sizing - smaller and more manageable
  const itemWidth = screenWidth * 0.5; // 60% of screen width
  const itemHeight = itemWidth * 1.5; // Maintain aspect ratio
  
  const player = useVideoPlayer(item.video || '', (player) => {
    player.loop = false;
  });

  useEffect(() => {
    if (play) {
      player.play();
    } else {
      player.pause();
    }
  }, [play, player]);

  return (
    <Animatable.View
      className="mr-4"
      animation={isActive ? zoomIn : zoomOut}
      duration={300} // Faster animation for smoother feel
      useNativeDriver={true} // Use native driver for better performance
    >
      {play ? (
        <VideoView
          style={{
            width: itemWidth,
            height: itemHeight,
            borderRadius: 20,
            marginTop: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="cover"
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.9}
          onPress={() => setPlay(true)}
          style={{ width: itemWidth, height: itemHeight }}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            style={{
              width: itemWidth,
              height: itemHeight,
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: isActive ? '#ffffff' : '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isActive ? 0.2 : 0.3,
              shadowRadius: isActive ? 8 : 6,
              elevation: isActive ? 8 : 4,
            }}
            resizeMode="cover"
          />
          
          {/* Lighter gradient overlay */}
          <View 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.15)',
            }}
          />
          
          {/* Smaller, more elegant play button */}
          <View 
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderRadius: 25,
              padding: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              source={icons.play}
              style={{ 
                width: 20, 
                height: 20,
                tintColor: '#ffffff'
              }}
              resizeMode="contain"
            />
          </View>
          
          {/* Subtle active indicator */}
          {isActive && (
            <View 
              style={{
                position: 'absolute',
                bottom: 12,
                left: 16,
                right: 16,
                height: 2,
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 1,
                shadowColor: '#ffffff',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 2,
              }}
            />
          )}
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

interface TrendingProps {
  posts: Models.Document[];
}

const Trending: React.FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id || '');
  
  const itemWidth = screenWidth * 0.6;
  const spacing = 16;

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
        itemVisiblePercentThreshold: 60, // Lower threshold for smoother transitions
      }}
      contentContainerStyle={{ 
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
      showsHorizontalScrollIndicator={false}
      snapToInterval={itemWidth + spacing} // Precise snap calculation
      snapToAlignment="start"
      decelerationRate="fast"
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={3}
      windowSize={5}
      initialNumToRender={2}
      getItemLayout={(data, index) => ({
        length: itemWidth + spacing,
        offset: (itemWidth + spacing) * index,
        index,
      })}
    />
  );
};

export default Trending;