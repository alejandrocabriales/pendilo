// Permite `require('*.riv')` (Rive, ver components/PoliMascotRive.tsx); Metro lo resuelve
// como un asset (número de módulo), igual que .png/.jpg.
declare module '*.riv' {
  const value: number;
  export default value;
}
