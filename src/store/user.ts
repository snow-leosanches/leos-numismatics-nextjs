import { makeAutoObservable } from "mobx";
import { makePersistable } from 'mobx-persist-store';
import { faker } from "@faker-js/faker";

export class UserStore {
  userId: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  constructor() {
    this.userId = "";
    this.name = "";
    this.email = "";
    this.address = "";
    this.city = "";
    this.state = "";
    this.zipCode = "";
    this.country = "";
    makeAutoObservable(this);

    // Only initialize persistence on the client side
    if (typeof window !== 'undefined') {
      makePersistable(
        this,
        {
          name: 'UserStore',
          properties: ['userId', 'name', 'email', 'address', 'city', 'state', 'zipCode', 'country'],
          expireIn: 86400000 * 7, // Seven days in milliseconds
          removeOnExpiration: true,
          stringify: false,
          debugMode: false,
          storage: window.localStorage
        },
        { delay: 1000, fireImmediately: false },
      );
    }
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

  setAddress(address: string) {
    this.address = address;
  }

  setCity(city: string) {
    this.city = city;
  }

  setState(state: string) {
    this.state = state;
  }

  setZipCode(zipCode: string) {
    this.zipCode = zipCode;
  }

  setCountry(country: string) {
    this.country = country;
  }

  logout() {
    this.userId = "";
    this.name = "";
    this.email = "";
    this.address = "";
    this.city = "";
    this.state = "";
    this.zipCode = "";
    this.country = "";
  }

  hydrate = (data: { 
      userId: string; 
      name: string; 
      email: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
  }) => {
    if (!data) return;
    this.setUserId(data.userId);
    this.setName(data.name);
    this.setEmail(data.email);
    this.setAddress(data.address);
    this.setCity(data.city);
    this.setState(data.state);
    this.setZipCode(data.zipCode);
    this.setCountry(data.country);
  }
}
