import { _decorator, Component, Label, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {

    // Лейбл для очков
    @property(Label)
    scoreLabel: Label | null = null;

    start() {
        // Сразу скрываем панель при старте игры
        this.node.active = false;
    }

    // Метод для показа меню
    show(finalScore: number) {
        // Включаем панель
        this.node.active = true;

        // Сбрасываем текст очков на 0
        if (this.scoreLabel) {
            this.scoreLabel.string = "0";
        }

        // Запускаем анимацию увеличения очков
        this.animateScore(finalScore);
    }

    // Анимация "бегущих цифр" от 0 до finalScore
    private animateScore(target: number) {
        tween({ value: 0 })
            .to(1.5, { value: target }, {
                onUpdate: (obj: any) => {
                    if (this.scoreLabel) {
                        // округляем вниз и записываем в лейбл
                        this.scoreLabel.string = Math.floor(obj.value).toString();
                    }
                }
            })
            .start();
    }
}