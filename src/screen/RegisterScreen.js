import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const RegisterScreen = () => {
  return (
    <ScrollView 
      className=" bg-black px-6"
      contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }} // Düzeltilmiş kısım
    >
      <Text className="text-white text-3xl font-bold mb-10 text-center">Kayıt Ol</Text>

      <Text className="text-white mb-2">Ad Soyad</Text>
      <TextInput
        placeholder="Ad Soyad"
        placeholderTextColor="#aaa"
        className="bg-gray-800 text-white px-4 py-3 rounded-xl mb-4"
      />

      <Text className="text-white mb-2">E-posta</Text>
      <TextInput
        placeholder="E-posta girin"
        placeholderTextColor="#aaa"
        className="bg-gray-800 text-white px-4 py-3 rounded-xl mb-4"
      />

      <Text className="text-white mb-2">Şifre</Text>
      <TextInput
        placeholder="Şifre oluşturun"
        placeholderTextColor="#aaa"
        secureTextEntry
        className="bg-gray-800 text-white px-4 py-3 rounded-xl mb-6"
      />

      <TouchableOpacity className="bg-blue-500 py-3 rounded-xl mb-4">
        <Text className="text-white text-center font-semibold">Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text className="text-gray-400 text-center mt-6">Zaten hesabın var mı? <Text className="text-blue-500">Giriş Yap</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;
