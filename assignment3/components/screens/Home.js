import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import { watchData } from '../../data/db';
import watch1 from '../../assets/watch1.jpg'
const HomeScreen = ({ navigation }) => {
    const [favoriteWatches, setFavoriteWatches] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [filteredWatches, setFilteredWatches] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        loadFavoriteWatches();
        setFilteredWatches(watchData);
    }, [isFocused]);

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

    const filterWatchesByBrand = (brand) => {
        setSelectedBrand(brand);
        if (brand === 'All') {
            setFilteredWatches(watchData);
        } else {
            const filtered = watchData.filter((watch) => watch.brandName === brand);
            setFilteredWatches(filtered);
        }
    };

    const renderFilterButton = ({ item }) => (
        <TouchableOpacity
            style={[styles.filterButton, selectedBrand === item && styles.selectedFilterButton]}
            onPress={() => filterWatchesByBrand(item)}
        >
            <Text style={styles.filterButtonText}>{item}</Text>
        </TouchableOpacity>
    );

    const renderCustomItem = ({ item }) => {
        const isFavorite = favoriteWatches.some((watch) => watch.id === item.id);
        return (
            <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => navigation.navigate('Detail', { item: item })}
            >
                <View style={styles.card}>
                    <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                    <View style={styles.cardContent}>
                        <Text style={styles.watchName}>{item.watchName}</Text>
                        <Text style={styles.price}>${item.price}</Text>
                        <TouchableOpacity onPress={() => handleAddToFavourite(item)}>
                            <Ionicons
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={24}
                                color={isFavorite ? 'red' : 'black'}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Watches</Text>
            <FlatList
                data={filteredWatches}
                renderItem={renderCustomItem}
                keyExtractor={(item) => item.id.toString()}
                extraData={favoriteWatches}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        marginBottom: 20,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 5,
        marginBottom: 10,
    },
    selectedFilterButton: {
        backgroundColor: '#007BFF',
    },
    filterButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    cardContainer: {
        marginBottom: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        padding: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    cardContent: {
        marginLeft: 10,
        flex: 1,
    },
    watchName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        color: '#888',
        marginTop: 5,
    },
    icon: {
        marginLeft: 'auto',
    },
});

export default HomeScreen;
