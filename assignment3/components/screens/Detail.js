import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const DetailsScreen = ({ route }) => {
    const { item } = route.params;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const handleAddToFavourite = () => {
        console.log('Add to favorites:', item);
    };

    const renderFeedbackItem = ({ item }) => (
        <View style={styles.feedbackContainer}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            <Text style={styles.comment}>{item.comment}</Text>
            <Text style={styles.rating}>Rating: {item.rating}/5</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.favouriteButton} onPress={handleAddToFavourite}>
                <Ionicons name="heart-outline" size={24} color="red" />
            </TouchableOpacity>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.watchName}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.sectionTitle}>Feedbacks:</Text>
            <FlatList
                data={item.feedbacks}
                renderItem={renderFeedbackItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.feedbackList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
        backgroundColor: '#fff',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 12,
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'tomato',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    feedbackContainer: {
        marginBottom: 12,
        borderBottomWidth: 1,
        paddingBottom: 8,
        borderColor: '#ccc',
    },
    author: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    comment: {
        fontSize: 16,
        marginBottom: 4,
    },
    rating: {
        fontSize: 14,
        color: 'green',
    },
    favouriteButton: {
        marginTop: 16,
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'red',
        width: 45,
        alignSelf: 'flex-end',
    },
    feedbackList: {
        flexGrow: 1,
        width: '100%',
    },
});

export default DetailsScreen;
