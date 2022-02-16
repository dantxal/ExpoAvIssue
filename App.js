import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Constants from 'expo-constants';
import {Audio} from 'expo-av';

export default function App() {
  const [status1, setStatus1] = useState();
  const [status2, setStatus2] = useState();
  const {current: sound} = useRef(new Audio.Sound());
  const [currentStatus, setStatus] = useState();

  function customOnPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      setStatus(status);
    }
    console.log(
      `Current position/Duration: ${status.positionMillis}/${status.durationMillis}`,
    );
  }

  async function playSoundFromCloudinary() {
    try {
      if (currentStatus && currentStatus.isLoaded) {
        console.log('Stopping sound...');
        await sound.stopAsync();
        console.log('unloading sound...');
        await sound.unloadAsync();
      }

      console.log('loading audacity sound...');
      await sound.loadAsync(
        require('./assets/file_downloaded_from_cloudinary.mp3'),
      );
      sound.setProgressUpdateIntervalAsync(2000);
      sound.setOnPlaybackStatusUpdate(customOnPlaybackStatusUpdate);
      await sound.playAsync();
      setStatus1(await sound.getStatusAsync());
    } catch (err) {
      console.error(err);
    }
  }

  async function playReencodedSound() {
    try {
      if (currentStatus && currentStatus.isLoaded) {
        console.log('Stopping sound.');
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      console.log('load audacity sound');
      await sound.loadAsync(require('./assets/reencoded_by_audacity.mp3'));
      sound.setProgressUpdateIntervalAsync(2000);
      sound.setOnPlaybackStatusUpdate(customOnPlaybackStatusUpdate);
      await sound.playAsync();
      setStatus2(await sound.getStatusAsync());
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={playSoundFromCloudinary}>
        <Text style={styles.buttonText}>Load track from cloudinary</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={playReencodedSound}>
        <Text style={styles.buttonText}>Load reencoded track</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  button: {
    margin: 10,
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
