import { formatValidationMessage, validationKindFromText } from '../person-portal-i18n';

export type PersonFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select';

export interface PersonFieldOption {
  label: string;
  value: string;
}

export interface PersonCoreField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: PersonFieldOption[] | string[];
}

export interface PersonCustomField {
  id: number;
  key: string;
  name: string;
  field_type: string;
  required?: boolean;
  options?: PersonFieldOption[] | string[];
}

export interface PersonPortal {
  enabled: boolean;
  slug?: string;
  title?: string;
  description?: string;
  allow_register?: boolean;
  allow_update?: boolean;
  core_fields?: PersonCoreField[];
  custom_fields?: PersonCustomField[];
}

export interface PersonPortalResponse {
  enabled?: boolean;
  person_portal?: PersonPortal;
  slug?: string;
  title?: string;
  description?: string;
  allow_register?: boolean;
  allow_update?: boolean;
  core_fields?: PersonCoreField[];
  custom_fields?: PersonCustomField[];
}

export type PersonValues = Record<string, string | boolean | number | null>;

export interface PersonCustomValue {
  custom_field_id: number;
  key?: string;
  value: string | boolean | number | null;
}

export interface PersonClaimRequest {
  code?: string;
  document_type?: string;
  document_number?: string;
  birth_date?: string;
}

export interface PersonClaimPrefill {
  person?: PersonValues;
  custom_values?: PersonCustomValue[];
}

export interface PersonClaim {
  claim_token: string;
  expires_at?: string;
  prefill?: PersonClaimPrefill;
  form?: {
    core_fields?: PersonCoreField[];
    custom_fields?: PersonCustomField[];
  };
}

export interface PersonRegistrationPayload {
  kind: 'create' | 'update';
  claim_token?: string;
  person: PersonValues;
  custom_values: PersonCustomValue[];
}

export interface FieldErrorDetail {
  field: string;
  message: string;
}

export interface ApiClientError {
  message: string;
  code: string;
  status?: number;
  details: FieldErrorDetail[];
  extras: string[];
}

export function parseRailsErrorBody(body: unknown): {
  message: string;
  details: FieldErrorDetail[];
  extras: string[];
} {
  if (!body) return { message: '', details: [], extras: [] };
  if (typeof body === 'string') {
    const details: FieldErrorDetail[] = [];
    const extras: string[] = [];
    collectDetails(splitConcatenatedMessages(body), details, extras);
    promoteOrphanMessages(details, extras);
    const message = extras.join(' ').trim() || (details.length ? '' : humanizeApiErrorMessage(body, '', { full: true }));
    return { message, details, extras };
  }

  const payload = body as Record<string, unknown>;
  const rawMessage = pickString(payload['error']) || pickString(payload['message']);
  const details: FieldErrorDetail[] = [];
  const extras: string[] = [];
  collectDetails(payload['details'], details, extras);

  if (!details.length && !extras.length) {
    collectDetails(payload['errors'], details, extras);
  }

  if (!details.length && rawMessage) {
    collectDetails(splitConcatenatedMessages(rawMessage), details, extras);
  }

  promoteOrphanMessages(details, extras);

  const message =
    extras.join(' ').trim() ||
    (details.length ? '' : humanizeApiErrorMessage(rawMessage, '', { full: true }));

  return { message, details, extras };
}

function collectDetails(raw: unknown, details: FieldErrorDetail[], extras: string[]): void {
  if (!raw) return;

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === 'string') {
        const guessed = guessFieldKey(item);
        const message = humanizeApiErrorMessage(item, guessed);
        if (guessed) details.push({ field: guessed, message });
        else extras.push(humanizeApiErrorMessage(item, guessed, { full: false }));
        continue;
      }
      if (item && typeof item === 'object') {
        const row = item as Record<string, unknown>;
        if (isNestedErrorMap(row)) {
          collectDetails(row, details, extras);
          continue;
        }
        const field = normalizeFieldKey(
          pickString(row['field']) ||
            pickString(row['attribute']) ||
            pickString(row['key']) ||
            pickString(row['name'])
        );
        const message =
          pickString(row['message']) ||
          pickString(row['error']) ||
          pickString(row['detail']) ||
          '';
        if (field && message) details.push({ field, message: humanizeApiErrorMessage(message, field) });
        else if (message) extras.push(humanizeApiErrorMessage(message, field, { full: false }));
      }
    }
    return;
  }

  if (typeof raw === 'object') {
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      const field = normalizeFieldKey(key);
      if (value && typeof value === 'object' && !Array.isArray(value) && !isErrorRow(value as Record<string, unknown>)) {
        collectDetails(value, details, extras);
        continue;
      }
      const messages = Array.isArray(value) ? value : [value];
      for (const message of messages) {
        if (message && typeof message === 'object' && !Array.isArray(message)) {
          collectDetails({ [field]: message }, details, extras);
          continue;
        }
        const text = typeof message === 'string' ? message : pickString(message);
        if (!text) continue;
        if (field && field !== 'person' && field !== 'data' && field !== 'attributes') {
          details.push({ field, message: humanizeApiErrorMessage(text, field) });
        } else {
          extras.push(humanizeApiErrorMessage(text, field, { full: false }));
        }
      }
    }
  }
}

function isErrorRow(row: Record<string, unknown>): boolean {
  return !!(row['field'] || row['attribute'] || row['message'] || row['error'] || row['detail']);
}

function isNestedErrorMap(row: Record<string, unknown>): boolean {
  if (isErrorRow(row)) return false;
  return Object.values(row).some((value) => Array.isArray(value) || (value && typeof value === 'object'));
}

const KNOWN_ERROR_PHRASES = [
  'solo puede contener letras',
  'no puede ser una fecha futura',
  'no puede estar en blanco',
  'no puede estar vacío',
  'ya está en uso',
  'ya está registrado',
  'no es válido',
  'es demasiado corto',
  'es demasiado largo',
];

function splitConcatenatedMessages(raw: string): string[] {
  const text = raw.replace(/\s+/g, ' ').trim();
  if (!text) return [];

  const phrases = [...KNOWN_ERROR_PHRASES].sort((a, b) => b.length - a.length);
  const parts: string[] = [];
  let rest = text;
  while (rest) {
    const lower = rest.toLowerCase();
    const hit = phrases.find((phrase) => lower.includes(phrase));
    if (!hit) {
      parts.push(rest);
      break;
    }
    const index = lower.indexOf(hit);
    const before = rest.slice(0, index).trim();
    if (before) parts.push(before + ' ' + rest.slice(index, index + hit.length));
    else parts.push(rest.slice(index, index + hit.length));
    rest = rest.slice(index + hit.length).trim();
  }
  return parts.map((part) => part.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

function promoteOrphanMessages(details: FieldErrorDetail[], extras: string[]): void {
  const used = new Set(details.map((item) => item.field));
  const letterFields = ['first_name', 'last_name'];
  const leftover: string[] = [];

  for (const extra of extras) {
    const field = guessFieldKey(extra) || guessFieldByPhrase(extra, used, letterFields);
    if (!field) {
      leftover.push(extra);
      continue;
    }
    details.push({ field, message: humanizeApiErrorMessage(extra, field) });
    used.add(field);
  }

  extras.length = 0;
  extras.push(...leftover);
}

function guessFieldByPhrase(message: string, used: Set<string>, letterFields: string[]): string {
  const lower = message.toLowerCase();
  if (lower.includes('fecha futura') || lower.includes('future date')) {
    return used.has('birth_date') ? '' : 'birth_date';
  }
  if (lower.includes('contener letras') || lower.includes('only letters') || lower.includes('only alphabetic')) {
    return letterFields.find((field) => !used.has(field)) ?? '';
  }
  return '';
}

export function normalizeFieldKey(raw: string): string {
  if (!raw) return '';
  const cleaned = raw
    .replace(/^person\[/, '')
    .replace(/\]/g, '')
    .replace(/^person\./, '')
    .replace(/^data\./, '')
    .replace(/^attributes\./, '');
  const parts = cleaned.split('.');
  return parts[parts.length - 1] ?? cleaned;
}

function guessFieldKey(message: string): string {
  const lower = message.toLowerCase();
  const byLabel: Array<[string, string]> = [
    ['fecha de nacimiento', 'birth_date'],
    ['número de documento', 'document_number'],
    ['numero de documento', 'document_number'],
    ['tipo de documento', 'document_type'],
    ['document_number', 'document_number'],
    ['document_type', 'document_type'],
    ['birth_date', 'birth_date'],
    ['first_name', 'first_name'],
    ['last_name', 'last_name'],
    ['apellidos', 'last_name'],
    ['nombres', 'first_name'],
    ['correo', 'email'],
    ['email', 'email'],
    ['teléfono', 'phone'],
    ['telefono', 'phone'],
    ['celular', 'mobile'],
    ['phone', 'phone'],
    ['código', 'code'],
    ['codigo', 'code'],
    ['code', 'code'],
    ['sexo', 'sex'],
    ['gender', 'gender'],
  ];
  return byLabel.find(([needle]) => lower.includes(needle))?.[1] ?? '';
}

function pickString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function humanizeApiErrorMessage(
  raw: string,
  field = '',
  options?: { full?: boolean; labels?: Record<string, string> }
): string {
  if (!raw) return '';
  const text = raw.replace(/\s+/g, ' ').trim();
  const fieldKey =
    normalizeFieldKey(field) ||
    (text.includes('document_number') ? 'document_number' : '') ||
    (/\bemail\b/.test(text) ? 'email' : '') ||
    (text.includes('phone') ? 'phone' : '');

  const looksLikeI18n =
    /translation missing/i.test(text) ||
    /activerecord\.errors/i.test(text) ||
    /es\.errors\./i.test(text);

  if (looksLikeI18n) {
    const kind = validationKindFromText(text);
    return formatValidationMessage(kind, fieldKey, {
      full: options?.full ?? false,
      labels: options?.labels,
    });
  }

  const cleaned = stripRepeatedFieldName(text);
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : cleaned;
}

function stripRepeatedFieldName(message: string): string {
  return message
    .replace(
      /^(n[uú]mero de documento|tipo de documento|fecha de nacimiento|correo|email|tel[eé]fono|nombres?|apellidos?|sexo)\s+/i,
      ''
    )
    .trim();
}

export const DOCUMENT_TYPE_OPTIONS: PersonFieldOption[] = [
  { label: 'Cédula de ciudadanía', value: 'CC' },
  { label: 'Tarjeta de identidad', value: 'TI' },
  { label: 'Cédula de extranjería', value: 'CE' },
  { label: 'Pasaporte', value: 'PA' },
  { label: 'PPT', value: 'PPT' },
  { label: 'Registro civil', value: 'RC' },
];

export function normalizePersonFieldType(raw: string | undefined): PersonFieldType {
  const type = (raw ?? 'text').toLowerCase();
  if (type === 'textarea' || type === 'text_area') return 'textarea';
  if (type === 'email') return 'email';
  if (type === 'tel' || type === 'phone' || type === 'mobile') return 'tel';
  if (type === 'number' || type === 'integer' || type === 'decimal') return 'number';
  if (type === 'date' || type === 'datetime') return 'date';
  if (type === 'boolean' || type === 'bool' || type === 'checkbox') return 'boolean';
  if (type === 'select' || type === 'enum' || type === 'dropdown') return 'select';
  return 'text';
}

export function normalizeFieldOptions(
  options: PersonFieldOption[] | string[] | undefined
): PersonFieldOption[] {
  if (!options?.length) return [];
  return options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option
  );
}

export function unwrapPersonPortal(response: PersonPortalResponse | PersonPortal): PersonPortal {
  const nested = (response as PersonPortalResponse).person_portal;
  const source = nested ?? (response as PersonPortal);
  return {
    enabled: !!source.enabled,
    slug: source.slug,
    title: source.title,
    description: source.description,
    allow_register: source.allow_register !== false,
    allow_update: source.allow_update !== false,
    core_fields: source.core_fields ?? [],
    custom_fields: source.custom_fields ?? [],
  };
}
