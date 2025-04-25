import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Platform  } from 'react-native';
import { getPlayers } from '../../services/playerService';
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
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    const fetchData = async () => {
      const allPlayers = await getPlayers();
      setPlayers(allPlayers);

      const index = allPlayers.findIndex(p => p.id === id);
      setPlayerIndex(index);

      if (index !== -1) {
        setPlayer(allPlayers[index]);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
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
          <View style={[styles.videoContainer, { width: screenWidth - 40, height: (screenWidth - 40) * 0.56 }]}>
            <ExpoVideo
              ref={videoRef}
              source={{ uri: player.videoUrl }} 
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              style={{ width: '100%', height: '100%' }}
              videoStyle={Platform.OS === 'web' ? { position: 'relative' } : undefined}
              isLooping
              shouldPlay
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  container: {
    padding: 20,
    backgroundColor: '#111',
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 18,
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  detailContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  label: {
    fontWeight: 'bold',
    color: '#888',
  },
  videoContainer: {
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  video: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },  
  
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    borderColor: '#ff3b30',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: '#222',
    marginHorizontal: 8,
  },
  disabled: {
    borderColor: '#777',
    opacity: 0.5,
    backgroundColor: '#333',
  },
  navText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
