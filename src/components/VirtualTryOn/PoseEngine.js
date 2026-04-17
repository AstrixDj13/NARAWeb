import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

let detector = null;

export const initializeDetector = async () => {
    if (detector) return detector;

    await tf.ready();

    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true
    };

    detector = await poseDetection.createDetector(model, detectorConfig);
    return detector;
};

export const detectPose = async (video) => {
    if (!detector || !video || video.readyState < 2) {
        return null;
    }
    const poses = await detector.estimatePoses(video);
    if (poses.length > 0) {
        return poses[0]; // Return the first detected pose
    }
    return null;
};
