type StorageType = "memory" | "redis" | "mongo" | "mysql" | "postgres" | "sqlite";
type Chat = {
  chatId: string;
  title: string;
  messages: Message[];
}
type Message = {
  messageId: string;
  role: string;
  content: string;
  timestamp: number;
  feedback: string;
};

interface IStorage {
  open(): void;
  close(): void;
  getChatList(userId: string): Array<Chat>;
  getChatHistory(userId: string, chatId: string): Array<Message>;
  addNewChat(userId: string, chatId: string, title: string): void;
  addNewMessage(userId: string, chatId: string, message: Message): void;
}

class MemoryStorage implements IStorage {
  _data: any = {};

  constructor() {
  }

  open(): void {
    this._data = {};
  }

  close(): void {
    this._data = undefined;
  }

  getChatList(userId: string): Chat[] {
    return this._data[userId] || [];
  }

  getChatHistory(userId: string, chatId: string): Message[] {
    const list = this.getChatList(userId);
    const chat = list.find((chat) => chat.chatId === chatId);
    return chat?.messages || [];
  }

  addNewChat(userId: string, chatId: string, title: string): void {
    const list = this.getChatList(userId);
    list.push({
      chatId,
      title,
      messages: []
    });
  }

  addNewMessage(userId: string, chatId: string, message: Message): void {
    const list = this.getChatList(userId);
    const chat = list.find((chat) => chat.chatId === chatId);
    chat?.messages.push(message);
  }
}


export { IStorage, MemoryStorage };