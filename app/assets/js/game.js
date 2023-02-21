import { Enemy } from './enemy/enemy.js';
import {levelsInfo} from './levels/levelsinfo.js';
import {bgSrcs} from './levels/levelsinfo.js';
import {Player} from './player/player.js';
import {weapons} from './weapons/weapons.js';

export let currnetLVL = 1;
export const startGameElem = document.querySelector('.start-game');
const startGameButton = document.querySelector('.start-game__button');
export const levelInfoBlocks ={
    levelNumber: document.querySelector('.level-number'),
    levelEnemyName: document.querySelector('.enemy-name'),
    levelTitle: document.querySelector('.header__lvl-title'),
    levlelHealthBar: document.querySelector('.header__hp'),
    levelMaxHealth: document.querySelector('.header__hp-max'),
    levelCurrentHealth: document.querySelector('.header__hp-current'),
    levelWeaponImage: document.querySelector('.weapon__image-img'),
    levelWeaponDamage: document.querySelector('.weapon__damage'),
    levelWeaponTitle: document.querySelector('.weapon__title'),
}

let player;
let enemy;
let currWeapon = weapons.knife;
let timer;
let enemyMoveTimer
let playersAttack = false;
let hit = false;
let enemyMovements = [-1,1,-2,2 ]

function startGame(){
    player = new Player('/assets/images/dest/player.png', 200, 200, levelsInfo[currnetLVL].maxhp);
    enemy = new Enemy(levelsInfo[currnetLVL].enemy.image, playground.width - 200, playground.height - 200, levelsInfo[currnetLVL].enemy.hp)
    startGameElem.style.display = 'none';
    levelInfoBlocks.levelNumber.textContent = levelsInfo[currnetLVL].number;
    levelInfoBlocks.levelEnemyName.textContent = levelsInfo[currnetLVL].enemy.name;
    levelInfoBlocks.levelTitle.textContent = levelsInfo[currnetLVL].name;
    levelInfoBlocks.levlelHealthBar.style.background = 'linear-gradient(90deg,green 100% ,red 0%)';
    levelInfoBlocks.levelMaxHealth.textContent = '/' + levelsInfo[currnetLVL].maxhp;
    levelInfoBlocks.levelCurrentHealth.textContent = levelsInfo[currnetLVL].maxhp;
    levelInfoBlocks.levelWeaponImage.src = currWeapon.image;
    levelInfoBlocks.levelWeaponDamage.innerHTML = 'Урон:' + currWeapon.damage;
    levelInfoBlocks.levelWeaponTitle.innerHTML = 'Оружие: ' + currWeapon.title;
    playground.style.background = 'url(' + bgSrcs[currnetLVL] + ')'
    Start();
    enemyMoveTimer = setInterval(() => enemy.Move('y', arrayRandElement(enemyMovements), 100000));

}

startGameButton.addEventListener('click', () => startGame());

function arrayRandElement(arr) {
    var rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}


function Start() {
    timer = setInterval(Update, 1000 / 60); 
}
export function Stop() {
    clearInterval(timer); 
}
function Update() {
    if(playersAttack === true){
        hit = player.Attack(player, currWeapon, enemy)
        if(hit){
            enemy.currentHP = enemy.currentHP - currWeapon.damage;
            hit = false;
        }
    }    
    Draw();
}
function Draw() {
    ctx.clearRect(0, 0, playground.width, playground.height);
    ctx.drawImage (
        player.image, //Изображение для отрисовки
        0, //Начальное положение по оси X на изображении
        0, //Начальное положение по оси Y на изображении
        player.image.width, //Ширина изображения
        player.image.height, //Высота изображения
        player.x, //Положение по оси X на холсте
        player.y, //Положение по оси Y на холсте
        player.image.width, //Ширина изображения на холсте
        player.image.height  //Высота изображения на холсте
    );
    ctx.drawImage (
        enemy.image, 
        0, 
        0, 
        enemy.image.width, 
        enemy.image.height, 
        enemy.x, 
        enemy.y, 
        enemy.image.width, 
        enemy.image.height
    );
    let weaponImage = new Image();
    weaponImage.src = currWeapon.image;
    ctx.drawImage(
        weaponImage,
        0,
        0,
        weaponImage.width,
        weaponImage.height,
        player.x + 30,
        player.y + 10,
        weaponImage.width,
        weaponImage.height,
    );
}
function keyControls(e){
    switch(e.keyCode){
        case 65: //Влево a
            player.Move('x', -10, enemy)
            break;
 
        case 68: //Вправо d
            player.Move('x', 10, enemy)
            break;
 
        case 87: //Вверх w
            player.Move('y', -10, enemy)
            break;
 
        case 83: //Вниз s 
            player.Move('y', 10, enemy)
            break;
        case 70: // Атака f 
            if(player.Attack(player, currWeapon, enemy)){
                if(enemy.GetDamage(enemy,currWeapon.damage)){
                    currnetLVL++;
                }
            }
            break;

        case 27: //Esc
            Stop();
            break;

        case 80: // p Пауза
            Stop();
            break;
        
    }
}


window.addEventListener("keydown", (e) => keyControls(e));


