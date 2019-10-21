import getNodeVisibility from '../helpers/getNodeVisibility';

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
        (
          !this.visibility.left
          && this.visibility.right
          && !this.visibility.centered
        ) || (
          this.visibility.left
          && !this.visibility.right
          && !this.visibility.centered
        )
      ) {
        // partially visible on one side, start fading
        let opacity = 0.65;
        if (this.visibility.position.right <= this.config.fadeThreshold) {
          opacity = (opacity * this.visibility.position.right) / this.config.fadeThreshold;
        } else if (
          this.visibility.position.left >= this.visibility.clientWidth - this.config.fadeThreshold
        ) {
          opacity = (
            opacity * (this.visibility.clientWidth - this.visibility.position.left))
            / this.config.fadeThreshold;
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

export default TimelinePhaseBlock;
