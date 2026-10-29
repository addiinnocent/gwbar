import { Profession } from '@/types/profession';

const _base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function binpadright(s: string, n: number) {
  return s.padEnd(n, '0');
}

function valbin(v: string | number, n: number) {
  return binpadright(strrev(parseInt(v.toString()).toString(2)), n);
}

function binval(b: string) {
  return parseInt(strrev(b), 2);
}

function strrev(s: string) {
  return (s || '').split('').reverse().join('');
}

function charindex(c: string) {
  const n = _base64.length;
  for(let i = 0; i < n; i++) if(_base64.substr(i, 1) == c) return i;
  throw Error;
}

function codetobin(template: string) {
  const length = template.length;
  let binary = '';
  for (let i = 0; i < length; i++) {
      binary += valbin(charindex(template.substr(i, 1)).toString(), 6);
  }
  return binary;
}

function bintocode(bin: string) {
  const r = bin.length % 6;
  let c = '';
  if(r != 0) bin = binpadright(bin, bin.length + 6 - r);
  while(bin.length > 0) {
      c += _base64.substr(parseInt(strrev(bin.substr(0, 6)), 2), 1);
      bin = bin.substr(6);
  }
  return c;
}

function getenumindex(profession: string): number | undefined {
  const index = Object.keys(Profession).findIndex(key => key === profession);
  return index === -1 ? undefined : Number(Profession[profession as keyof typeof Profession]);
}

export {
  binpadright,
  valbin,
  binval,
  strrev,
  charindex,
  codetobin,
  bintocode,
  getenumindex,
}