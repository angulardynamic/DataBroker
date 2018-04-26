import { DataSource } from '../';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/observable/dom/WebSocketSubject';

export interface WebsocketConfig {
    url: string;
}

export class WebSocket {
    constructor() {

    }

    addWebSocket(dataSource: DataSource) {
        let config = <WebsocketConfig>dataSource.config;

        let wsConfig: WebSocketSubjectConfig = {
            url: config.url
        };

        let ws = new WebSocketSubject(wsConfig);
    }
}
