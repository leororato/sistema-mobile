import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';
import { excluirTodasTabelas } from '../database/criarTabelas';

const UserOptionsModal = ({ visible, onClose, navigationRef }) => {
    const translateY = new Animated.Value(300);

    React.useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(translateY, {
                toValue: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleDesconectar = async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('id');
        await SecureStore.deleteItemAsync('nivelAcesso');
        await SecureStore.deleteItemAsync('nome');

        if (navigationRef.current) {
            navigationRef.current.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            );
        }

        onClose();
    };

    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={handleDesconectar}>
                        <Text style={styles.optionText}>Desconectar</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '100%',
        height: '50%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    closeButton: {
        alignItems: 'flex-end',
        marginRight: 10,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    option: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionText: {
        fontSize: 18,
        color: '#333',
    },
});

export default UserOptionsModal;
