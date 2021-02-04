// Generates section of progress bar between step circles
function stepsBarFragment(isCompleted) {
  const stepsBarFragment = document.createElement('div');
  stepsBarFragment.className = 'steps-bar-fragment';
  stepsBarFragment.classList.toggle('completed', isCompleted);
  
  return stepsBarFragment;
}

// Generates a wrapper that includes a step circle and a label
function stepsBarCircle(isCurrent, labelText) {
  const stepsBarCircleWrapper = document.createElement('div');
  stepsBarCircleWrapper.className = 'steps-bar-circle-wrapper';
  const stepsBarCircle = document.createElement('div');
  stepsBarCircle.className = 'steps-bar-circle';
  stepsBarCircle.classList.toggle('current', isCurrent);
  stepsBarCircleWrapper.appendChild(stepsBarCircle);

  const label = document.createElement('p');
  label.innerText = labelText || '';
  stepsBarCircleWrapper.appendChild(label);

  return stepsBarCircleWrapper;
}

// CSS used by every progress bar on the page
function createCSS() {
  let style = document.createElement('style');
  
  style.innerHTML = `
  /* Style rules for progress bar with steps */
  .steps-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  
  .steps-bar-fragment {
    /* take up extra space in div */
    flex-grow: 1;
  }
  
  .steps-bar-circle {
    /* center circle in middle of div (right on top of progress bar) */
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .steps-bar-circle-wrapper {
    /* 1px width on the wrapper with visible overflow so the left and right proress bar
    fragments will go under the circle */
    max-width: 1px;
    overflow: visible;
    z-index: 5;
    display: flex;

    flex-direction: column;
    align-items: center;
  }

  /* Label */
  .steps-bar-circle-wrapper > p {
    position: absolute;
    margin-bottom: 0;
    text-align: center;
    word-break: break-all;
    /* Lock to bottom of the div */
    bottom: 0;
  }`;
  document.getElementsByTagName('head')[0].appendChild(style);
}

// Inline styles for a single progress bar that applies custom parameters
function createInlineStyles(stepsBar) {
    const incompleteColor = stepsBar.dataset.incompleteColor;
    const numSteps = parseInt(stepsBar.dataset.numSteps);
    const completeColorPrimary = stepsBar.dataset.completeColorPrimary;
    const completeColorSecondary = stepsBar.dataset.completeColorSecondary;
    const circlePrimary = stepsBar.dataset.circlePrimary;
    const circleSecondary = stepsBar.dataset.circleSecondary;
    const animationDuration = parseFloat(stepsBar.dataset.animationDuration);
    const textColor = stepsBar.dataset.textColor;
    const barBorder = stepsBar.dataset.barBorder;
    // Size every part of progress bar relative to scale
    const scale = stepsBar.dataset.scale;
    const key = stepsBar.dataset.key;

    stepsBar.style.height = `${scale ? scale*6 + 'rem' : '6rem'}`;
    
    // Create animation for each progress bar based on primary complete color and secondary complete color
    let style = document.createElement('style');
    style.innerHTML = `
    @keyframes steps-bar-gradient-${key} {
      0% { background-color: ${completeColorPrimary || '#227b81'}; }
      50% { background-color: ${completeColorSecondary || '#8EDBE1'}; }
      100% { background-color: ${completeColorPrimary || '#227b81'}; }
    };`
    document.getElementsByTagName('head')[0].appendChild(style);

    // Specialized styling for the fragments of this progress bar
    let fragments = stepsBar.querySelectorAll('.steps-bar-fragment');
    console.log(document.querySelector('.steps-bar'));
    fragments.forEach((fragment) => {
      // For first fragment (rounded left end)
      if(fragment === stepsBar.firstElementChild) {
        fragment.style.borderRadius = `${scale ? scale*0.5 + 'rem' : '0.5rem'} 0px 0px ${scale ? scale*0.5 + 'rem' : '0.5rem'}`;
      }
      // For last fragment (rounded right end)
      if(fragment === stepsBar.lastElementChild) {
        fragment.style.borderRadius = `0px ${scale ? scale*0.5 + 'rem' : '0.5rem'} ${scale ? scale*0.5 + 'rem' : '0.5rem'} 0px`;
      }
      // Apply gradient animation to fragments marked as completed
      if(fragment.classList.contains('completed')) {
        fragment.style.animation = `steps-bar-gradient-${key} ${animationDuration ? animationDuration + 's' : '6s'} linear infinite`;
      }
      fragment.style.height = scale ? scale*0.5 + 'rem' : '0.5rem';
      fragment.style.backgroundColor = incompleteColor || '#ffffff';
      fragment.style.border = barBorder ? `3px solid ${barBorder}` : 'none';
    });

    // Specialized styling for the labels
    let circleLabels = stepsBar.querySelectorAll('.steps-bar-circle-wrapper > p');
    let labelWidth = (1.0/(numSteps+1)) * 100;
    console.log(labelWidth);
    circleLabels.forEach((label) => {
      label.style.color = `${textColor || '#000000'}`;
      label.style.fontSize = `${scale ? scale + 'rem' : '1rem'}`;
      label.style.height = `${scale ? scale + 'rem' : '1rem'}`;
      label.style.width = `${labelWidth || '20'}%`;
    });

    // Specialized styling for the circles
    let circles = stepsBar.querySelectorAll('.steps-bar-circle');
    console.log(circlePrimary);
    circles.forEach((circle) => {
      if(circle.classList.contains('current')) {
        // For current step
        circle.style.minWidth = `${scale ? scale*3 + 'rem' : '3rem'}`;
        circle.style.minHeight = `${scale ? scale*3 + 'rem' : '3rem'}`;
        circle.style.borderRadius = `${scale ? scale*1.5 + 'rem' : '1.5rem'}`;
        circle.style.backgroundColor = `${circleSecondary || '#8EDBE1'}`;
        circle.style.border = `3px solid ${circlePrimary || '#ffffff'}`;
      } else {
        // For all other steps
        circle.style.minWidth = `${scale ? scale*2 + 'rem' : '2rem'}`;
        circle.style.minHeight = `${scale ? scale*2 + 'rem' : '2rem'}`;
        circle.style.borderRadius = `${scale ? scale + 'rem' : '1rem'}`;
        circle.style.backgroundColor = `${circlePrimary || '#ffffff'}`;
        circle.style.border = `3px solid ${circleSecondary || '#8EDBE1'}`;
      }
    });
}

function initProgressBars() {
  createCSS();

  const stepsBars = document.querySelectorAll('.steps-bar');
  stepsBars.forEach((currentStepsBar) => {
    const numSteps = parseInt(currentStepsBar.dataset.numSteps);
    const currentStep = parseInt(currentStepsBar.dataset.currentStep);
    const complete = JSON.parse(currentStepsBar.dataset.complete);

    // Start off with leftmost fragment
    currentStepsBar.appendChild(stepsBarFragment(true));
    for(let i = 0; i < numSteps; i++) {
      const labelText = currentStepsBar.dataset[`labelText-${i+1}`];
      // Add circle and specify if it is the circle for the current step
      currentStepsBar.appendChild(stepsBarCircle(i === currentStep - 1, labelText, numSteps));
      // Add fragment and specify if it is "completed" and should have a gradient animation
      currentStepsBar.appendChild(stepsBarFragment(i < currentStep - 1 || complete));
    }
    createInlineStyles(currentStepsBar);
  });
}

if(typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initProgressBars
  };
} else {
  initProgressBars();
}