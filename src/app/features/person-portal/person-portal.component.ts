import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import {
  ApiClientError,
  DOCUMENT_TYPE_OPTIONS,
  FieldErrorDetail,
  PersonClaim,
  PersonCoreField,
  PersonCustomField,
  PersonCustomValue,
  PersonPortal,
  PersonValues,
  humanizeApiErrorMessage,
} from '../../core/models/person-portal.model';
import { PERSON_FIELD_LABELS } from '../../core/person-portal-i18n';
import { PersonPortalService } from '../../core/services/person-portal.service';
import { PersonDynamicFormComponent } from './person-dynamic-form.component';

type PortalView = 'loading' | 'unavailable' | 'choice' | 'register' | 'claim' | 'update' | 'success';
type ClaimMode = 'document' | 'code';

@Component({
  selector: 'app-person-portal',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PersonDynamicFormComponent],
  templateUrl: './person-portal.component.html',
  styleUrl: './person-portal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonPortalComponent implements OnInit, OnDestroy {
  readonly documentTypes = DOCUMENT_TYPE_OPTIONS;
  readonly view = signal<PortalView>('loading');
  readonly portal = signal<PersonPortal | null>(null);
  readonly claimMode = signal<ClaimMode>('document');
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly toastMessage = signal('');
  readonly claimNotFound = signal(false);
  readonly serverDetails = signal<FieldErrorDetail[]>([]);
  readonly successKind = signal<'create' | 'update' | null>(null);
  readonly coreFields = signal<PersonCoreField[]>([]);
  readonly customFields = signal<PersonCustomField[]>([]);
  readonly initialPerson = signal<PersonValues>({});
  readonly initialCustomValues = signal<PersonCustomValue[]>([]);

  readonly title = computed(
    () => this.portal()?.title?.trim() || 'Actualización de datos'
  );
  readonly description = computed(
    () =>
      this.portal()?.description?.trim() ||
      'Regístrate o actualiza tus datos. Un consolidador de la iglesia revisará tu solicitud antes de aplicarla.'
  );
  readonly allowRegister = computed(() => this.portal()?.allow_register !== false);
  readonly allowUpdate = computed(() => this.portal()?.allow_update !== false);

  claimForm: FormGroup;
  private claim: PersonClaim | null = null;
  private claimTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private personPortal: PersonPortalService,
    private fb: FormBuilder
  ) {
    this.claimForm = this.fb.group({
      code: [''],
      document_type: ['CC'],
      document_number: ['', [this.documentNumberValidator()]],
      birth_date: [''],
    });
    this.claimForm.get('document_type')?.valueChanges.subscribe(() => {
      this.claimForm.get('document_number')?.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.view.set('loading');
    this.personPortal.loadPortal(true).subscribe((portal) => {
      this.portal.set(portal);
      this.view.set(portal.enabled ? 'choice' : 'unavailable');
    });
  }

  ngOnDestroy(): void {
    this.clearClaimTimer();
  }

  startRegister(): void {
    if (!this.allowRegister()) return;
    this.clearFeedback();
    this.coreFields.set(this.portal()?.core_fields ?? []);
    this.customFields.set(this.portal()?.custom_fields ?? []);
    this.initialPerson.set({});
    this.initialCustomValues.set([]);
    this.view.set('register');
  }

  startClaim(): void {
    if (!this.allowUpdate()) return;
    this.clearFeedback();
    this.claim = null;
    this.claimForm.reset({
      code: '',
      document_type: 'CC',
      document_number: '',
      birth_date: '',
    });
    this.setClaimMode('document');
    this.view.set('claim');
  }

  setClaimMode(mode: ClaimMode): void {
    this.claimMode.set(mode);
    this.claimNotFound.set(false);
    const code = this.claimForm.get('code');
    const documentType = this.claimForm.get('document_type');
    const documentNumber = this.claimForm.get('document_number');
    const birthDate = this.claimForm.get('birth_date');

    if (mode === 'code') {
      code?.setValidators([Validators.required]);
      documentType?.clearValidators();
      documentNumber?.clearValidators();
      birthDate?.clearValidators();
    } else {
      code?.clearValidators();
      documentType?.setValidators([Validators.required]);
      documentNumber?.setValidators([Validators.required, this.documentNumberValidator()]);
      birthDate?.setValidators([Validators.required]);
    }

    code?.updateValueAndValidity();
    documentType?.updateValueAndValidity();
    documentNumber?.updateValueAndValidity();
    birthDate?.updateValueAndValidity();
  }

  backToChoice(): void {
    this.clearFeedback();
    this.submitting.set(false);
    this.clearClaim();
    this.view.set('choice');
  }

  identify(): void {
    this.claimForm.markAllAsTouched();
    if (this.claimForm.invalid || this.submitting()) return;

    const value = this.claimForm.getRawValue();
    const body =
      this.claimMode() === 'code'
        ? { code: String(value.code).trim() }
        : {
            document_type: String(value.document_type).trim(),
            document_number: String(value.document_number).trim(),
            birth_date: String(value.birth_date).trim(),
          };

    this.submitting.set(true);
    this.clearFeedback();
    this.personPortal
      .claim(body)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (claim) => {
          this.claim = claim;
          this.coreFields.set(
            claim.form?.core_fields?.length
              ? claim.form.core_fields
              : (this.portal()?.core_fields ?? [])
          );
          this.customFields.set(
            claim.form?.custom_fields?.length
              ? claim.form.custom_fields
              : (this.portal()?.custom_fields ?? [])
          );
          this.initialPerson.set(claim.prefill?.person ?? {});
          this.initialCustomValues.set(claim.prefill?.custom_values ?? []);
          this.startClaimExpiry(claim.expires_at);
          this.view.set('update');
        },
        error: (error: ApiClientError) => this.handleApiError(error, 'claim'),
      });
  }

  submitCreate(payload: { person: PersonValues; custom_values: PersonCustomValue[] }): void {
    this.sendRegistration('create', payload);
  }

  submitUpdate(payload: { person: PersonValues; custom_values: PersonCustomValue[] }): void {
    if (!this.claim?.claim_token) {
      this.errorMessage.set('La identificación expiró. Vuelve a identificarte.');
      this.view.set('claim');
      return;
    }
    this.sendRegistration('update', payload, this.claim.claim_token);
  }

  claimFieldError(key: string): string {
    const control = this.claimForm.get(key);
    if (!control || !(control.dirty || control.touched)) return '';
    if (control.hasError('server')) {
      return humanizeApiErrorMessage(String(control.getError('server')), key, {
        labels: PERSON_FIELD_LABELS,
      });
    }
    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('pattern') && key === 'document_number') {
      return 'Usa solo números. Si es pasaporte, letras y números.';
    }
    return control.invalid ? 'Revisa este dato' : '';
  }

  private sendRegistration(
    kind: 'create' | 'update',
    payload: { person: PersonValues; custom_values: PersonCustomValue[] },
    claimToken?: string
  ): void {
    this.submitting.set(true);
    this.clearFeedback();
    this.personPortal
      .submitRegistration({
        kind,
        claim_token: claimToken,
        person: payload.person,
        custom_values: payload.custom_values,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.successKind.set(kind);
          this.clearClaim();
          this.view.set('success');
        },
        error: (error: ApiClientError) => this.handleApiError(error, kind),
      });
  }

  private handleApiError(error: ApiClientError, context: 'claim' | 'create' | 'update'): void {
    if (error.status === 403) {
      this.view.set('unavailable');
      return;
    }

    if (context === 'claim' && error.status === 404) {
      this.claimNotFound.set(true);
      this.errorMessage.set('');
      return;
    }

    this.serverDetails.set([...(error.details ?? [])]);
    this.applyClaimServerDetails(error.details ?? []);
    const leftover = (error.extras ?? []).join(' ').trim();
    this.toastMessage.set(leftover);
    this.errorMessage.set(error.details?.length || leftover ? '' : error.message);
  }

  private applyClaimServerDetails(details: FieldErrorDetail[]): void {
    const keys = ['code', 'document_type', 'document_number', 'birth_date'];
    for (const key of keys) {
      const control = this.claimForm.get(key);
      if (!control?.hasError('server')) continue;
      const { server: _server, ...rest } = control.errors ?? {};
      control.setErrors(Object.keys(rest).length ? rest : null);
    }
    for (const detail of details) {
      const control = this.claimForm.get(detail.field);
      if (!control) continue;
      control.setErrors({ ...(control.errors ?? {}), server: detail.message });
      control.markAsTouched();
    }
  }

  private documentNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value ?? '').trim();
      if (!value) return null;
      const type = String(this.claimForm?.get('document_type')?.value ?? 'CC');
      if (type === 'PA') return /^[A-Za-z0-9-]+$/.test(value) ? null : { pattern: true };
      return /^\d+$/.test(value) ? null : { pattern: true };
    };
  }

  private clearFeedback(): void {
    this.errorMessage.set('');
    this.toastMessage.set('');
    this.claimNotFound.set(false);
    this.serverDetails.set([]);
  }

  private startClaimExpiry(expiresAt?: string): void {
    this.clearClaimTimer();
    if (!expiresAt) return;
    const delay = new Date(expiresAt).getTime() - Date.now();
    if (delay <= 0) {
      this.expireClaim();
      return;
    }
    this.claimTimer = setTimeout(() => this.expireClaim(), delay);
  }

  private expireClaim(): void {
    this.clearClaim();
    if (this.view() === 'update') {
      this.errorMessage.set('La identificación expiró. Vuelve a identificarte.');
      this.view.set('claim');
    }
  }

  private clearClaim(): void {
    this.claim = null;
    this.clearClaimTimer();
  }

  private clearClaimTimer(): void {
    if (this.claimTimer) {
      clearTimeout(this.claimTimer);
      this.claimTimer = null;
    }
  }
}
