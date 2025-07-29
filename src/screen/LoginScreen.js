import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slice/AuthSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error, user } = useSelector((state) => state.auth);  // Redux state'ten loading, error ve user bilgileri

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Hata', 'E-posta ve şifre gereklidir!');
      return; 
    }

    console.log('Login işlemi başlatıldı...');
    dispatch(login({ email, password }))  // login işlemi
      .unwrap() 
      .then(() => {
        console.log('Login başarılı!'); // Giriş başarılı logu
        Alert.alert('Giriş Başarılı', 'Giriş başarılı bir şekilde yapıldı!');
      })
      .catch((err) => {
        console.log('Login Error Details:', err);  // Hata detaylarını konsola yazdırıyoruz

        let errorMessage = 'Bir hata oluştu';
        // Hata türüne göre mesajı özelleştiriyoruz
        if (err.message.includes('Geçersiz email veya şifre')) {
          errorMessage = 'Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.';
        } else if (err.message.includes('Sunucu hatası')) {
          errorMessage = 'Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        } else if (err.message.includes('Network Error')) {
          errorMessage = 'Ağ hatası oluştu. Lütfen internet bağlantınızı kontrol edin.';
        }

        Alert.alert('Hata', errorMessage);
      });
  };

  return (
    <ScrollView
      className="bg-black px-6"
      contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}
    >
      <Text className="text-white text-3xl font-bold mb-10 text-center">Giriş Yap</Text>

      <Text className="text-white mb-2">E-posta</Text>
      <TextInput
        placeholder="E-posta girin"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        className="bg-gray-800 text-white px-4 py-3 rounded-xl mb-4"
      />

      <Text className="text-white mb-2">Şifre</Text>
      <TextInput
        placeholder="Şifre girin"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="bg-gray-800 text-white px-4 py-3 rounded-xl mb-6"
      />

      <TouchableOpacity
        className="bg-blue-500 py-3 rounded-xl mb-4"
        onPress={handleLogin}
        disabled={isLoading} // Loading sırasında butona basılamaz
      >
        <Text className="text-white text-center font-semibold">
          {isLoading ? 'Yükleniyor...' : 'Giriş Yap'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text className="text-blue-400 text-center underline mb-2">Şifremi Unuttum</Text>
      </TouchableOpacity>

      <View className='flex-row'>
        <TouchableOpacity>
          <Text className="text-gray-400 text-center mt-6">
            Henüz hesabın yok mu?
          </Text>
        </TouchableOpacity>
        <Text className="text-blue-500">Kayıt Ol</Text>
      </View>

      {user && (
        <View className="mt-4">
          <Text className="text-white text-center font-semibold">Hoş geldiniz, {user.username}!</Text>
        </View>
      )}

      {error && <Text className="text-red-500 text-center mt-4">{error}</Text>} {/* Hata mesajını göster */}
    </ScrollView>
  );
};

export default LoginScreen;
