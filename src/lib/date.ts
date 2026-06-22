const formatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const DATE_PATTERN = /^(\d{4})[/-](\d{2})[/-](\d{2})$/;

/**
 * Converte uma data "AAAA/MM/DD" (ou "AAAA-MM-DD") no formato amigável
 * "27 de dezembro de 2022". Se o valor não casar com o padrão, devolve-o
 * inalterado — assim nenhuma data quebra a renderização.
 */
export function formatArticleDate(value: string): string {
  const match = DATE_PATTERN.exec(value.trim());
  if (!match) return value;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return formatter.format(date);
}

/** Versão ISO ("AAAA-MM-DD") para o atributo datetime de <time>. */
export function toIsoDate(value: string): string {
  const match = DATE_PATTERN.exec(value.trim());
  if (!match) return value;

  const [, year, month, day] = match;
  return `${year}-${month}-${day}`;
}
