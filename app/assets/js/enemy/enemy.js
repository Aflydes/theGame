import { currnetLVL } from "../game.js";
import {levelInfoBlocks, startGameElem, Stop } from '../game.js';

export class Enemy {
    constructor(path, x, y, maxHp) {
        this.x = x;
        this.y = y;
 
        this.image = new Image();
 
        this.image.src = path;
        this.maxHp = maxHp;
        this.currHp = maxHp;
    }
    Move(axis, offset){
        if(axis == "x") //Перемещение по оси X
        {
            this.x += offset; //Смещение
 
            //Если при смещении объект выходит за края холста, то изменения откатываются
            if(this.x + this.image.width - 30 > playground.width)
            {
                this.x -= offset; 
            }
    
            if(this.x < 0)
            {
                this.x = 0;
            }
        }
        else //Перемещение по оси Y
        {
            this.y += offset;
 
            if(this.y + this.image.height - 30 > playground.height)
            {
                this.y -= offset;
            }
 
            if(this.y < 0)
            {
                this.y = 0;
            }
        }
    }
    GetDamage(enemy, damage){
        let win = false;
        enemy.currHp -= damage;
        if (enemy.currHp <= 0){
            enemy.currHp = 0;
            Stop();
            startGameElem.querySelector('.start-game__title').innerHTML = 'You Win'
            startGameElem.querySelector('.start-game__menu-text').innerHTML = 'Press button to start next lvl'
            startGameElem.style.display = 'flex';
            win = true;
        }
        return win;
    }
}