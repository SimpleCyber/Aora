import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo } from 'react';
import { Models } from 'react-native-appwrite';
import { router } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
import { getUserPosts, signOut } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons } from '../../constants';
import InfoBox from '../../components/InfoBox';

interface VideoType {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: {
    username: string;
    avatar: string;
  };
}

const Profile: React.FC = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  
  // Memoize the getUserPosts function call to prevent unnecessary re-renders
  const getUserPostsCallback = useCallback(() => {
    return user?.$id ? getUserPosts(user.$id) : Promise.resolve([]);
  }, [user?.$id]);
  
  const { data: posts } = useAppwrite(getUserPostsCallback);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [setUser, setIsLoggedIn]);

  const renderItem = useCallback(({ item }: { item: Models.Document }) => {
    // Transform Models.Document to VideoCardProps format
    const videoData: VideoType = {
      $id: item.$id,
      title: item.title,
      thumbnail: item.thumbnail,
      video: item.video,
      creator: {
        username: item.creator?.username || 'Unknown',
        avatar: item.creator?.avatar || ''
      }
    };
        
    return <VideoCard video={videoData} />;
  }, []);

  const keyExtractor = useCallback((item: Models.Document) => item.$id, []);

  // Memoize the header component to prevent re-renders
  const ListHeaderComponent = useMemo(() => (
    <View className="w-full justify-center items-center mt-6 mb-12 px-4">
      <TouchableOpacity
        className="w-full items-end mb-10"
        onPress={logout}
        activeOpacity={0.7}
      >
        <Image
          source={icons.logout}
          resizeMode="contain"
          className="w-6 h-6"
        />
      </TouchableOpacity>

      <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
        <Image
          source={{ uri: user?.avatar }}
          className="w-[90%] h-[90%] rounded-lg"
          resizeMode="cover"
        />
      </View>

      <InfoBox
        title={user?.username || 'Unknown User'}
        containerStyles="mt-5"
        titleStyles="text-lg"
      />

      <View className="mt-5 flex-row">
        <InfoBox
          title={posts?.length?.toString() || '0'}
          subtitle="Posts"
          containerStyles="mr-10"
          titleStyles="text-xl"
        />
        <InfoBox
          title="1.2k"
          subtitle="Followers"
          titleStyles="text-xl"
        />
      </View>
    </View>
  ), [user?.avatar, user?.username, posts?.length, logout]);

  // Memoize the empty component
  const ListEmptyComponent = useMemo(() => (
    <EmptyState
      title="No Videos Found"
      subtitle="No videos found for this search query"
    />
  ), []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts || []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Profile;