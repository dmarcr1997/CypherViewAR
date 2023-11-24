import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Camera, CameraType } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';
import Canvas from 'react-native-canvas';

const TensorCamera = cameraWithTensors(Camera);
const { width, height } = Dimensions.get('window');

export default function App() {
  const [model, setModel] = useState<cocoSsd.ObjectDetection>();
  const [permission, requestPermission] = Camera.useCameraPermissions();
  let textureDims = Platform.OS == 'ios' 
    ? {height: 1920, width: 1080}
    : {height: 1200, width: 1600};

  function handleCameraReady(images: any) {
    const loop = async () => {;
      const nextImageTensor = images.next().value;
      if(!model || !nextImageTensor) throw new Error('No model or image tensor');
      model
        .detect(nextImageTensor)
        .then((prediction) => {
          
        }).catch((error) => {
          console.log(error);
        });

      requestAnimationFrame(loop);
    }
    loop();
  }

  function drawRectangle(
    prediction: cocoSsd.DetectedObject[], 
    nextImageTensor: any
  ) {}

  async function handleCanvas(can: Canvas){
    if(can) {
      can.height = height;
      can.width = width;
    }
  }
  useEffect(() => {
    (async () => {
      await tf.ready();
      setModel(await cocoSsd.load());
    })
  }, [])
  return (
    <View style={styles.container}>
      <TensorCamera style={styles.camera}
        type={CameraType.back}
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        onReady={handleCameraReady}
        autorender={true}
        useCustomShadersToResize={false}
      />
      <Canvas style={styles.canvas} ref={handleCanvas} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  camera: {},
  canvas: {}
});
