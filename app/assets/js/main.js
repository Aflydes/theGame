const playground = document.getElementById('playground');

let startGameElem = document.querySelector('.start-game');
    startGameButton = document.querySelector('.start-game__button');
    wrapper = document.querySelector('.wrapper');
    ctx = playground.getContext("2d");

calcVh();
Resize();

window.onresize = function () {
    calcVh();
    Resize();
}


function Resize() {
    playground.width = wrapper.clientWidth;
    playground.height = wrapper.clientHeight;
}

function calcVh(){
    let vh = window.innerHeight * 0.01;
        fullHeight = vh * 100;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--fullHeight', `${fullHeight}px`);
}