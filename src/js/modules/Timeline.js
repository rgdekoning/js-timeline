import TimelinePhaseBlock from './TimelinePhaseBlock';
import TimelineIntervalDate from './TimelineIntervalDate';
import TouchHorizontalSlider from './TouchHorizontalSlider';

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

    this.touchHorizontalSlider = new TouchHorizontalSlider(
      this.config.wrapperSelector,
      this.config.phaseSelector,
    );
    this.touchHorizontalSlider.init();
  }

  setupTimelinePhase() {
    const nodes = this.node.querySelectorAll(`.${this.config.phaseSelector}`);

    for (let i = 0; i < nodes.length; i++) {
      const timelinePhaseBlock = new TimelinePhaseBlock(nodes[i], this.node);
      timelinePhaseBlock.init();
    }
  }

  setupTimelineIntervalDate() {
    const nodes = this.node.querySelectorAll(
      `.${this.config.intervalDateSelector}`,
    );

    for (let i = 0; i < nodes.length; i++) {
      const timelineIntervalDate = new TimelineIntervalDate(
        nodes[i],
        this.node,
      );
      timelineIntervalDate.init();
    }
  }
}

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
