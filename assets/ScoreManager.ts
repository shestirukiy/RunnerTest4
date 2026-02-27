import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {

    @property(Label)
    scoreLabel: Label | null = null;

    private score: number = 0;

    addScore(amount: number) {
        this.score += amount;

        if (this.scoreLabel) {
            this.scoreLabel.string = "₽: " + this.score;
        }
    }
}