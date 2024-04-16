import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons'; // Import Ionicons

import { watchData } from '../../data/db'; // Ensure this path is correct based on your project structure

export default function HomeScreen({ navigation }) {
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Detail', { item: item })}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="stretch"
            />
            <View style={styles.textContainer}>
                <Text style={styles.watchName}>{item.watchName}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
            {/* Add favorite icon */}
            <TouchableOpacity onPress={() => handleAddToFavourite(item)}>
                <Ionicons name="heart-outline" size={24} color="red" style={styles.icon} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const handleAddToFavourite = (item) => {
        // Handle logic to add item to favorite list
        // You can implement this logic according to your requirement
        console.log('Added to favorite:', item);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Watches</Text>
            <FlatList
                data={watchData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

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
