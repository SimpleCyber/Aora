import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import { icons } from '../constants';
import { router, usePathname } from 'expo-router';

interface SearchInputProps {
  initialQuery?: string;
}

// Define the type for your router's pathnames
type AppRouter = {
  pathname: 
    | '/search/[query]'
    | '/'
    | '/(tabs)/home'
    | '/(tabs)/bookmark'
    | '/(tabs)/create'
    | '/sign-in'
    | '/sign-up'
    // Add all your other routes here
  params?: Record<string, string>;
}

const SearchInput: React.FC<SearchInputProps> = ({ initialQuery }) => {
  const pathName = usePathname();
  const [query, setQuery] = useState(initialQuery || '');

  const handleSearch = () => {
    if (query === '') {
      return Alert.alert('Missing Query', 'Please input something to search for.');
    }

    if (pathName.startsWith('/search')) {
      router.setParams({ query });
    } else {
      // Type assertion to tell TypeScript this is a valid route
      (router as typeof router & {
        push: (params: AppRouter) => void;
      }).push({
        pathname: '/search/[query]',
        params: { query },
      });
    }
  };

  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="flex-1 text-white font-pregular text-base mt-0.5"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={setQuery}
      />

      <TouchableOpacity onPress={handleSearch}>
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;