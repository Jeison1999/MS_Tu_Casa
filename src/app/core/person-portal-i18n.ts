/**
 * Textos de validación del portal público.
 * Rails manda claves I18n; aquí se parametrizan para la UI.
 *
 * %{attribute} = etiqueta del campo (schema o catálogo)
 */
export const PERSON_FIELD_LABELS: Record<string, string> = {
  first_name: 'Nombres',
  last_name: 'Apellidos',
  document_type: 'Tipo de documento',
  document_number: 'Número de documento',
  birth_date: 'Fecha de nacimiento',
  sex: 'Sexo',
  gender: 'Sexo',
  email: 'Correo',
  phone: 'Teléfono',
  mobile: 'Celular',
  address: 'Dirección',
  code: 'Código',
};

/** Mensajes cortos (van debajo del campo; la etiqueta ya está arriba). */
export const VALIDATION_MESSAGES: Record<string, string> = {
  taken: 'ya está registrado',
  blank: 'es obligatorio',
  empty: 'es obligatorio',
  present: 'debe dejarse en blanco',
  invalid: 'no es válido',
  not_a_number: 'debe ser un número',
  not_an_integer: 'debe ser un número entero',
  too_short: 'es demasiado corto',
  too_long: 'es demasiado largo',
  too_small: 'es demasiado pequeño',
  too_big: 'es demasiado grande',
  inclusion: 'no está en la lista',
  exclusion: 'no está permitido',
  confirmation: 'no coincide',
  accepted: 'debe ser aceptado',
  required: 'es obligatorio',
};

export function fieldLabel(field: string, labels?: Record<string, string>): string {
  const key = field.trim();
  return labels?.[key] || PERSON_FIELD_LABELS[key] || 'Este dato';
}

export function interpolateTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/%\{(\w+)\}/g, (_, name: string) => vars[name] ?? '');
}

export function validationKindFromText(raw: string): string {
  const keys = [...raw.matchAll(/es(?:\.[a-z0-9_]+)+/gi)].map((match) => match[0].toLowerCase());
  const fromKey = keys.at(-1)?.split('.').pop() ?? '';
  if (fromKey && VALIDATION_MESSAGES[fromKey]) return fromKey;

  const lower = raw.toLowerCase();
  return (
    Object.keys(VALIDATION_MESSAGES).find((kind) => lower.includes(`.${kind}`) || lower.endsWith(kind)) ??
    ''
  );
}

export function formatValidationMessage(
  kind: string,
  field = '',
  options?: { full?: boolean; labels?: Record<string, string> }
): string {
  const phrase = VALIDATION_MESSAGES[kind];
  if (!phrase) return options?.full ? 'Revisa los datos e intenta de nuevo.' : 'Revisa este dato';

  if (options?.full) {
    return interpolateTemplate('%{attribute} %{message}', {
      attribute: fieldLabel(field, options.labels),
      message: phrase,
    });
  }

  return capitalizePhrase(phrase);
}

function capitalizePhrase(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
