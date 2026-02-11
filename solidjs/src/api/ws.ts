type WSListener<T> = (data: T) => void;

class WSService {
  private socket: WebSocket | null = null;
  private listeners: WSListener<any>[] = [];

  connect() {
    if (this.socket) return;

    this.socket = new WebSocket(
      `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/debezium/ws`
    );

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach((listener) => listener(data));
    };

    this.socket.onclose = () => {
      console.warn("WS closed. Reconnecting...");
      this.socket = null;
      setTimeout(() => this.connect(), 2000);
    };
  }

  subscribe<T>(listener: WSListener<T>){
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter(l => l != listener);
    };
  }
}

export const wsService = new WSService();
