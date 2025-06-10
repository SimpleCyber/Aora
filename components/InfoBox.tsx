import { View, Text } from 'react-native';
import React from 'react';

interface InfoBoxProps {
  title: string;
  subtitle?: string;
  titleStyles?: string;
  containerStyles?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  subtitle,
  titleStyles,
  containerStyles,
}) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      {subtitle && (
        <Text className="text-sm text-gray-100 text-center font-pregular">
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default InfoBox;