import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Player } from "../models/types";
import { getPlayers } from "../services/playerService";
import { Link } from "expo-router";


const positions = ["Base", "Escolta", "Alero", "Ala-Pívot", "Pívot"];

export default function MediaScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await getPlayers();
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
        placeholderTextColor="#999"
      />

      {/* Filtros */}
      <View style={styles.filterContainer}>
        {positions.map(pos => (
          <TouchableOpacity
            key={pos}
            onPress={() => setSelectedPosition(pos)}
            style={[styles.filterButton, selectedPosition === pos && styles.activeFilter]}
          >
            <Text style={styles.filterText}>{pos}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Listado en grilla */}
      
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.playerImage} />
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerPosition}>{item.position}</Text>
            <Link href={`/player/${item.id}`} asChild>
              <TouchableOpacity style={styles.detailButton}>
                <Text style={styles.detailButtonText}>Ver Detalles</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        numColumns={3} // mostramos 3 tarjetas por fila
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkred", // rojo oscuro
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  searchBox: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#000",
    marginBottom: 15,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    backgroundColor: "#222",
  },
  activeFilter: {
    backgroundColor: "red",
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  playerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    margin: 10,
    width: 250, // <<< MÁS ESTRECHA
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },  
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  playerPosition: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  detailButton: {
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 8,
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

