import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import { icons } from '../../constants';
import { router } from 'expo-router';
import { createVideo } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

type FormState = {
  title: string;
  video: ImagePicker.ImagePickerAsset | null;
  thumbnail: ImagePicker.ImagePickerAsset | null;
  prompt: string;
};

const Create = () => {
  const { user } = useGlobalContext();

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  });

  // Create video player - always call the hook
  const player = useVideoPlayer(form.video?.uri || '', (player) => {
    if (form.video?.uri) {
      player.replace(form.video.uri);
    }
  });

  const openPicker = async (selectType: 'image' | 'video') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === 'image') {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === 'video') {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (!form.prompt || !form.title || !form.video || !form.thumbnail) {
      return Alert.alert('Please fill in all the fields');
    }

    if (!user) {
      return Alert.alert('Error', 'You must be logged in to upload a video.');
    }

    setUploading(true);

    try {
      await createVideo({
        userId: user.$id,
        title: form.title,
        video: {
          name: form.video.fileName ?? 'video.mp4',
          uri: form.video.uri,
          type: form.video.mimeType ?? 'video/mp4',
          size: form.video.fileSize ?? 0,
        },
        thumbnail: {
          name: form.thumbnail.fileName ?? 'thumbnail.jpg',
          uri: form.thumbnail.uri,
          type: form.thumbnail.mimeType ?? 'image/jpeg',
          size: form.thumbnail.fileSize ?? 0,
        },
        prompt: form.prompt,
      });

      Alert.alert('Success', 'Post uploaded successfully');
      router.push('./home');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', String(error));
      }
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2 ">
          <Text className="text-base text-gray-100 font-pmedium">Upload Video</Text>

          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <VideoView
                style={{
                  width: '100%',
                  height: 256,
                  borderRadius: 16,
                }}
                player={player}
                contentFit="cover"
                allowsFullscreen={false}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary justify-center items-center">
                  <Image source={icons.upload} resizeMode="contain" className="w-1/2 h-1/2" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Thumbnail Image</Text>
          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image source={icons.upload} resizeMode="contain" className="w-5 h-5" />

                <Text className="text-sm text-gray-100 font-pmedium">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you use to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;