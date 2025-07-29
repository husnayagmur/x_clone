import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TweetCard from '../components/TweetCardsProfile'; // Yolunu doğru yaz

const Profile = () => {
    const tweets = [
        {
            name: "HüSna",
            username: "husnaygmr",
            date: "07 Ağu 24",
            content: "İlk tweet içeriği burada.",
            comments: 2,
            retweets: 179,
            likes: 45,
        },
        {
            name: "HüSna",
            username: "husnaygmr",
            date: "29 Tem 24",
            content: "İkinci tweet, React Native çok eğlenceli!",
            comments: 1,
            retweets: 20,
            likes: 150,
        },
    ];

    return (
        <ScrollView className="bg-black w-full">
            
            <View className="h-32 bg-gray-700 w-full" />
            <View className="px-4 pb-6">
                {/* Profil */}
                <View className="flex-row justify-between items-center -mt-10">
                    <View className="w-20 h-20 bg-gray-500 rounded-full border-4 border-black" />
                    <TouchableOpacity className="border border-gray-300 px-4 py-1 rounded-full">
                        <Text className="text-white text-sm">Profili düzenle</Text>
                    </TouchableOpacity>
                </View>

                {/* Kullanıcı Bilgisi */}
                <View className="mt-3">
                    <View className='flex-row items-center'>
                        <Text className="text-white text-xl font-bold">HüSna </Text>
                        <Text className="text-blue-500 text-[16px]">Onaylanmış Hesap Sahibi Ol</Text>
                        <Ionicons name="checkmark-circle" size={18} color="#3b82f6" className="ml-1" />
                    </View>
                    <Text className="text-gray-400">@husnaygmr</Text>
                    <Text className="text-white mt-1">Computer Engineer ♡</Text>
                    <Text className="text-gray-500 text-sm mt-2">Ağustos 2019 tarihinde katıldı</Text>
                </View>

                {/* Takipçi */}
                <View className="flex-row space-x-4 mt-4">
                    <View className="flex-row space-x-1 items-center">
                        <Text className="text-white font-bold">43</Text>
                        <Text className="text-gray-400">Takip edilen</Text>
                    </View>
                    <View className="flex-row space-x-1 items-center">
                        <Text className="text-white font-bold">36</Text>
                        <Text className="text-gray-400">Takipçi</Text>
                    </View>
                </View>

                {/* Tweet Listesi */}
                <View className="mt-8 border-t border-gray-700 pt-4">
                    {tweets.map((item, index) => (
                        <TweetCard
                            key={index}
                            name={item.name}
                            username={item.username}
                            date={item.date}
                            content={item.content}
                            comments={item.comments}
                            retweets={item.retweets}
                            likes={item.likes}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default Profile;
