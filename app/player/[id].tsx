import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { getPlayers, getPlayerById } from '../../services/playerService';
import { Player } from '../../models/types';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const videoRef = useRef<ExpoVideo>(null);
  const [timeStamp, setTimeStamp] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      const allPlayers = await getPlayers();
      setPlayers(allPlayers);

      const index = allPlayers.findIndex(p => p.id === id);
      setPlayerIndex(index);

      if (index !== -1) {
        const selected = allPlayers[index];
        setPlayer(selected);
        setTimeStamp(Date.now());
      } else {
        router.replace('/');
      }
    };

    fetchData();
  }, [id]);

  const goToPrevious = () => {
    if (playerIndex > 0) {
      const prevPlayer = players[playerIndex - 1];
      router.replace(`/player/${prevPlayer.id}`);
    }
  };

  const goToNext = () => {
    if (playerIndex < players.length - 1) {
      const nextPlayer = players[playerIndex + 1];
      router.replace(`/player/${nextPlayer.id}`);
    }
  };

  const goBack = () => {
    router.replace('/');
  };

  if (!player) return <Text style={styles.loading}>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Text style={styles.backText}>⬅ Listado</Text>
      </TouchableOpacity>

      <View style={styles.detailContainer}>
        <Image source={{ uri: player.imageUrl }} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.name}>{player.name}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Posición:</Text> {player.position}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Edad:</Text> {player.age} años</Text>
          <Text style={styles.detail}><Text style={styles.label}>Altura:</Text> {player.height} cm</Text>
          <Text style={styles.detail}><Text style={styles.label}>Número:</Text> {player.number}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Equipo:</Text> {player.team}</Text>
        </View>
      </View>

      {player.videoUrl && (
        <View style={styles.videoContainer}>
          <ExpoVideo
           ref={videoRef}
           source={{ uri: player.videoUrl + `?t=${timeStamp}` }}
           useNativeControls
           resizeMode={ResizeMode.COVER}
           style={styles.video}
          />

        </View>
      )}

      <View style={styles.navButtons}>
        <TouchableOpacity onPress={goToPrevious} disabled={playerIndex === 0} style={[styles.navButton, playerIndex === 0 && styles.disabled]}>
          <Text style={styles.navText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNext} disabled={playerIndex === players.length - 1} style={[styles.navButton, playerIndex === players.length - 1 && styles.disabled]}>
          <Text style={styles.navText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
  container: {
    padding: 20,
    backgroundColor: '#111',
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  backText: {
    color: '#fff',
  },
  detailContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
  },
  videoContainer: {
    height: 300,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  disabled: {
    borderColor: '#777',
    opacity: 0.5,
  },
  navText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
