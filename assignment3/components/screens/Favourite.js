import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from 'react-native-vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const FavouriteScreen = ({ navigation }) => {
    const [favoriteWatches, setFavoriteWatches] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});

    // Function to load favorite watches from AsyncStorage
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

    useFocusEffect(
        React.useCallback(() => {
            loadFavoriteWatches();
        }, [])
    );

    useEffect(() => {
        loadFavoriteWatches();
    }, []);

    // Toggle selection of an item
    const toggleItemSelection = (itemId) => {
        setSelectedItems((prevSelectedItems) => ({
            ...prevSelectedItems,
            [itemId]: !prevSelectedItems[itemId],
        }));
    };

    // Function to remove selected items from favorites
    const deleteSelectedFavorites = () => {
        // Check if any items are selected
        const selectedIds = Object.keys(selectedItems).filter((itemId) => selectedItems[itemId]);

        if (selectedIds.length === 0) {
            Alert.alert('No Items Selected', 'Please select items to delete.');
            return;
        }

        // Show confirmation dialog
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete the selected items?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const updatedFavorites = favoriteWatches.filter((watch) => !selectedItems[watch.id]);
                            await AsyncStorage.setItem('favoriteWatches', JSON.stringify(updatedFavorites));
                            setFavoriteWatches(updatedFavorites);
                            setSelectedItems({}); // Clear selected items after deletion
                        } catch (error) {
                            console.error('Error removing selected favorites:', error)
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    // Function to remove a single watch from favorites
    const removeFavorite = async (itemId) => {
        try {
            const updatedFavorites = favoriteWatches.filter((watch) => watch.id !== itemId);
            await AsyncStorage.setItem('favoriteWatches', JSON.stringify(updatedFavorites));
            setFavoriteWatches(updatedFavorites);
        } catch (error) {
            console.error('Error removing favorite:', error);
            Alert.alert('Error', 'Failed to remove the watch from favorites.');
        }
    };

    // Render individual watch item in FlatList with checkbox for selection
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Detail', { item })}
        >
            <TouchableOpacity onPress={() => toggleItemSelection(item.id)} style={styles.checkbox}>
                <Ionicons
                    name={selectedItems[item.id] ? 'checkbox-outline' : 'square-outline'}
                    size={24}
                    color={selectedItems[item.id] ? 'green' : 'black'}
                />
            </TouchableOpacity>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="stretch" />
            <View style={styles.textContainer}>
                <Text style={styles.watchName}>{item.watchName}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.iconContainer}>
                <Ionicons
                    name="trash-outline"
                    size={24}
                    color="red"
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Favorite Watches</Text>
            {favoriteWatches.length > 0 ? (
                <>
                    <FlatList
                        data={favoriteWatches}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    <TouchableOpacity onPress={deleteSelectedFavorites} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete Selected</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.emptyText}>No favorite watches yet.</Text>
            )}
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
        paddingTop: 50,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 10,
        padding: 5,
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
    iconContainer: {
        marginLeft: 20,
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
