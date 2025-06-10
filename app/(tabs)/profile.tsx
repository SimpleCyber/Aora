import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { Models } from 'react-native-appwrite';
import { router } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
import { getUserPosts, signOut } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons } from '../../constants';
import InfoBox from '../../components/InfoBox';

// Define the video type that matches VideoCardProps
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
  const { data: posts } = useAppwrite(() => getUserPosts(user?.$id || ''));

  const logout = async (): Promise<void> => {
    try {
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderItem = ({ item }: { item: Models.Document }) => {
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
  };

  const ListHeaderComponent = () => (
    <>
      <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
        <TouchableOpacity
          className="w-full flex items-end mb-10"
          onPress={logout}
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
          title={user?.username || ''}
          containerStyles="mt-5"
          titleStyles="text-lg"
        />

        <View className="mt-1 flex-row">
          <InfoBox
            title={posts?.length?.toString() || '0'}
            subtitle="Posts"
            containerStyles="mr-5"
            titleStyles="text-xl"
          />
          <InfoBox
            title="1.2k"
            subtitle="Followers"
            containerStyles="ml-5"
            titleStyles="text-xl"
          />
        </View>
      </View>
    </>
  );

  const ListEmptyComponent = () => (
    <EmptyState
      title="No Videos Found"
      subtitle="No videos found for this user"
    />
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList<Models.Document>
        data={posts}
        keyExtractor={(item: Models.Document) => item.$id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
      />
    </SafeAreaView>
  );
};

export default Profile;