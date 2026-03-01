import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, find, tween, Vec3, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Coin')
export class Coin extends Component {

    private collected: boolean = false;

    // Ссылка на ScoreLabel (перетащишь в инспекторе)
    @property(Label)
    scoreLabel: Label | null = null;

    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }

        // если не привязал в инспекторе — можно найти автоматически
        if (!this.scoreLabel) {
            this.scoreLabel = find("Canvas/HUD/ScoreLabel")?.getComponent(Label) || null;
        }
    }

    onContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (this.collected) return;
        if (otherCollider.node.name !== 'Player') return;

        this.collected = true;

        // 1. Добавляем очки
        const manager = find("Canvas/GameManager")?.getComponent("ScoreManager");
        if (manager) {
            manager.addScore(500);
        }

        // 2. Запускаем анимацию полёта к счёту
        this.flyToScore();
    }

    private flyToScore() {
        if (!this.scoreLabel || !this.scoreLabel.node) {
            this.node.destroy(); // если лейбл не найден — просто удаляем
            return;
        }

        // Позиция цели — центр ScoreLabel в мировых координатах
        const targetWorldPos = this.scoreLabel.node.getWorldPosition(new Vec3());

        // Отключаем коллайдер (чтобы не мешал во время полёта)
        const collider = this.getComponent(Collider2D);
        if (collider) collider.enabled = false;

        // Анимация: летим + уменьшаемся + вращаемся
        tween(this.node)
            .parallel(
                // Летим к позиции счёта
                tween()
                    .to(0.25, { worldPosition: targetWorldPos }, { easing: 'sineOut' }),

                // Уменьшаемся до 0.1 масштаба
                tween()
                    .to(0.25, { scale: new Vec3(0.1, 0.1, 0.1) }, { easing: 'sineIn' }),

                // Вращаемся на 720 градусов (2 полных оборота)
                tween()
                    .to(0.25, { angle: 720 }, { easing: 'linear' })
            )
            .call(() => {
                // Когда долетели — уничтожаем монетку
                this.node.destroy();
            })
            .start();
    }
    onDestroy() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
    }
}