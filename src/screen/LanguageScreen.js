import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import {verticalScale} from '../custome/Responsive';
import strings from '../language/strings';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = [
  {id: '1', name: 'English', code: 'en', flag: '🇬🇧'},
  {id: '2', name: 'Gujarati', code: 'gu', flag: '🇮🇳'},
  {id: '3', name: 'Hindi', code: 'hi', flag: '🇮🇳'},
  {id: '4', name: 'French', code: 'fr', flag: '🇫🇷'},
];

const LanguageScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    setInitialLanguage();
  }, [isFocused]);

  const setInitialLanguage = async () => {
    const language = await AsyncStorage.getItem('language');
    setSelectedLanguage(language);
  };

  const handleLanguageSelection = async language => {
    setSelectedLanguage(language.code);
    await AsyncStorage.setItem('language', language.code);
  };

  const handleLanguageSaved = () => {
    selectedLanguage === 'en' && strings.setLanguage('en');
    selectedLanguage === 'gu' && strings.setLanguage('gu');
    selectedLanguage === 'hi' && strings.setLanguage('hi');
    selectedLanguage === 'fr' && strings.setLanguage('fr');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Language</Text>
      <FlatList
        data={languages}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.languageCard,
              selectedLanguage === item.code && styles.selectedCard,
            ]}
            onPress={() => handleLanguageSelection(item)}>
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.languageName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => handleLanguageSaved()}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(LanguageScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginTop: verticalScale(25),
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  languageCard: {
    width: '45%',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: '#fdd835',
  },
  flag: {
    fontSize: 32,
    marginBottom: 8,
  },
  languageName: {
    fontSize: 18,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
