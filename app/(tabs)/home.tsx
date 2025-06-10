import { StatusBar } from 'expo-status-bar';
import {StatusBar as RNStatusBar, View, Text, FlatList, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { Models } from 'react-native-appwrite';
import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';

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

const Home: React.FC = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const { user } = useGlobalContext();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
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
    <View className="my-6 px-4 space-y-4">
       <View className="bg-primary" style={{ height: RNStatusBar.currentHeight }} />
      
      {/* Expo StatusBar configuration */}
      <StatusBar 
        style="light" 
        backgroundColor="transparent"
        translucent
      />
      <View className="justify-between items-start flex-row mb-6">
        <View>
          <Text className="font-pmedium text-sm text-white">
            Welcome back,
          </Text>
          <Text className="text-2xl font-psemibold text-white">
            {user?.username}
          </Text>
        </View>
        <View className="mt-1.5">
          <Image
            source={images.logoSmall}
            className="w-9 h-10"
            resizeMode="contain"
          />
        </View>
      </View>
      <SearchInput />
      <View className="w-full flex-1 pt-5 pb-8">
        <Text className="text-gray-100 text-lg font-pregular mb-3">
          Latest Videos
        </Text>
        <Trending posts={latestPosts ?? []} />
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <EmptyState
      title="No Videos Found"
      subtitle="Be the first one to upload the video"
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;