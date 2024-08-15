import { useEffect } from 'react'
import {useLocalSearchParams} from 'expo-router';
import { View, Text, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

import useAppwrite from '../../lib/useAppwrite';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
import { searchPost } from '../../lib/appwrite';

const Search = () => {

  const { query } = useLocalSearchParams(); 
  const { data : posts, refetch} = useAppwrite(() => searchPost(query));

  useEffect(() =>{
    refetch();
  },[query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data = {posts}
        keyExtractor={(item)=> item.$id}
        renderItem={({ item }) =>(
          <VideoCard 
            video= {item}
          />
        )}

        ListHeaderComponent={() =>(
          <>
            <View className="my-6 px-4 flex">
                <Text className="font-pmedium text-sm text-white">
                  Search Results
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {query}
                </Text>
                <View className="mt-6 mb-8">
                  <SearchInput initialQuery={query} />
                </View>
            </View>
          </>
        )}

        ListEmptyComponent={() =>(
          <EmptyState 
            title="No Videos Found"
            subtitle ="No videos found for these search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;