import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

//this function stores our state

const storeState = () => {
  let currentState = {};
  return (stateChangeFunction = state => state) => {
    const newState = stateChangeFunction(currentState);
    currentState = {...newState};
    return newState;
  }
}

const stateControl = storeState();

//this is a function factory. We can easily create more specific functions that alter a plant's soil, water and light to varying degrees.

const changeState = (prop) => {
  return (value) => {
    return (state) => ({
      ...state,
      [prop] : (state[prop] || 0) + value
    })
  }
}

// We create four functions using our function factory. We could easily create many more.

const feed = changeState("soil")(1);
// const blueFood = changeState("soil")(5);
const hydrate = changeState("water")(1);
const tooMuchSoil = changeState("soil")(Math.floor(Math.random() * -14));
const tooMuchWater = changeState("water")(-10)
// const timer = changeState("soil")(-1);
// const superWater = changeState("water")(5);

// UI

$(document).ready(function() {
  //this function has side effects because we are using jQuery, manipulating the DOM will always be a side effect. 
  $('#feed').click(function() {
    const newState = stateControl(feed);
    if (newState.soil <= 3){
      $('#soil-value').text(`Your plants soil level is ${newState.soil}! That is dangerously low! Please add more soil!`);
    }
    else if (newState.soil == 15){
      $('#soil-value').text(`You have added too much soil! Please do not add any more or else you may damage your plant.`);
    }
    else if (newState.soil == 16){
      const newState = stateControl(tooMuchSoil);
      $('#soil-value').text(`Plant has been damaged. Your soil level is now: ${newState.soil}`);
    }
    else {
      $('#soil-value').text(`Soil: ${newState.soil}. Your plant is happy!`);
    }
  });
  $('#water').click(function() {
    const newState = stateControl(hydrate);
    if (newState.water <= 2){
      $('#water-value').text(`Your water level is: ${newState.water}. A happy plant thrives at water level 5!`);
    }
    else if (newState.water == 8){
      $('#water-value').text(`Dont drown your plant! Your water level is: ${newState.water}. Your plant will lose health if water levels get above 10.`);
    }
    else if (newState.water == 10){
      const newState = stateControl(tooMuchWater);
      $('#water-value').text(`Water level is ${newState.water}. Say goodbye to your plant!`);
    }
    else {
      $('#water-value').text(`Water: ${newState.water}`);
    }
  });
});