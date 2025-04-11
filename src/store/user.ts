import { makeAutoObservable } from "mobx";
import { faker } from "@faker-js/faker";

export class UserStore {
  userId: string;
  name: string;
  email: string;

  constructor() {
    this.userId = "";
    this.name = "";
    this.email = "";
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

  logout() {
    this.userId = "";
    this.name = "";
    this.email = "";
  }

  hydrate = (data: { userId: string; name: string; email: string }) => {
    if (!data) return;
    this.setUserId(data.userId);
    this.setName(data.name);
    this.setEmail(data.email);
  }
}
