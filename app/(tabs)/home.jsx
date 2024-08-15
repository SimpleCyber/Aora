import { StatusBar } from 'expo-status-bar';
import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React , {useState} from 'react'
import {images} from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {

  const { data : posts, refetch} = useAppwrite(getAllPosts);
  const { data : latestPosts} = useAppwrite(getLatestPosts);
  const { user, setUser, setIsLoggedIn } = useGlobalContext(); 

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data = {posts}
        keyExtractor={(item)=> item.$id}
        renderItem={({item}) =>(
          <VideoCard video= {item}/>
        )}

        ListHeaderComponent={() =>(
          <View className="my-6 px-4 space-y-4">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-white">
                  Welcome back ,
                </Text>

                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt=1.5">
                <Image 
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode='contain'
                />
              </View>
            </View>

            <SearchInput />


            <View className="w-full flex-1 pt-5 pb-8">

              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []}/>

            </View>
              
          </View>
        )}

        ListEmptyComponent={() =>(
          <EmptyState 
            title="No Videos Found"
            subtitle ="Be the first one to upload the video"
          />
        )}

        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />

      <StatusBar  backgroundColor='#161622' style='light'/>
    </SafeAreaView>
  )
}

export default Home;