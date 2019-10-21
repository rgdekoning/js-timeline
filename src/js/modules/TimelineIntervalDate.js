import getNodeVisibility from '../helpers/getNodeVisibility';


class TimelineIntervalDate {
  constructor(node, scrollTrigger) {
    this.node = node;
    this.scrollTrigger = scrollTrigger;

    this.config = {
      textSelector: 'timeline__interval-date',
    };

    this.visibility = {
    // not needed?
    // left: false,
    // right: false,
    };
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
    this.scrollTrigger.addEventListener('scroll', () => {
      this.handleScrollEvent();
    });
  }

  handleScrollEvent() {
    this.loadNodeVisibility();
    this.setTextProperties();
  }

  loadNodeVisibility() {
    this.visibility = getNodeVisibility(this.node);
  }

  setTextProperties() {
    const offsetThreshold = 50;
    if (this.visibility.visible) {
    // don't do anything if element is not visible
      if (this.visibility.filled) {
        // element is bigger than screen, center text on screen
        const offset = this.visibility.clientWidth / 2 - this.visibility.position.left;
        this.text.style.marginLeft = offset < offsetThreshold ? `${offsetThreshold}px` : `${offset}px`;
        this.text.style.marginRight = 'auto';
      } else if (this.visibility.left && !this.visibility.right) {
        // partially visible on right side, center text in visible part of wrapper
        const offset = (this.visibility.clientWidth - this.visibility.position.left) / 2;
        this.text.style.marginLeft = `${offset}px`;
        this.text.style.marginRight = 'auto';
      } else if (!this.visibility.left && this.visibility.right) {
        // partially visible on left side, center in visible part of wrapper
        const offset = (this.visibility.position.right - this.textWidth) / 2;
        this.text.style.marginRight = offset < offsetThreshold ? `${offsetThreshold}px` : `${offset}px`;
        this.text.style.marginLeft = 'auto';
      } else {
        // element is completely visible, so center text
        // should be same as:  this.visibility.completely
        this.text.style.marginLeft = 'auto';
        this.text.style.marginRight = 'auto';
      }
    }
  }
}

export default TimelineIntervalDate;
