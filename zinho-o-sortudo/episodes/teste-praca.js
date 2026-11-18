// teste do cenário da praça e dos NPCs (não publicar)
const P = (o) => ({ style2: true, cap: true, set: 'praca', tod: 'day', ...o });
export default [
  P({ who: 'NAR', text: 'Esta é a praça do bairro do Zinho.', hq: true, blocky: true, cam: { pos: [16, 9, 13], look: [-1, 1.5, -6], fov: 58 }, actors: {} }),
  P({ who: 'ROSA', text: 'Pão quentinho!', cam: { pos: [-11, 1.6, -9], look: [-12, 1.4, -13], fov: 55 }, actors: { rosa: { p: [-12, -12.6], r: 0, a: 'wave', e: 'happy' }, tonho: { p: [-9.6, -11.8], r: -30, a: 'idle', e: 'smug' } } }),
  P({ who: 'ZINHO', text: 'Bora pra praça!', cam: { at: 'zinho', d: 5.5, yaw: 25, h: 0.4, fov: 55 }, actors: { zinho: { p: [4, 4], r: 200, a: 'cheer', e: 'happy' }, dudu: { p: [5.6, 3.6], r: 220, a: 'wave', e: 'happy' }, kaka: { p: [2.6, 3.6], r: 160, a: 'idle', e: 'smug' }, lia: { p: [4.2, 2.6], r: 180, a: 'point', e: 'happy' } } }),
  P({ who: 'NAR', text: 'E à noite, a porta proibida brilha.', tod: 'night', cam: { pos: [-15, 2.2, -5], look: [-22, 2.5, -12], fov: 55 }, actors: { beto: { p: [-18.5, -8.5], r: 220, a: 'shock', e: 'shock' } } }),
  P({ who: 'NAR', text: 'Ponte e portal.', cam: { pos: [26, 3, 9], look: [33, 0.8, 0], fov: 60 }, actors: { juca: { p: [32, 0.6], r: 270, a: 'idle', e: 'neutral' } } }),
  P({ who: 'NAR', text: 'A turma toda do bairro.', cam: { pos: [0, 1.3, 9.5], look: [0, 1.0, 4], fov: 62 },
    actors: { juca: { p: [-3.9, 4], r: 0, a: 'idle', e: 'neutral' }, mae: { p: [-2.8, 4], r: 0, a: 'idle', e: 'happy' }, rosa: { p: [-1.7, 4], r: 0, a: 'wave', e: 'happy' }, lia: { p: [-0.6, 4], r: 0, a: 'idle', e: 'happy' },
      zinho: { p: [0.5, 4], r: 0, a: 'cheer', e: 'happy' }, beto: { p: [1.6, 4], r: 0, a: 'idle', e: 'neutral' }, dudu: { p: [2.6, 4], r: 0, a: 'wave', e: 'happy' }, kaka: { p: [3.6, 4], r: 0, a: 'idle', e: 'smug' }, tonho: { p: [4.8, 4], r: 0, a: 'idle', e: 'smug' } } }),
];
