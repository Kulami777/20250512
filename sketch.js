let facemesh;
let video;
let predictions = [];
const facePoints = [
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];
const leftEyePoints = [
  243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112,
  133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155
];
const rightEyePoints = [
  359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255,
  263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249
];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  // 翻轉畫布以修正鏡像顛倒
  translate(width, 0); // 將畫布移動到右側
  scale(-1, 1); // 水平翻轉畫布

  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 繪製臉部連線
    drawConnections(keypoints, facePoints, color(255, 0, 0)); // 紅色線條

    // 繪製左眼連線
    drawConnections(keypoints, leftEyePoints, color(0, 0, 255)); // 藍色線條

    // 繪製右眼連線
    drawConnections(keypoints, rightEyePoints, color(0, 255, 0)); // 綠色線條
  }
}

function drawConnections(keypoints, points, lineColor) {
  stroke(lineColor); // 設定線條顏色
  strokeWeight(5); // 線條粗細為5

  for (let i = 0; i < points.length - 1; i++) {
    const startIdx = points[i];
    const endIdx = points[i + 1];
    if (keypoints[startIdx] && keypoints[endIdx]) {
      const [x1, y1] = keypoints[startIdx];
      const [x2, y2] = keypoints[endIdx];
      line(x1, y1, x2, y2); // 繪製連線
    } else {
      console.warn(`Invalid keypoints: ${startIdx}, ${endIdx}`);
    }
  }
}
