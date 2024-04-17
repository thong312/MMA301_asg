import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from 'react-native-vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const FavouriteScreen = ({ navigation }) => {
    const [favoriteWatches, setFavoriteWatches] = useState([]);

    // Function to load favorite watches from AsyncStorage
    const loadFavoriteWatches = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favoriteWatches');
            if (jsonValue !== null) {
                setFavoriteWatches(JSON.parse(jsonValue));
            } else {
                setFavoriteWatches([]); // Set to empty array if no favorites found
            }
        } catch (error) {
            console.error('Error loading favorite watches:', error);
        }
    };

    // Use useFocusEffect to load favorite watches when the screen gains focus
    useFocusEffect(
        React.useCallback(() => {
            loadFavoriteWatches();
        }, [])
    );

    // Function to remove a single watch from favorites
    const removeFavorite = async (itemId) => {
        try {
            const updatedFavorites = favoriteWatches.filter((watch) => watch.id !== itemId);
            await AsyncStorage.setItem('favoriteWatches', JSON.stringify(updatedFavorites));
            setFavoriteWatches(updatedFavorites); // Update state to trigger re-render
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    // Function to remove all watches from favorites
    const removeAllFavoriteWatches = async () => {
        try {
            await AsyncStorage.removeItem('favoriteWatches');
            setFavoriteWatches([]); // Update state to empty array
            Alert.alert('Success', 'All watches have been removed from favorites.');
        } catch (error) {
            console.error('Error removing all favorite watches:', error);
            Alert.alert('Error', 'Failed to remove all watches from favorites.');
        }
    };

    // Function to handle the confirmation for deleting all favorites
    const deleteAllFavorites = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to remove all watches from favorites?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: async () => {
                        await removeAllFavoriteWatches(); // Call the function to remove all favorite watches
                    }
                }
            ]
        );
    };

    // Render individual watch item in FlatList
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Detail', { item: item })}
        >
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="stretch" />
            <View style={styles.textContainer}>
                <Text style={styles.watchName}>{item.watchName}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFavorite(item.id)}>
                <Ionicons name="trash-outline" size={24} color="red" style={styles.icon} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Favorite Watches</Text>
            {favoriteWatches.length > 0 ? (
                <FlatList
                    data={favoriteWatches}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            ) : (
                <Text style={styles.emptyText}>No favorite watches yet.</Text>
            )}

            <TouchableOpacity onPress={deleteAllFavorites} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete All Favorites</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
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
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default FavouriteScreen;
