import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

const DetailsScreen = ({ route }) => {
    const { item } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        checkIsFavorite(); // Kiểm tra xem mục hiện tại có trong danh sách yêu thích không
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const checkIsFavorite = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favoriteWatches');
            if (jsonValue !== null) {
                const favoriteWatches = JSON.parse(jsonValue);
                const isItemFavorite = favoriteWatches.some((watch) => watch.id === item.id);
                setIsFavorite(isItemFavorite);
            }
        } catch (error) {
            console.error('Error loading favorite watches:', error);
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            checkIsFavorite();
        }, [])
    );


    const saveFavoriteWatches = async (newFavoriteWatches) => {
        try {
            await AsyncStorage.setItem('favoriteWatches', JSON.stringify(newFavoriteWatches));
        } catch (error) {
            console.error('Error saving favorite watches:', error);
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
                updatedFavorites.push(item); // Thêm vào danh sách yêu thích
                setIsFavorite(true);
            } else {
                updatedFavorites.splice(existingIndex, 1); // Xóa khỏi danh sách yêu thích
                setIsFavorite(false);
            }

            await saveFavoriteWatches(updatedFavorites); // Lưu danh sách yêu thích mới vào AsyncStorage
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const renderFeedbacks = () => {
        if (!item || !item.feedbacks || !Array.isArray(item.feedbacks) || item.feedbacks.length === 0) {
            return <Text style={styles.noFeedbacks}>There is no feedback</Text>;
        }

        return item.feedbacks.map((feedback, index) => (
            <View key={index} style={styles.feedbackContainer}>
                <Text style={styles.author}>{feedback.author}</Text>
                <Text style={styles.date}>{formatDate(feedback.date)}</Text>
                <View style={styles.rating}>
                    {Array.from({ length: 5 }, (_, i) => {
                        return (
                            <Icon
                                key={i}
                                name={i < feedback.rating ? 'star' : 'star-o'}
                                size={16}
                                color="gold"
                            />
                        );
                    })}
                </View>
                <Text style={styles.comment}>{feedback.comment}</Text>
            </View>
        ));
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
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title}>{item.watchName}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>Price: ${item.price}</Text>
                <Text style={styles.brand}>Brand: {item.brandName}</Text>
                <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
                <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="red" />
                <Text style={styles.favoriteButtonText}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Feedbacks:</Text>
                {renderFeedbacks()}
            </View>
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 16,
    },
    content: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'tomato',
        marginBottom: 8,
    },
    brand: {
        fontSize: 16,
        marginBottom: 16,
    },
    addToCartButton: {
        backgroundColor: 'tomato',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'red',
        padding: 12,
        borderRadius: 8,
    },
    favoriteButtonText: {
        marginLeft: 8,
        color: 'red',
        fontWeight: 'bold',
    },
    noFeedbacks: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 16,
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 16,
    },
});

export default DetailsScreen;
