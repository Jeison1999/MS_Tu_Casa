import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  DOCUMENT_TYPE_OPTIONS,
  FieldErrorDetail,
  PersonCoreField,
  PersonCustomField,
  PersonCustomValue,
  PersonFieldOption,
  PersonValues,
  humanizeApiErrorMessage,
  normalizeFieldOptions,
  normalizePersonFieldType,
} from '../../core/models/person-portal.model';
import { PERSON_FIELD_LABELS } from '../../core/person-portal-i18n';

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;
const DIGITS_PATTERN = /^\d+$/;
const PASSPORT_PATTERN = /^[A-Za-z0-9-]+$/;
const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ']+(?:[ \-'][A-Za-zÁÉÍÓÚÜÑáéíóúüñ']+)*$/;

@Component({
  selector: 'app-person-dynamic-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './person-dynamic-form.component.html',
  styleUrl: './person-dynamic-form.component.css',
})
export class PersonDynamicFormComponent implements OnChanges {
  @Input({ required: true }) coreFields: PersonCoreField[] = [];
  @Input() customFields: PersonCustomField[] = [];
  @Input() initialPerson: PersonValues = {};
  @Input() initialCustomValues: PersonCustomValue[] = [];
  @Input() submitLabel = 'Enviar solicitud';
  @Input() submitting = false;
  @Input() serverDetails: FieldErrorDetail[] = [];

  @Output() submitted = new EventEmitter<{
    person: PersonValues;
    custom_values: PersonCustomValue[];
  }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      person: this.fb.group({}),
      custom: this.fb.group({}),
    });
  }

  get personGroup(): FormGroup {
    return this.form.get('person') as FormGroup;
  }

  get customGroup(): FormGroup {
    return this.form.get('custom') as FormGroup;
  }

  get maxBirthDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const schemaChanged =
      changes['coreFields'] ||
      changes['customFields'] ||
      changes['initialPerson'] ||
      changes['initialCustomValues'];

    if (schemaChanged) {
      this.rebuildForm();
    }

    if (changes['serverDetails'] || schemaChanged) {
      this.applyServerDetails();
    }
  }

  get labelMap(): Record<string, string> {
    const labels: Record<string, string> = { ...PERSON_FIELD_LABELS };
    for (const field of this.coreFields) {
      if (field.key && field.label) labels[field.key] = field.label;
    }
    for (const field of this.customFields) {
      if (field.key && field.name) labels[field.key] = field.name;
      labels[String(field.id)] = field.name;
    }
    return labels;
  }

  fieldType(field: PersonCoreField | PersonCustomField): ReturnType<typeof normalizePersonFieldType> {
    const raw = 'type' in field ? field.type : field.field_type;
    return normalizePersonFieldType(raw);
  }

  fieldLabel(field: PersonCoreField | PersonCustomField): string {
    return 'label' in field ? field.label : field.name;
  }

  fieldOptions(field: PersonCoreField | PersonCustomField): PersonFieldOption[] {
    const options = normalizeFieldOptions(field.options);
    if (options.length) return options;
    if ('key' in field && field.key === 'document_type') return DOCUMENT_TYPE_OPTIONS;
    return [];
  }

  inputType(field: PersonCoreField | PersonCustomField): string {
    const type = this.fieldType(field);
    if (type === 'tel') return 'tel';
    if (type === 'email') return 'email';
    if (type === 'number') return 'number';
    if (type === 'date') return 'date';
    return 'text';
  }

  inputMode(field: PersonCoreField | PersonCustomField): string | null {
    const key = 'key' in field ? field.key : '';
    const type = this.fieldType(field);
    if (type === 'email') return 'email';
    if (type === 'tel') return 'tel';
    if (type === 'number') return 'numeric';
    if (key === 'document_number' && this.personGroup.get('document_type')?.value !== 'PA') {
      return 'numeric';
    }
    return null;
  }

  controlInvalid(group: FormGroup, key: string): boolean {
    const control = group.get(key);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  fieldError(group: FormGroup, key: string, field?: PersonCoreField | PersonCustomField): string {
    const control = group.get(key);
    if (!control || !control.invalid || !(control.dirty || control.touched)) return '';
    if (control.hasError('server')) {
      const keyHint = field && 'key' in field ? field.key : key;
      return humanizeApiErrorMessage(String(control.getError('server')), keyHint, {
        labels: this.labelMap,
      });
    }
    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('email')) return 'Escribe un correo válido';
    if (control.hasError('futureDate')) return 'No puede ser una fecha futura';
    if (control.hasError('pattern')) {
      if (key === 'first_name' || key === 'last_name' || (field && 'key' in field && (field.key === 'first_name' || field.key === 'last_name'))) {
        return 'Solo puede contener letras';
      }
      if (key === 'document_number' || (field && 'key' in field && field.key === 'document_number')) {
        return 'Usa solo números. Si es pasaporte, letras y números.';
      }
      if (field && this.fieldType(field) === 'tel') return 'Revisa el teléfono';
      return 'Revisa este dato';
    }
    return 'Revisa este dato';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting) return;

    const personRaw = this.personGroup.getRawValue() as PersonValues;
    const person: PersonValues = {};
    for (const [key, value] of Object.entries(personRaw)) {
      if (typeof value === 'boolean') {
        person[key] = value;
        continue;
      }
      if (value === null || value === undefined || value === '') continue;
      person[key] = typeof value === 'string' ? value.trim() : value;
    }

    const customRaw = this.customGroup.getRawValue() as Record<string, unknown>;
    const custom_values: PersonCustomValue[] = [];
    for (const field of this.customFields) {
      const value = customRaw[String(field.id)];
      if (value === null || value === undefined || value === '') continue;
      custom_values.push({
        custom_field_id: field.id,
        key: field.key,
        value: value as string | boolean | number,
      });
    }

    this.submitted.emit({ person, custom_values });
  }

  private rebuildForm(): void {
    const personGroup = this.fb.group({});
    for (const field of this.coreFields) {
      personGroup.addControl(field.key, this.buildControl(field, this.initialPerson[field.key]));
    }

    const documentNumber = personGroup.get('document_number');
    if (documentNumber) {
      documentNumber.addValidators(this.documentNumberValidator(personGroup));
      personGroup.get('document_type')?.valueChanges.subscribe(() => {
        documentNumber.updateValueAndValidity({ emitEvent: false });
      });
    }

    const customMap = new Map(
      (this.initialCustomValues ?? []).map((item) => [item.custom_field_id, item.value])
    );
    const customGroup = this.fb.group({});
    for (const field of this.customFields) {
      customGroup.addControl(
        String(field.id),
        this.buildControl(field, customMap.get(field.id) ?? customMap.get(Number(field.id)))
      );
    }

    this.form = this.fb.group({
      person: personGroup,
      custom: customGroup,
    });
    this.watchToClearServerErrors(this.personGroup);
    this.watchToClearServerErrors(this.customGroup);
  }

  private buildControl(
    field: PersonCoreField | PersonCustomField,
    initial: unknown
  ): FormControl {
    const type = this.fieldType(field);
    const key = 'key' in field ? field.key : '';
    const required = !!field.required;
    const validators: ValidatorFn[] = [];
    if (required && type !== 'boolean') validators.push(Validators.required);
    if (type === 'email') validators.push(Validators.email);
    if (type === 'tel') validators.push(Validators.pattern(PHONE_PATTERN));
    if (type === 'number') validators.push(Validators.pattern(/^-?\d+([.,]\d+)?$/));
    if (key === 'phone' || key === 'mobile') validators.push(Validators.pattern(PHONE_PATTERN));
    if (key === 'first_name' || key === 'last_name') validators.push(Validators.pattern(NAME_PATTERN));
    if (type === 'date' || key === 'birth_date') validators.push(this.notFutureDateValidator());

    let value: unknown = initial ?? (type === 'boolean' ? false : '');
    if (type === 'boolean') value = this.toBoolean(value);
    if (type === 'date') value = this.toDateInput(value);

    return this.fb.control(value, validators);
  }

  private notFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value ?? '').trim();
      if (!value) return null;
      const date = value.slice(0, 10);
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return date > `${yyyy}-${mm}-${dd}` ? { futureDate: true } : null;
    };
  }

  private documentNumberValidator(personGroup: FormGroup): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value ?? '').trim();
      if (!value) return null;
      const type = String(personGroup.get('document_type')?.value ?? 'CC');
      if (type === 'PA') {
        return PASSPORT_PATTERN.test(value) ? null : { pattern: true };
      }
      return DIGITS_PATTERN.test(value) ? null : { pattern: true };
    };
  }

  private applyServerDetails(): void {
    this.clearServerErrors(this.personGroup);
    this.clearServerErrors(this.customGroup);
    if (!this.serverDetails?.length) return;

    for (const detail of this.serverDetails) {
      const control = this.findControl(detail.field);
      if (!control) continue;
      control.setErrors({ ...(control.errors ?? {}), server: detail.message });
      control.markAsTouched();
    }
  }

  private findControl(field: string): AbstractControl | null {
    if (this.personGroup.get(field)) return this.personGroup.get(field);
    if (this.customGroup.get(field)) return this.customGroup.get(field);

    const custom = this.customFields.find(
      (item) => item.key === field || String(item.id) === field
    );
    return custom ? this.customGroup.get(String(custom.id)) : null;
  }

  private clearServerErrors(group: FormGroup): void {
    for (const key of Object.keys(group.controls)) {
      const control = group.get(key);
      if (!control?.hasError('server')) continue;
      const { server: _server, ...rest } = control.errors ?? {};
      control.setErrors(Object.keys(rest).length ? rest : null);
    }
  }

  private watchToClearServerErrors(group: FormGroup): void {
    for (const key of Object.keys(group.controls)) {
      const control = group.get(key);
      control?.valueChanges.subscribe(() => {
        if (!control.hasError('server')) return;
        const { server: _server, ...rest } = control.errors ?? {};
        control.setErrors(Object.keys(rest).length ? rest : null);
      });
    }
  }

  private toBoolean(value: unknown): boolean {
    return value === true || value === 'true' || value === 1 || value === '1';
  }

  private toDateInput(value: unknown): string {
    if (!value) return '';
    const text = String(value);
    return text.includes('T') ? text.slice(0, 10) : text;
  }
}
