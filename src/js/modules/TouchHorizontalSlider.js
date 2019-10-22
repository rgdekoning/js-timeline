import Hammer from 'hammerjs';

class TouchHorizontalSlider {
  constructor(wrapperSelector, itemSelector) {
    this.config = {
      wrapperSelector,
      itemSelector,
      options: {
        pan: { threshold: 0, pointers: 0 },
      },
    };

    this.panHandler = this.panHandler.bind(this);
  }

  init() {
    this.wrapperNode = document.querySelector(`.${this.config.wrapperSelector}`);
    this.hammer = new Hammer.Manager(this.wrapperNode);
    this.addPanRecognizer();
    this.addEventListeners();
  }

  setPanStartPositionX() {
    this.panStartPositionX = this.wrapperNode.scrollLeft;
  }

  panStart() {
    this.isPanning = true;
    this.setPanStartPositionX();
  }

  panStop() {
    this.isPanning = false;
  }

  addPanRecognizer() {
    this.hammer.add(new Hammer.Pan(this.config.options.pan));
  }

  addEventListeners() {
    this.hammer.on('pan', this.panHandler);
  }

  panHandler(e) {
    if (!this.isPanning) {
      this.panStart();
    }

    this.wrapperNode.scrollLeft = this.panStartPositionX - e.deltaX;

    if (e.isFinal) {
      this.panStop();
    }
  }
}

export default TouchHorizontalSlider;
