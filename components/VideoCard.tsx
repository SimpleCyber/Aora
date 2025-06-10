import { View, Text, Image, TouchableOpacity, Modal, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { icons } from '../constants';
import { VideoView, useVideoPlayer } from 'expo-video';

interface VideoCardProps {
  video: {
    $id?: string;
    title: string;
    thumbnail: string;
    video: string;
    creator: {
      username: string;
      avatar: string;
    };
  };
  onBookmark?: (video: VideoCardProps['video']) => void;
  isBookmarked?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video: { $id, title, thumbnail, video, creator: { username, avatar } }, 
  onBookmark,
  isBookmarked = false 
}) => {
  const [play, setPlay] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  const player = useVideoPlayer(video, (player) => {
    player.loop = false;
  });

  useEffect(() => {
    if (play) {
      player.play();
    } else {
      player.pause();
    }
  }, [play, player]);

  useEffect(() => {
    if (showMenu) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showMenu]);

  const handleBookmark = () => {
    const videoData = { $id, title, thumbnail, video, creator: { username, avatar } };
    onBookmark?.(videoData);
    setShowMenu(false);
  };

  const MenuOption = ({ icon, text, onPress, textColor = "text-white" }: {
    icon: any;
    text: string;
    onPress: () => void;
    textColor?: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3 border-b border-gray-800"
      activeOpacity={0.7}
    >
      <Image
        source={icon}
        className="w-5 h-5 mr-3"
        resizeMode="contain"
        tintColor={textColor === "text-white" ? "#FFFFFF" : "#FFA001"}
      />
      <Text className={`${textColor} font-pmedium text-sm flex-1`}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-1 flex-row">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowMenu(true)}
          className="pt-2 p-2"
          activeOpacity={0.7}
        >
          <Image
            source={icons.menu}
            className="w-1.5 h-6"
            resizeMode="contain"
            tintColor="#CDCDE0"
          />
        </TouchableOpacity>
      </View>

      {play ? (
        <VideoView
          style={{
            width: '100%',
            height: 240,
            borderRadius: 12,
            marginTop: 12,
          }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {/* Menu Modal */}
      <Modal
        transparent
        visible={showMenu}
        animationType="none"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View className="flex-1 justify-center items-center px-4">
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              }}
              className="bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden border border-gray-800"
            >
              <View className="px-4 py-4 border-b border-gray-800">
                <Text className="text-white font-psemibold text-lg text-center">
                  Video Options
                </Text>
              </View>

              <MenuOption
                icon={isBookmarked ? icons.bookmark : icons.bookmark}
                text={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}
                onPress={handleBookmark}
                textColor={isBookmarked ? "text-orange-400" : "text-white"}
              />

              <MenuOption
                icon={ icons.menu} // Use share icon if available
                text="Share Video"
                onPress={() => {
                  // Implement share functionality
                  console.log('Share video:', title);
                  setShowMenu(false);
                }}
              />

              <MenuOption
                icon={ icons.menu} // Use flag icon if available
                text="Report Video"
                onPress={() => {
                  // Implement report functionality
                  console.log('Report video:', title);
                  setShowMenu(false);
                }}
              />

              <TouchableOpacity
                onPress={() => setShowMenu(false)}
                className="px-4 py-4 border-t border-gray-700"
                activeOpacity={0.7}
              >
                <Text className="text-gray-400 font-pmedium text-sm text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default VideoCard;