import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const FeedbackCard = ({ feedback, formatDate }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.author}>{feedback.author}</Text>
            <Text style={styles.date}>{formatDate(feedback.date)}</Text>
            <View style={styles.rating}>
                {Array.from({ length: 5 }, (_, i) => (
                    <Icon
                        key={i}
                        name={i < feedback.rating ? 'star' : 'star-o'}
                        size={16}
                        color="gold"
                    />
                ))}
            </View>
            <Text style={styles.comment}>{feedback.comment}</Text>
        </View>
    );
};

const DetailsScreen = ({ route }) => {
    const { item } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showFullFeedbacks, setShowFullFeedbacks] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        checkIsFavorite();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const checkIsFavorite = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favoriteWatches');
            if (jsonValue !== null) {
                const favoriteWatches = JSON.parse(jsonValue);
                setIsFavorite(favoriteWatches.some((watch) => watch.id === item.id));
            }
        } catch (error) {
            console.error('Error loading favorite watches:', error);
        }
    };

    const handleToggleFavorite = async () => {
        try {
            let updatedFavorites = [];
            const jsonValue = await AsyncStorage.getItem('favoriteWatches');
            if (jsonValue !== null) {
                updatedFavorites = JSON.parse(jsonValue);
            }
            const existingIndex = updatedFavorites.findIndex((watch) => watch.id === item.id);
            if (existingIndex === -1) {
                updatedFavorites.push(item);
                setIsFavorite(true);
            } else {
                updatedFavorites.splice(existingIndex, 1);
                setIsFavorite(false);
            }
            await AsyncStorage.setItem('favoriteWatches', JSON.stringify(updatedFavorites));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const renderFeedbacks = () => {
        if (!item || !item.feedbacks || !Array.isArray(item.feedbacks) || item.feedbacks.length === 0) {
            return <Text style={styles.noFeedbacks}>There are no feedbacks for this item.</Text>;
        }
    
        return (
            <View style={styles.feedbackContainer}>
                <Text style={styles.sectionTitle}>Feedbacks</Text>
                {item.feedbacks.map((feedback, index) => (
                    <FeedbackCard key={index} feedback={feedback} formatDate={formatDate} />
                ))}
            </View>
        );
    };
    

    if (!item) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Item data not available</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeTab')}>
                    <Ionicons name="home" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToggleFavorite}>
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isFavorite ? 'red' : 'black'}
                        style={styles.favoriteIcon}
                    />
                </TouchableOpacity>
            </View>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{item.watchName}</Text>
                <Text style={styles.brand}>Brand: {item.brandName}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <Text style={styles.additionalInfo}>Automatic: {item.isAutomatic ? 'Yes' : 'No'}</Text>
                <Text style={styles.description}>
                    {showFullDescription ? item.description : `${item.description.slice(0, 100)}...`}
                </Text>
                <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                    <Text style={styles.readMoreButton}>
                        {showFullDescription ? ' Less' : ' More'}
                    </Text>
                </TouchableOpacity>
            </View>
            {renderFeedbacks()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
    },
    favoriteIcon: {
        marginLeft: 20,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    detailsContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    brand: {
        fontSize: 18,
        color: '#888',
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'tomato',
        marginBottom: 16,
    },
    additionalInfo: {
        fontSize: 16,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    readMoreButton: {
        color: 'blue',
        textAlign:'center'
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    feedbackContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    author: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    rating: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    comment: {
        fontSize: 16,
    },
    noFeedbacks: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 16,
    },
});

export default DetailsScreen;
