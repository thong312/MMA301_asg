import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused

import { watchData } from '../../data/db'; // Import your watch data

const HomeScreen = ({ navigation }) => {
    const [favoriteWatches, setFavoriteWatches] = useState([]);
    const isFocused = useIsFocused(); // Check if the screen is focused

    useEffect(() => {
        loadFavoriteWatches(); // Load favorite watches from AsyncStorage when screen mounts or focuses
    }, [isFocused]); // Reload when the screen is focused

    const loadFavoriteWatches = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favoriteWatches');
            if (jsonValue !== null) {
                setFavoriteWatches(JSON.parse(jsonValue));
            }
        } catch (error) {
            console.error('Error loading favorite watches:', error);
        }
    };

    const saveFavoriteWatches = async (newFavoriteWatches) => {
        try {
            await AsyncStorage.setItem('favoriteWatches', JSON.stringify(newFavoriteWatches));
            setFavoriteWatches(newFavoriteWatches); // Update state to trigger re-render
        } catch (error) {
            console.error('Error saving favorite watches:', error);
        }
    };

    const handleAddToFavourite = async (item) => {
        try {
            const updatedFavorites = [...favoriteWatches];
            const existingIndex = updatedFavorites.findIndex((watch) => watch.id === item.id);

            if (existingIndex === -1) {
                updatedFavorites.push(item); // Add new watch to favorites
            } else {
                updatedFavorites.splice(existingIndex, 1); // Remove watch from favorites
            }

            await saveFavoriteWatches(updatedFavorites); // Save updated favorites to AsyncStorage
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const renderItem = ({ item }) => {
        const isFavorite = favoriteWatches.some((watch) => watch.id === item.id);

        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => navigation.navigate('Detail', { item: item })}
            >
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="stretch" />
                <View style={styles.textContainer}>
                    <Text style={styles.watchName}>{item.watchName}</Text>
                    <Text style={styles.price}>${item.price}</Text>
                </View>
                <TouchableOpacity onPress={() => handleAddToFavourite(item)}>
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isFavorite ? 'red' : 'black'}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Watches</Text>
            <FlatList
                data={watchData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                extraData={favoriteWatches} // Pass favoriteWatches as extraData to trigger re-render
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    textContainer: {
        flex: 1,
        paddingLeft: 10,
    },
    watchName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        color: '#888888',
    },
    icon: {
        marginLeft: 10,
    },
});

export default HomeScreen;
