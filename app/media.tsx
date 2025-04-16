import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet } from "react-native";
import { Player } from "../models/types"; // Asegúrate de que la ruta sea correcta
import { getPlayers } from "../services/playerService"; // Importa la función getPlayers de forma individual

const MediaScreen = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await getPlayers(); // Usa la función directamente
      setPlayers(data);
    };
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchText.toLowerCase()) &&
    (selectedPosition ? player.position === selectedPosition : true)
  );

  return (
    <View style={styles.container}>
      {/* Buscador */}
      <TextInput
        style={styles.searchBox}
        placeholder="Buscar jugador..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Filtro por posición */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por posición:</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="Escribe una posición"
          value={selectedPosition}
          onChangeText={setSelectedPosition}
        />
      </View>

      {/* Lista de jugadores */}
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.playerImage} />
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerPosition}>{item.position}</Text>
            <Button title="Ver Detalles" onPress={() => alert(`Ver detalles de ${item.name}`)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  searchBox: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  filterInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  playerCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3, // Solo para Android
  },
  playerImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  playerPosition: {
    fontSize: 14,
    color: "#777",
    marginBottom: 15,
  },
});

export default MediaScreen;
