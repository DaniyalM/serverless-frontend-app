import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import {CognitoUser, CognitoUserAttribute, CognitoUserPool} from "amazon-cognito-identity-js";

import { User } from './user.model';

const POOL_DATA = {
  UserPoolId:'eu-west-1_9YePsbWBN',
  ClientId:'191hkn4vl2s1b54brhj4j5k8lg'
};
const userPool= new CognitoUserPool(POOL_DATA);

@Injectable()
export class AuthService {
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<boolean>();
  registeredUser:CognitoUser|any;
  constructor(private router: Router) {}
  signUp(username: string, email: string, password: string): void {
    this.authIsLoading.next(true);
    const user: User = {
      username: username,
      email: email,
      password: password
    };
    const attrList:CognitoUserAttribute[]=[];
    const emailAttribute = {
      Name: 'email',
      Value: user.email
    };
    attrList.push(new CognitoUserAttribute(emailAttribute));
    userPool.signUp(user.username,user.password,attrList,[],(err,result)=>{
      if(err){
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        return;
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.registeredUser=result?.user;
    })
    return;
  }
  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
    };
  }
  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password
    };
    this.authStatusChanged.next(true);
    return;
  }
  getAuthenticatedUser() {
  }
  logout() {
    this.authStatusChanged.next(false);
  }
  isAuthenticated(): Observable<boolean> {
    const user:any = this.getAuthenticatedUser();
    const obs = Observable.create((observer:any) => {
      if (!user) {
        observer.next(false);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
    return obs;
  }
  initAuth() {
    this.isAuthenticated().subscribe(
      (auth) => this.authStatusChanged.next(auth)
    );
  }
}
