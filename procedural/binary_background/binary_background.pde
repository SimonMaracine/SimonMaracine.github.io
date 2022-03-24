final int DIGIT_WIDTH = 16;

void setup() {
  size(1280, 720);
}

void draw() {
  background(255);

  textSize(DIGIT_WIDTH * 1.5f);

  for (int j = 0; j < floor(720 / 24); j++) {
    for (int i = 0; i < 1280 / DIGIT_WIDTH; i++) {
      float digit = random(0.0f, 1.0f);

      fill(random(150.0f, 250.0f));  // 100.0f, 250.0f

      if (digit < 0.5f) {
        text("0", i * DIGIT_WIDTH, j * 24 + 22);  
      } else {
        text("1", i * DIGIT_WIDTH, j * 24 + 22);
      }
    }
  }
  
  
  save("test.jpg");
  noLoop();
}
