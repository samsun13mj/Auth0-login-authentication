import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  // 🔐 Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // 🆕 Signup
  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // 🚪 Logout
  logout() {
    return signOut(this.auth);
  }

  // ✅ SAFE auth state observable
  isLoggedIn$(): Observable<boolean> {
    return authState(this.auth).pipe(
      map(user => !!user)
    );
  }
}
