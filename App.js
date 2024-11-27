import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const App = () => {
  const [suppliers, setSuppliers] = useState([]); // Lista de fornecedores
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [image, setImage] = useState(null); // Imagem associada ao fornecedor

  // Função para adicionar fornecedor
  const addSupplier = () => {
    if (name && address && contact && category) {
      setSuppliers([
        ...suppliers,
        {
          id: Date.now().toString(),
          name,
          address,
          contact,
          category,
          image: image || 'https://reactnative.dev/img/tiny_logo.png', // Imagem padrão ou selecionada
        },
      ]);
      setName('');
      setAddress('');
      setContact('');
      setCategory('');
      setImage(null);
    } else {
      Alert.alert('Erro', 'Preencha todos os campos!');
    }
  };

  // Função para abrir o seletor de imagens
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão Necessária', 'Permita o acesso à galeria para adicionar imagens.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Torna a imagem quadrada
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Filtragem da lista com base na pesquisa
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Formulário de Cadastro */}
      <Text style={styles.header}>Cadastro de Fornecedores</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Fornecedor"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Contato"
        value={contact}
        onChangeText={setContact}
      />
      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={category}
        onChangeText={setCategory}
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>
          {image ? 'Imagem Selecionada' : 'Selecionar Imagem'}
        </Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
      <Button title="Adicionar Fornecedor" onPress={addSupplier} />

      {/* Campo de Pesquisa */}
      <TextInput
        style={styles.input}
        placeholder="Pesquisar por nome ou categoria"
        value={search}
        onChangeText={setSearch}
      />

      {/* Lista de Fornecedores */}
      <FlatList
        data={filteredSuppliers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.supplierCard}>
            <Image source={{ uri: item.image }} style={styles.supplierImage} />
            <View>
              <Text style={styles.supplierName}>{item.name}</Text>
              <Text>{item.address}</Text>
              <Text>{item.contact}</Text>
              <Text style={styles.supplierCategory}>{item.category}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyList}>Nenhum fornecedor encontrado</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  imagePicker: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  supplierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  supplierImage: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 25,
  },
  supplierName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  supplierCategory: {
    fontStyle: 'italic',
    color: '#666',
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default App;
