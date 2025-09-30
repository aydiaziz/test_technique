import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { logout } from '../../auth/state/auth.actions';
import { selectEmail, selectIsAuthenticated } from '../../auth/state/auth.selectors';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  email$ = this.store.select(selectEmail);
  isAuthed$ = this.store.select(selectIsAuthenticated);
  constructor(private store: Store) {}
  onLogout(){ this.store.dispatch(logout()); }
}
