import { View, Text, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a DevFlow Mobile 🚀</Text>

      <Link href="/media" asChild>
        <Button title="Ir a Multimedia" />
      </Link>

      <Link href="/history" asChild>
        <Button title="Ir al Historial" />
      </Link>

      <Link href="/store" asChild>
        <Button title="Ir a la Tienda" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
});
