import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons'; // Correct import for Ionicons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import { watchData } from '../../data/db'; // Ensure correct import for watchData

const HomeScreen = ({ navigation }) => {
    const [favoriteWatches, setFavoriteWatches] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        loadFavoriteWatches();
    }, [isFocused]);

    const loadFavoriteWatches = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favoriteWatches');
            if (jsonValue !== null) {
                setFavoriteWatches(JSON.parse(jsonValue));
            } else {
                setFavoriteWatches([]);
            }
        } catch (error) {
            console.error('Error loading favorite watches:', error);
        }
    };

    const handleAddToFavourite = async (item) => {
        try {
            const updatedFavorites = [...favoriteWatches];
            const existingIndex = updatedFavorites.findIndex((watch) => watch.id === item.id);

            if (existingIndex === -1) {
                updatedFavorites.push(item);
            } else {
                updatedFavorites.splice(existingIndex, 1);
            }

            await saveFavoriteWatches(updatedFavorites);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const saveFavoriteWatches = async (newFavoriteWatches) => {
        try {
            await AsyncStorage.setItem('favoriteWatches', JSON.stringify(newFavoriteWatches));
            setFavoriteWatches(newFavoriteWatches);
        } catch (error) {
            console.error('Error saving favorite watches:', error);
        }
    };

    const selectAllFavorites = () => {
        Alert.alert(
            'Confirm Selection',
            'Are you sure you want to add all watches to favorites?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        await saveFavoriteWatches(watchData);
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const isFavorite = favoriteWatches.some((watch) => watch.id === item.id);

        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => navigation.navigate('Detail', { item: item })}
            >
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
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
                extraData={favoriteWatches} // Ensure re-render when favoriteWatches change
            />
            <TouchableOpacity onPress={selectAllFavorites} style={styles.selectAllButton}>
                <Text style={styles.selectAllText}>+</Text>
            </TouchableOpacity>
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
    selectAllButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignSelf: 'center',
    },
    selectAllText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default HomeScreen;
