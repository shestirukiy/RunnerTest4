import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, find } from 'cc';
const { ccclass } = _decorator;

@ccclass('Coin')
export class Coin extends Component {

    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            // Подписываемся на физический контакт
            collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
    }

 onContact(selfCollider: Collider2D, otherCollider: Collider2D) {

        if (this.collected) return; // 🔥 защита

        if (otherCollider.node.name === 'Player') {

            this.collected = true; // блокируем повтор

            const manager = find("Canvas/GameManager")?.getComponent("ScoreManager");
            if (manager) {
                manager.addScore(500);
            }

            this.node.destroy();
        }
    }


    onDestroy() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
    }
}