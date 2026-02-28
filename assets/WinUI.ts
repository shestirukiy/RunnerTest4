import { _decorator, Component, Label, tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends Component {

    @property(Label)
    scoreLabel: Label | null = null;          // лейбл в панели 

    @property(Label)
    hudScoreLabel: Label | null = null;     
    start() {
        this.node.active = false;
    }

    show() {
        this.node.active = true;

        if (this.scoreLabel) {
            this.scoreLabel.string = "0";
        }

        let realScore = 0;

        // Берём текущее значение из HUD-лейбла
        if (this.hudScoreLabel && this.hudScoreLabel.string) {
            const text = this.hudScoreLabel.string;
            // Убираем всё кроме цифр: ₽, :, пробелы и т.д.
            const cleaned = text.replace(/[^0-9]/g, '');
            realScore = parseInt(cleaned, 10) || 0;
            console.log("Извлечённый счёт из HUD:", realScore, "(оригинал:", text, ")");
        } else {
            console.warn("hudScoreLabel не привязан или пустой");
        }

        this.animateScore(realScore);
    }

    private animateScore(target: number) {
        tween({ value: 0 })
            .to(1.5, { value: target }, {
                onUpdate: (obj: any) => {
                    if (this.scoreLabel) {
                        this.scoreLabel.string = Math.floor(obj.value).toString();
                    }
                }
            })
            .start();
    }
}