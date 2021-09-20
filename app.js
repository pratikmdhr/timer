const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('.start');
const resetButton = document.querySelector('.reset');
const circle = document.querySelector('circle');
const perimeter = circle.getAttribute('r') * 2 * Math.PI;

//======================================================
circle.setAttribute('stroke-dasharray', perimeter);
let flag = 0;
let first = 1;
let duration;
let currentOffset = 0;
//======================================================

class Timer {
  constructor(durationInput, startButton, resetButton, callbacks) {
    this.durationInput = durationInput;
    this.startButton = startButton;
    this.resetButton = resetButton;

    if (callbacks) {
      this.onStart = callbacks.onStart;
      this.onTick = callbacks.onTick;
      this.onComplete = callbacks.onComplete;
    }

    this.startButton.addEventListener('click', this.toggle);

    this.resetButton.addEventListener('click', this.reset);
  }

  toggle = () => {
    if (!flag) {
      this.start();
      this.startButton.innerHTML = `<i class="fas fa-pause"></i>`;
      this.startButton.classList.toggle('paused');
      console.log(this.startButton.getAttribute('class'));
    } else {
      this.pause();
      this.startButton.innerHTML = `<i class="fas fa-play"></i>`;
      this.startButton.classList.toggle('paused');
      console.log(this.startButton.getAttribute('class'));
    }
  };

  start = () => {
    if (this.onStart && first) {
      this.onStart(this.timeRemaining);
      first = 0;
    }

    this.tick();
    this.interval = setInterval(this.tick, 20);
    flag = 1;
  };

  pause = () => {
    clearInterval(this.interval);
    flag = 0;
  };

  tick = () => {
    if (this.timeRemaining <= 0) {
      this.pause();
      if (this.onComplete) {
        this.onComplete();
      }
    } else {
      this.timeRemaining = this.timeRemaining - 0.02;

      if (this.onTick) {
        this.onTick(this.timeRemaining);
      }
    }
  };

  reset = () => {
    this.timeRemaining = 20;
    this.pause();
    first = 1;
    this.startButton.classList.remove('paused');
    circle.setAttribute('stroke-dasharray', perimeter);
    circle.setAttribute('stroke-dashoffset', 0);
    this.startButton.innerHTML = `<i class="fas fa-play"></i>`;
  };

  get timeRemaining() {
    return parseFloat(this.durationInput.value);
  }

  set timeRemaining(time) {
    this.durationInput.value = time.toFixed(2);
  }
}

//======================================================
new Timer(durationInput, startButton, resetButton, {
  onStart(totalDuration) {
    duration = totalDuration;
  },
  onTick(timeRemaining) {
    circle.setAttribute(
      'stroke-dashoffset',
      (perimeter * timeRemaining) / duration - perimeter
    );
  },
  onComplete() {
    console.log('Times Up');
  },
});

//======================================================
