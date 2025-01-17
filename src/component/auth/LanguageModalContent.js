import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import Color from '../Color';
import { scale, verticalScale } from '../../custome/Responsive';
import AntDesign from 'react-native-vector-icons/AntDesign';

const LanguageModalContent = ({
    setSelectedLanguage,
    selectedLanguage,
    closeModal,
}) => {
    const languages = [
        {
            id: 0,
            name: 'English',
            flag: require('../../Assets/FlagImage/UsaFlag.png'),
        },
        { id: 1, name: 'Espanol', flag: require('../../Assets/FlagImage/spain.png') },
        {
            id: 2,
            name: 'Postogues',
            flag: require('../../Assets/FlagImage/portugal.png'),
        },
        {
            id: 3,
            name: 'Francais',
            flag: require('../../Assets/FlagImage/france.png'),
        },
        {
            id: 4,
            name: 'Italiano',
            flag: require('../../Assets/FlagImage/italy.png'),
        },
        {
            id: 5,
            name: 'German',
            flag: require('../../Assets/FlagImage/germany.png'),
        },
        { id: 6, name: 'Polish', flag: require('../../Assets/FlagImage/poland.png') },
        {
            id: 7,
            name: 'Mandarin',
            flag: require('../../Assets/FlagImage/china.png'),
        },
        { id: 8, name: 'Swahili', flag: require('../../Assets/FlagImage/kenya.png') },
        {
            id: 9,
            name: 'Tagalog',
            flag: require('../../Assets/FlagImage/philippines.png'),
        },
        { id: 10, name: 'Hindi', flag: require('../../Assets/FlagImage/india.png') },
    ];

    const renderLanguage = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.languageRow}
                onPress={() => {
                    setSelectedLanguage(item);
                    closeModal();
                }}>
                <Image source={item.flag} style={styles.flag} />
                <Text style={styles.languageText}>{item.name}</Text>

                {selectedLanguage?.name === item.name ? (
                    <AntDesign name="checkcircle" size={21.5} color={Color.Green} />
                ) : (
                    <View style={styles.radioButton} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={languages}
                renderItem={renderLanguage}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: scale(10),
        paddingHorizontal: scale(10),
        backgroundColor: '#fff',
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(10),
        borderBottomWidth: scale(0.5),
        borderBottomColor: '#ddd',
    },
    flag: {
        width: scale(30),
        height: scale(20),
        marginRight: scale(10),
    },
    languageText: {
        flex: 1,
        fontSize: scale(15),
        color: Color.Black,
    },
    radioButton: {
        width: scale(20),
        height: scale(20),
        borderWidth: scale(2),
        borderColor: '#ccc',
        borderRadius: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        width: scale(16),
        height: scale(16),
        backgroundColor: 'green',
        borderRadius: scale(8),
    },
});

export default LanguageModalContent;


// {
//     en: {
//       how: "How do you want your egg today?",
//       boiledEgg: "Boiled egg",
//       softBoiledEgg: "Soft-boiled egg",
//       choice: "How to choose the egg"
//     },
//     es: { // Español
//       how: "¿Cómo quieres tu huevo hoy?",
//       boiledEgg: "Huevo duro",
//       softBoiledEgg: "Huevo pasado por agua",
//       choice: "Cómo elegir el huevo"
//     },
//     pt: { // Português
//       how: "Como você quer o seu ovo hoje?",
//       boiledEgg: "Ovo cozido",
//       softBoiledEgg: "Ovo mal passado",
//       choice: "Como escolher o ovo"
//     },
//     fr: { // Français
//       how: "Comment voulez-vous votre œuf aujourd'hui?",
//       boiledEgg: "Œuf dur",
//       softBoiledEgg: "Œuf à la coque",
//       choice: "Comment choisir l'œuf"
//     },
//     it: { // Italiano
//       how: "Come vuoi il tuo uovo oggi?",
//       boiledEgg: "Uovo sodo",
//       softBoiledEgg: "Uovo alla coque",
//       choice: "Come scegliere l'uovo"
//     },
//     de: { // Deutsch
//       how: "Wie möchten Sie Ihr Ei heute?",
//       boiledEgg: "Gekochtes Ei",
//       softBoiledEgg: "Weich gekochtes Ei",
//       choice: "Wie man das Ei auswählt"
//     },
//     pl: { // Polski
//       how: "Jak chcesz swoje jajko dzisiaj?",
//       boiledEgg: "Jajko na twardo",
//       softBoiledEgg: "Jajko na miękko",
//       choice: "Jak wybrać jajko"
//     },
//     zh: { // Mandarin (Simplified Chinese)
//       how: "今天你想要什么样的鸡蛋？",
//       boiledEgg: "煮鸡蛋",
//       softBoiledEgg: "嫩煮蛋",
//       choice: "如何选择鸡蛋"
//     },
//     sw: { // Swahili
//       how: "Unataka yai lako vipi leo?",
//       boiledEgg: "Yai lililochemshwa",
//       softBoiledEgg: "Yai lililochemshwa kiasi",
//       choice: "Jinsi ya kuchagua yai"
//     },
//     tl: { // Tagalog
//       how: "Paano mo gusto ang iyong itlog ngayon?",
//       boiledEgg: "Nilagang itlog",
//       softBoiledEgg: "Malasado na itlog",
//       choice: "Paano pumili ng itlog"
//     }
//   }
