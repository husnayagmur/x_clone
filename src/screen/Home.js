import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import TweetCard from '../components/TweetCardsProfile';

const Home = () => {
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
            name: "Esma",
            username: "esmaygmr",
            date: "29 Tem 24",
            content: "İkinci tweet, React Native çok eğlenceli!",
            comments: 1,
            retweets: 20,
            likes: 150,
        },
        {
            name: "Esma",
            username: "esmaygmr",
            date: "29 Tem 24",
            content: "İkinci tweet, React Native çok eğlenceli!",
            comments: 1,
            retweets: 20,
            likes: 150,
        },
    ];

    return (
        <ScrollView className="bg-black w-full">
            <View className="w-16 h-16 bg-gray-500 rounded-full border-4 border-black mt-4"/>
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

        </ScrollView>
    );
};

export default Home;
