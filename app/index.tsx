import { StatusBar as RNStatusBar, ScrollView, Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { Redirect, router } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <View className="bg-primary flex-1">
      {/* Status bar background view (for Android) */}
      <View className="bg-primary" style={{ height: RNStatusBar.currentHeight }} />
      
      {/* Expo StatusBar configuration */}
      <StatusBar 
        style="light" 
        backgroundColor="transparent"
        translucent
      />
      
      <SafeAreaView className="flex-1">
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center items-center px-4 pb-10">
            {/* Logo */}
            <Image
              source={images.logo}
              className="w-[130px] h-[84px] mb-10"
              resizeMode="contain"
            />

            {/* Cards Image */}
            <Image
              source={images.cards}
              className="w-full max-w-[380px] h-[300px]"
              resizeMode="contain"
            />

            {/* Title with underline */}
            <View className="relative mt-8 mb-2">
              <Text className="text-3xl text-white font-bold text-center">
                Discover Endless Possibilities with{' '}
                <Text className="text-secondary-200">Aora</Text>
              </Text>
              <Image
                source={images.path}
                className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
                resizeMode="contain"
              />
            </View>

            {/* Subtitle */}
            <Text className="text-sm font-pregular text-gray-100 text-center mb-8 px-4">
              Where creativity meets innovation: embark on a journey of limitless exploration with Aora
            </Text>

            {/* Action Button */}
            <CustomButton
              title="Continue with Email"
              handlePress={() => router.push('/sign-in')}
              containerStyles="w-full"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}