import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest, AuthTokens } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = environment.authUrl;
  private readonly TOKEN_KEY = 'pdi_access_token';
  private readonly REFRESH_TOKEN_KEY = 'pdi_refresh_token';
  private readonly USER_KEY = 'pdi_user';

  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  user$ = this.userSubject.asObservable();
  
  currentUser = computed(() => this.userSubject.value);
  isAuthenticated = computed(() => !!this.userSubject.value);

  constructor(private http: HttpClient, private router: Router) {
    this.initAuth();
  }

  private initAuth(): void {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.refreshToken().subscribe();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  register(data: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/register`, data);
  }

  logout(): void {
    this.http.post(`${this.API_URL}/logout`, {}).subscribe({
      complete: () => this.clearSession()
    });
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<LoginResponse | null> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return of(null);
    }
    return this.http.post<LoginResponse>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/forgot-password`, { email });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.requestPasswordReset(email);
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/reset-password`, { token, newPassword });
  }

  enable2FA(): Observable<{ secret: string; qrCode: string }> {
    return this.http.post<{ secret: string; qrCode: string }>(`${this.API_URL}/2fa/enable`, {});
  }

  verify2FA(code: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.API_URL}/2fa/verify`, { code });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasPermission(permission: string): boolean {
    const user = this.userSubject.value;
    if (!user) return false;
    return user.roles.some(role => 
      role.permissions.some(p => p.code === permission)
    );
  }

  hasRole(roleName: string): boolean {
    const user = this.userSubject.value;
    if (!user) return false;
    return user.roles.some(role => role.name === roleName);
  }

  private handleAuthResponse(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.tokens.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.userSubject.next(response.user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}