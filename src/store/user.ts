import { makeAutoObservable } from "mobx";
import { faker } from "@faker-js/faker";

export class UserStore {
  userId: string;
  name: string;
  email: string;

  constructor() {
    this.userId = faker.string.alphanumeric(16);
    this.name = faker.person.fullName();
    this.email = faker.internet.email();
    makeAutoObservable(this);
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setName(name: string) {
    this.name = name;
  }

  setEmail(email: string) {
    this.email = email;
  }

  hydrate = (data: { userId: string; name: string; email: string }) => {
    if (!data) return;
    this.setUserId(data.userId);
    this.setName(data.name);
    this.setEmail(data.email);
  }
}
