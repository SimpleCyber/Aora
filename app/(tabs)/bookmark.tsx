import { StatusBar } from 'expo-status-bar';
import { StatusBar as RNStatusBar, View, Text, FlatList, RefreshControl, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { images } from '../../constants';
import VideoCard from '../../components/VideoCard';
import EmptyState from '../../components/EmptyState';
import SearchInput from '../../components/SearchInput';

interface BookmarkedVideo {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: {
    username: string;
    avatar: string;
  };
  bookmarkedAt: string;
}

const Bookmark: React.FC = () => {
  const [bookmarkedVideos, setBookmarkedVideos] = useState<BookmarkedVideo[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery] = useState<string>('');
  const [filteredVideos, setFilteredVideos] = useState<BookmarkedVideo[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');

  // Load bookmarked videos from storage (you can replace this with your actual storage logic)
  useEffect(() => {
    loadBookmarkedVideos();
  }, []);

  // Filter videos based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVideos(bookmarkedVideos);
    } else {
      const filtered = bookmarkedVideos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.creator.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  }, [searchQuery, bookmarkedVideos]);

  // Sort videos
  useEffect(() => {
    const sorted = [...filteredVideos].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
    setFilteredVideos(sorted);
  }, [sortBy, filteredVideos]);

  const loadBookmarkedVideos = async () => {
    try {
      // This is where you'd load from your actual storage
      // For now, using mock data
      const mockBookmarks: BookmarkedVideo[] = [
        {
          $id: '1',
          title: 'How to Build Amazing React Native Apps',
          thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          creator: {
            username: 'techguru',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
          },
          bookmarkedAt: new Date().toISOString()
        },
        {
          $id: '2',
          title: 'Advanced JavaScript Techniques',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          creator: {
            username: 'jsmaster',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
          },
          bookmarkedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ];
      setBookmarkedVideos(mockBookmarks);
    } catch (error) {
      console.error('Error loading bookmarked videos:', error);
    }
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadBookmarkedVideos();
    setRefreshing(false);
  };

  const handleRemoveBookmark = (videoId: string) => {
    Alert.alert(
      'Remove Bookmark',
      'Are you sure you want to remove this video from your bookmarks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setBookmarkedVideos(prev => prev.filter(video => video.$id !== videoId));
          }
        }
      ]
    );
  };

  const clearAllBookmarks = () => {
    Alert.alert(
      'Clear All Bookmarks',
      'Are you sure you want to remove all bookmarked videos?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setBookmarkedVideos([])
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: BookmarkedVideo }) => (
    <VideoCard
      video={item}
      isBookmarked={true}
      onBookmark={() => handleRemoveBookmark(item.$id)}
    />
  );

  const SortButton = ({ type, label }: { type: 'recent' | 'title'; label: string }) => (
    <TouchableOpacity
      onPress={() => setSortBy(type)}
      className={`px-4 py-2 rounded-full mr-2 ${
        sortBy === type ? 'bg-secondary' : 'bg-gray-800'
      }`}
      activeOpacity={0.7}
    >
      <Text className={`text-sm font-pmedium ${
        sortBy === type ? 'text-black' : 'text-white'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ListHeaderComponent = () => (
    <View className="px-4 mb-6 mt-7">
       <View className="bg-primary" style={{ height: RNStatusBar.currentHeight }} />
      
      {/* Expo StatusBar configuration */}
      <StatusBar 
        style="light" 
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-psemibold text-white">
            Saved Videos
          </Text>
          <Text className="text-sm font-pmedium text-gray-100 mt-1">
            {bookmarkedVideos.length} video{bookmarkedVideos.length !== 1 ? 's' : ''} saved
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

      {/* Search */}
      <SearchInput />

      {/* Sort and Clear Options */}
      {bookmarkedVideos.length > 0 && (
        <View className="mt-4 mb-2">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row">
              <SortButton type="recent" label="Recent" />
              <SortButton type="title" label="A-Z" />
            </View>
            <TouchableOpacity
              onPress={clearAllBookmarks}
              className="px-3 py-2"
              activeOpacity={0.7}
            >
              <Text className="text-red-400 font-pmedium text-sm">
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const ListEmptyComponent = () => (
    <EmptyState
      title="No Saved Videos"
      subtitle="Start bookmarking videos you want to watch later. Tap the menu icon on any video to save it."
    />
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList<BookmarkedVideo>
        data={filteredVideos}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#FFA001"
            colors={['#FFA001']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default Bookmark;