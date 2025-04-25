import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Player } from '../models/types'; 
import { getPlayers } from '../services/playerService'; 

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const router = useRouter();

  const positions = ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPlayers(); 
      setPlayers(data);
      setFilteredPlayers(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = players.filter(player =>
      player.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedPosition ? player.position === selectedPosition : true)
    );
    setFilteredPlayers(filtered);
  }, [searchText, selectedPosition, players]);

  const handlePositionFilter = (position: string) => {
    setSelectedPosition(position);
  };

  const goToPlayer = (id: string) => {
    router.push(`/player/${id}`);
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a DevFlow</Text>
      
      {/* Campo de búsqueda */}
      <TextInput
        placeholder="Buscar jugador..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />
      
      {/* Filtros por posición */}
      <ScrollView horizontal style={styles.filterContainer}>
        {positions.map(pos => (
          <TouchableOpacity
            key={pos}
            onPress={() => handlePositionFilter(pos)}
            style={[styles.filterButton, selectedPosition === pos && styles.activeFilter]}
          >
            <Text style={styles.filterText}>{pos}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Carrusel de jugadores */}
      <ScrollView horizontal style={styles.carousel}>
        {filteredPlayers.map(player => (
          <TouchableOpacity key={player.id} style={styles.playerCard} onPress={() => goToPlayer(player.id)}>
            <Image source={{ uri: player.imageUrl }} style={styles.playerImage} />
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerPosition}>{player.position}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: 'red',
    paddingHorizontal: 20,  // Asegura que los botones tengan un espacio adecuado horizontal
    paddingVertical: 8,     // Ajusta la altura vertical
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,            // Establece una altura fija para el botón
  },
  activeFilter: {
    backgroundColor: 'red',
  },
  filterText: {
    color: '#fff',
    fontSize: 16,
  },
  carousel: {
    flexDirection: 'row',
  },
  playerCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    width: 180,
    justifyContent: 'center',
  },
  playerImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',  // Asegura que las imágenes se ajusten bien dentro del espacio disponible
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerPosition: {
    color: '#ccc',
    fontSize: 14,
  },
});

