import {levelInfoBlocks, startGameElem, Stop } from '../game.js';
export class Player{
    constructor(path, x, y, maxHp) {
        this.x = x;
        this.y = y;
 
        this.image = new Image();
 
        this.image.src = path;
        this.maxHp = maxHp;
        this.currHp = maxHp
    }
    Move(axis, offset, enemy){
        if(axis == "x") {
            this.x += offset; 
 
            if(this.x + this.image.width > playground.width) {
                this.x -= offset; 
                this.GetDamage(this, 1);
            }
            if(this.x < 0) {
                this.x = 0;
                this.GetDamage(this, 1);
            }
        }
        else {
            this.y += offset;
 
            if(this.y + this.image.height > playground.height) {
                this.y -= offset;
                this.GetDamage(this, 1);
            }
            if(this.y < 0) {
                this.y = 0;
                this.GetDamage(this, 1);
            }
        }
    }
    Attack(player, weapon, enemy){
        let hit = false;
        if(player.y < enemy.y + enemy.image.height + (10 * weapon.range) && player.y + player.image.height + (10 * weapon.range) > enemy.y){
            if(player.x + player.image.width + (10 * weapon.range) > enemy.x && player.x < enemy.x + enemy.image.width + (10 * weapon.range)) {
                hit = true;
                
            }
        }
        console.log(hit);
        return hit;
    }
    GetDamage(player, damage){
        player.currHp -= damage;
        levelInfoBlocks.levlelHealthBar.style.background = 'linear-gradient(90deg,green ' + (player.currHp/player.maxHp)*100 + '% ,red ' + (damage/player.maxHp)*100 + '%)';
        levelInfoBlocks.levelCurrentHealth.innerHTML = player.currHp;
        if (player.currHp <= 0){
            player.currHp = 0;
            Stop();
            startGameElem.querySelector('.start-game__title').innerHTML = 'You die'
            startGameElem.querySelector('.start-game__menu-text').innerHTML = 'Press button to retry'
            startGameElem.style.display = 'flex';
        }
    }
}