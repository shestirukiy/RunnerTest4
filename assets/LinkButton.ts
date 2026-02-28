import { _decorator, Component, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LinkButton')
export class LinkButton extends Component {

    @property
    url: string = 'https://example.com';  // ← сюда вставь свою ссылку

    // Метод, который вызовет Button
    openLink() {
        if (sys.openURL) {
            sys.openURL(this.url);  // открывает в новой вкладке/внешнем браузере
        } else {
            // fallback для старых случаев
            window.open(this.url, '_blank');
        }
    }
}