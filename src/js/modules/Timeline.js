class Timeline {
  constructor() {
    this.config = {
      wrapperSelector: 'timeline__wrapper',
      phaseSelector: 'timeline__phase-block',
      intervalDateSelector: 'timeline__interval-date-wrapper',
    };
  }

  init() {
    this.node = document.querySelector(`.${this.config.wrapperSelector}`);
    this.setupTimelinePhase();
    this.setupTimelineIntervalDate();
  }

  setupTimelinePhase() {
    const nodes = this.node.querySelectorAll(`.${this.config.phaseSelector}`);

    for (let i = 0; i < nodes.length; i++) {
      const timelinePhaseBlock = new TimelinePhaseBlock(nodes[i], this.node);
      timelinePhaseBlock.init();
    }
  }

  setupTimelineIntervalDate() {
    const nodes = this.node.querySelectorAll(`.${this.config.intervalDateSelector}`);

    for (let i = 0; i < nodes.length; i++) {
      const timelineIntervalDate = new TimelineIntervalDate(nodes[i], this.node);
      timelineIntervalDate.init();
    }
  }
}

class TimelinePhaseBlock {
  constructor(node, scrollTrigger) {
    this.node = node;
    this.scrollTrigger = scrollTrigger;

    this.config = {
      titleSelector: 'timeline__phase-title',
      contentSelector: 'timeline__phase-content',
      titleClassActive: 'timeline__phase-title--active',
      contentClassActive: 'timeline__phase-content--active',
      fadeThreshold: 250,
    };
  }

  init() {
    this.title = this.node.querySelector(`.${this.config.titleSelector}`);
    this.content = this.node.querySelector(`.${this.config.contentSelector}`);

    this.loadNodeVisibility();
    this.setTextProperties();
    this.addEventListeners();
  }

  addEventListeners() {
    this.scrollTrigger.addEventListener('scroll', event => {
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
    if (this.visibility.visible) {
      // don't do anything if element is not visible

      if (this.visibility.centered || this.visibility.filled) {
        this.title.classList.add(this.config.titleClassActive);
        this.content.classList.add(this.config.contentClassActive);
      } else {
        this.title.classList.remove(this.config.titleClassActive);
        this.content.classList.remove(this.config.contentClassActive);
      }

      if (
        (!this.visibility.left && this.visibility.right && !this.visibility.centered) ||
        (this.visibility.left && !this.visibility.right && !this.visibility.centered)
      ) {
        // partially visible on one side, start fading
        let opacity = 0.65;
        if (this.visibility.position.right <= this.config.fadeThreshold) {
          opacity = (opacity * this.visibility.position.right) / this.config.fadeThreshold;
        } else if (
          this.visibility.position.left >=
          this.visibility.clientWidth - this.config.fadeThreshold
        ) {
          opacity =
            (opacity * (this.visibility.clientWidth - this.visibility.position.left)) /
            this.config.fadeThreshold;
        }
        this.title.style.opacity = opacity;
        this.content.style.opacity = opacity;
      } else {
        // reset opacity, so css styling can be applied
        this.title.style.opacity = '';
        this.content.style.opacity = '';
      }
    }
  }
}

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
    this.scrollTrigger.addEventListener('scroll', event => {
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
        this.text.style.marginLeft =
          offset < offsetThreshold ? `${offsetThreshold}px` : `${offset}px`;
        this.text.style.marginRight = 'auto';
      } else if (this.visibility.left && !this.visibility.right) {
        // partially visible on right side, center text in visible part of wrapper
        const offset = (this.visibility.clientWidth - this.visibility.position.left) / 2;
        this.text.style.marginLeft = `${offset}px`;
        this.text.style.marginRight = 'auto';
      } else if (!this.visibility.left && this.visibility.right) {
        // partially visible on left side, center in visible part of wrapper
        const offset = (this.visibility.position.right - this.textWidth) / 2;
        this.text.style.marginRight =
          offset < offsetThreshold ? `${offsetThreshold}px` : `${offset}px`;
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

const getNodeVisibility = node => {
  // position: left, top, right, bottom, x, y, width, height
  const position = node.getBoundingClientRect();
  const clientWidth = document.documentElement.clientWidth;

  const left = position.left <= clientWidth && position.left >= 0;
  const right = position.right <= clientWidth && position.right >= 0;

  const centered = position.left < clientWidth / 2 && position.right > clientWidth / 2;
  const filled = position.left <= 0 && position.right >= clientWidth;
  const completely = left && right;
  const visible = left || right || filled;

  const clientWidthRatio = position.width / clientWidth;

  return {
    visible,
    filled,
    completely,
    centered,
    left,
    right,
    position,
    clientWidth,
    clientWidthRatio,
  };
};

const TimelineModule = (() => {
  const init = () => {
    const timeline = new Timeline();
    timeline.init();
  };

  return {
    init,
  };
})();

export default TimelineModule;
