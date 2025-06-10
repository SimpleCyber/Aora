import { View, Text, Image, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { icons } from '../../constants';

interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 4, // Reduced gap for better proportion
      paddingVertical: 4,
      minWidth: 50, // Ensures consistent width for all tabs
    }}>
      <View style={{
        padding: focused ? 6 : 4, // Subtle padding increase when focused
        borderRadius: 12,
        backgroundColor: focused ? 'rgba(255, 160, 1, 0.0)' : 'transparent',
        transform: [{ scale: focused ? 1.1 : 1 }], 
      }}>
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          style={{ 
            width: focused ? 22 : 20, 
            height: focused ? 22 : 20,
          }}
        />
      </View>
      <Text
        style={{
          color: color,
          fontSize: focused ? 11 : 10, 
          fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular',
          textAlign: 'center',
          opacity: focused ? 1 : 0.8, 
        }}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          backgroundColor: '#161622',
          borderTopWidth: 1,
          borderTopColor: '#232533',
          height: Platform.OS === 'ios' ? 88 : 70, 
          paddingBottom: Platform.OS === 'ios' ? 20 : 10, 
          paddingTop: 8,
          paddingHorizontal: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        // Smooth transitions
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        // Better accessibility
        tabBarAccessibilityLabel: 'Navigation tabs',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Bookmark',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.bookmark}
              color={color}
              name="Bookmark"
              focused={focused}
            />
          ),
          tabBarAccessibilityLabel: 'Bookmark tab',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.plus}
              color={color}
              name="Create"
              focused={focused}
            />
          ),
          tabBarAccessibilityLabel: 'Create tab',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;