import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { useGlobalContext } from '../../context/GlobalProvider';
import { createUser } from '../../lib/appwrite';

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username :"",
    email:"",
    password :""
  });

  // ---------------------------------------------------- 🌿🌿🌿🌿
  const submit= async () =>{

    if(form.username ==="" || form.email === "" || form.password==="" ){
      Alert.alert("Error", "Please fill in all the fields");
    }

    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLoggedIn(true);
      router.replace("/home");
    } 
    catch (error) {
     if (error instanceof Error) {
    Alert.alert("Error", error.message);
  } else {
    Alert.alert("Error", String(error));
  }
    } 
    finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------- 🌿🌿🌿🌿



  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image 
            source={images.logo}
            resizeMode = 'contain'
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold"> Sign Up to Aora</Text>



          <FormField
            title="Username"
            value={form.username}
            handleChangeText = {(e) => setForm({ ...form, username:e})}
            otherStyles ="mt-10"
            placeholder="Enter your username"
          />


          <FormField
            title="Email"
            value={form.email}
            handleChangeText = {(e) => setForm({ ...form, email:e})}
            otherStyles ="mt-7"
            keyboardType = "email-address"
            placeholder='Enter your email'
          />


          <FormField
            title="Password"
            value={form.password}
            handleChangeText = {(e) => setForm({ ...form, password:e})}
            otherStyles ="mt-7"
            placeholder='Enter your password'
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles ="mt-7"
            isLoading = {isSubmitting}
          />

         <View className="justify-center pt-5 flex-row gap-2">
          <Text className="text-lg text-gray-100 font-pregular">
            Have an account already?
          </Text>
          <Link href="/sign-in" className="text-lg font-psemibold text-secondary">
            Login
          </Link>
         </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp;