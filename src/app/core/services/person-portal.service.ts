import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, TimeoutError } from 'rxjs';
import { catchError, map, shareReplay, tap, timeout } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service';
import {
  ApiClientError,
  PersonClaim,
  PersonClaimRequest,
  PersonPortal,
  PersonPortalResponse,
  PersonRegistrationPayload,
  parseRailsErrorBody,
  unwrapPersonPortal,
} from '../models/person-portal.model';

@Injectable({
  providedIn: 'root',
})
export class PersonPortalService {
  private readonly REQUEST_TIMEOUT = 30000;
  private readonly acceptJson = new HttpHeaders({
    Accept: 'application/json',
  });
  private readonly jsonHeaders = this.acceptJson.set('Content-Type', 'application/json');
  private readonly portalSubject = new BehaviorSubject<PersonPortal | null>(null);
  private portalRequest$: Observable<PersonPortal> | null = null;

  readonly portal$ = this.portalSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  get currentPortal(): PersonPortal | null {
    return this.portalSubject.value;
  }

  get isEnabled(): boolean {
    return !!this.portalSubject.value?.enabled;
  }

  loadPortal(force = false): Observable<PersonPortal> {
    if (!force && this.portalRequest$) {
      return this.portalRequest$;
    }

    this.portalRequest$ = this.http
      .get<PersonPortalResponse | PersonPortal>(this.apiConfig.personPortal.schema(), {
        headers: this.acceptJson,
      })
      .pipe(
        timeout(this.REQUEST_TIMEOUT),
        map((response) => unwrapPersonPortal(response)),
        tap((portal) => this.portalSubject.next(portal)),
        catchError((error) => {
          const disabled: PersonPortal = {
            enabled: false,
            allow_register: false,
            allow_update: false,
            core_fields: [],
            custom_fields: [],
          };
          this.portalSubject.next(disabled);
          if (error instanceof HttpErrorResponse && (error.status === 404 || error.status === 0)) {
            return of(disabled);
          }
          return of(disabled);
        }),
        shareReplay(1)
      );

    return this.portalRequest$;
  }

  claim(body: PersonClaimRequest): Observable<PersonClaim> {
    return this.http
      .post<PersonClaim>(this.apiConfig.personPortal.claim(), body, {
        headers: this.jsonHeaders,
      })
      .pipe(timeout(this.REQUEST_TIMEOUT), catchError(this.handleError));
  }

  submitRegistration(payload: PersonRegistrationPayload): Observable<unknown> {
    return this.http
      .post(this.apiConfig.personPortal.registrations(), payload, {
        headers: this.jsonHeaders,
      })
      .pipe(timeout(this.REQUEST_TIMEOUT), catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse | TimeoutError) => {
    if (error instanceof TimeoutError) {
      return throwError(
        (): ApiClientError => ({
          message: 'La petición tardó demasiado. Intenta de nuevo.',
          code: 'TIMEOUT',
          details: [],
          extras: [],
        })
      );
    }

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return throwError(
          (): ApiClientError => ({
            message: 'No se pudo conectar con el servidor.',
            code: 'CONNECTION_ERROR',
            status: 0,
            details: [],
            extras: [],
          })
        );
      }

      if (error.status === 429) {
        return throwError(
          (): ApiClientError => ({
            message: 'Hay muchas solicitudes. Espera un momento e intenta otra vez.',
            code: 'RATE_LIMIT',
            status: 429,
            details: [],
            extras: [],
          })
        );
      }

      const parsed = parseRailsErrorBody(error.error);
      if (error.status === 403) {
        return throwError(
          (): ApiClientError => ({
            message: parsed.message || 'Esta sección no está disponible en este momento.',
            code: 'FORBIDDEN',
            status: 403,
            details: parsed.details,
            extras: parsed.extras,
          })
        );
      }

      if (error.status === 404) {
        return throwError(
          (): ApiClientError => ({
            message: parsed.message || 'No se encontró un registro con esos datos',
            code: 'NOT_FOUND',
            status: 404,
            details: parsed.details,
            extras: parsed.extras,
          })
        );
      }

      if (error.status === 422) {
        return throwError(
          (): ApiClientError => ({
            message: parsed.message || 'Revisa los datos del formulario e intenta de nuevo.',
            code: 'VALIDATION',
            status: 422,
            details: parsed.details,
            extras: parsed.extras,
          })
        );
      }

      return throwError(
        (): ApiClientError => ({
          message: parsed.message || 'No se pudo enviar la solicitud. Intenta más tarde.',
          code: 'HTTP_ERROR',
          status: error.status,
          details: parsed.details,
          extras: parsed.extras,
        })
      );
    }

    return throwError(
      (): ApiClientError => ({
        message: 'Ocurrió un error inesperado.',
        code: 'UNKNOWN_ERROR',
        details: [],
        extras: [],
      })
    );
  };
}
