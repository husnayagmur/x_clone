// components/TweetCard.js
import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

const TweetCard = ({ name, username, date, content, comments, retweets, likes }) => {
    return (
        <View className="flex-row mb-6">
            <View className="w-12 h-12 bg-gray-500 rounded-full mr-3" />
            <View className="flex-1">
                <View className="flex-row items-center space-x-1">
                    <Text className="text-white font-bold">{name}</Text>
                    <Text className="text-gray-400">@{username} · {date}</Text>
                </View>
                <Text className="text-white mt-1">{content}</Text>

                <View className="flex-row justify-between mt-4 pr-8">
                    <View className="flex-row items-center space-x-1">
                        <Ionicons name="chatbubble-outline" size={18} color="gray" />
                        <Text className="text-gray-400 text-sm">{comments}</Text>
                    </View>
                    <View className="flex-row items-center space-x-1">
                        <Ionicons name="repeat" size={18} color="gray" />
                        <Text className="text-gray-400 text-sm">{retweets}</Text>
                    </View>
                    <View className="flex-row items-center space-x-1">
                        <Ionicons name="heart-outline" size={18} color="gray" />
                        <Text className="text-gray-400 text-sm">{likes}</Text>
                    </View>
                    <View className="flex-row items-center space-x-1">
                        <MaterialCommunityIcons name="chart-bar" size={18} color="gray" />
                    </View>
                    <View className="flex-row items-center space-x-1">
                        <Feather name="bookmark" size={18} color="gray" />
                    </View>
                    <View className="flex-row items-center space-x-1">
                        <Feather name="share" size={18} color="gray" />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default TweetCard;
