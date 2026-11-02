// Признаки модели для отбора работ – копия из monobrend-servis/data/brands.mjs.
export function features(m) {
  const f = new Set(['all']);
  for (const p of m.pt) {
    if (p !== 'bev') f.add('engine');
    if (p !== 'ice') { f.add('hv'); f.add('plug'); }
    if (p === 'erev') f.add('erev');
  }
  if (m.air !== 'no') f.add('air');
  if (m.gearbox) f.add('gearbox');
  return f;
}
export const PT_NAME = { bev: 'электромобиль', erev: 'электромобиль с бензиновым генератором', phev: 'подключаемый гибрид', ice: 'бензиновый двигатель' };
export const DEMAND_MIN = 1000; // Wordstat РФ в месяц: ниже – отдельных страниц «модель × работа» нет
export const ptLine = (m) => m.pt.map((p) => PT_NAME[p]).join(' или ');
