export function atou(b64: string) {
  return decodeURIComponent(escape(atob(b64)));
}

export function utoa(data: string) {
  return btoa(unescape(encodeURIComponent(data)));
}
