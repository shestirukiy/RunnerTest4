import { _decorator, Component, Node, Vec3, Label, input, Input, Animation } from 'cc';
import { GameManager } from './GameManager'; // <-- путь к GameManager.ts
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

   speedX = 300;

   @property(Animation)
   anim: Animation | null = null;
   @property(Node)
   target: Node | null = null;
   @property startDistance: number = 500;   // когда начать движение
   @property destroyDistance: number = 800; // когда удалить

   private isActive = false;

   start() {
        if (this.anim) {
            this.anim.play('PoliceRunAnim');
        }
            
    }

   update(deltaTime: number) {
    if (!GameManager.gameStarted) return; // ❌ пока не стартанули, враг стоит

    const myX = this.node.worldPosition.x;
    const targetX = this.target.worldPosition.x;

    const distance = Math.abs(myX - targetX);
    let pos = this.node.position;
    let newX = pos.x - this.speedX * deltaTime;
       this.node.setPosition(new Vec3(newX, pos.y, pos.z));
   }
}