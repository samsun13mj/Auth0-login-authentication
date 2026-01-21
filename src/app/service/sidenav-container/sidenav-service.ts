import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SidenavPayload {
  open: boolean;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _payload$ = new BehaviorSubject<SidenavPayload>({ open: false });

  get payload$(): Observable<SidenavPayload> {
    return this._payload$.asObservable();
  }

  openWithUser(user: any) {
    this._payload$.next({ open: true, user });
  }

  close() {
    this._payload$.next({ open: false });
  }
}
