import getNodeVisibility from '../helpers/getNodeVisibility';

class TimelineIntervalDate {
  constructor(node, scrollTrigger) {
    this.node = node;
    this.scrollTrigger = scrollTrigger;

    this.config = {
      textSelector: 'timeline__interval-date',
    };

    this.handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  init() {
    this.text = this.node.querySelector(`.${this.config.textSelector}`);
    // this.textWidth = getNodeVisibility(this.text).position.width;
    this.textWidth = 0;
    this.loadNodeVisibility();
    this.setTextProperties();
    this.addEventListeners();
  }

  addEventListeners() {
    this.scrollTrigger.addEventListener(
      'scroll',
      this.handleScrollEvent,
    );
  }

  handleScrollEvent() {
    this.loadNodeVisibility();
    this.setTextProperties();
  }

  loadNodeVisibility() {
    this.visibility = getNodeVisibility(this.node);
  }

  setTextProperties() {
    // don't do anything if element is not visible
    if (!this.visibility.visible) return;

    const offsetThreshold = 60;
    // default: centered
    // element is completely visible, so center text
    // should be same as:  this.visibility.completely
    let offsetLeft = 'auto';

    if (this.visibility.filled) {
      // element is bigger than screen, center text on screen
      const offset = this.visibility.clientWidth / 2 - this.visibility.position.left;
      offsetLeft = offset < offsetThreshold ? offsetThreshold : offset;
    } else if (this.visibility.left && !this.visibility.right) {
      // partially visible on right side, center text in visible part of wrapper
      const offset = (this.visibility.clientWidth - this.visibility.position.left) / 2;
      offsetLeft = offset < offsetThreshold ? offsetThreshold : offset;
    } else if (!this.visibility.left && this.visibility.right) {
      // partially visible on left side, center in visible part of wrapper
      const offsetThresholdRight = this.visibility.position.width - offsetThreshold;
      const offset = this.visibility.position.width - this.visibility.position.right / 2;
      offsetLeft = offset < offsetThresholdRight ? offset : offsetThresholdRight;
    }

    this.setTextOffset(offsetLeft);
  }

  setTextOffset(left) {
    const offsetLeft = `${Math.floor(left)}px`;

    if (this.node.style.paddingLeft !== offsetLeft) {
      this.node.style.paddingLeft = offsetLeft;
    }
  }
}

export default TimelineIntervalDate;
