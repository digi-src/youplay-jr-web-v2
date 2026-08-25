// catId=2 é inferido do projeto antigo (youplay-jr-web/src/lib/titles.tsx),
// não documentado oficialmente pela API.
export const CATID_SERIES = '2'

// Sem endpoint real de progresso/continuar-assistindo na API — badge e
// progresso mockados, mas as capas e os ids são reais (GET /titles?catId=2),
// pra já poder linkar pra página da série de verdade.
export const CONTINUE_WATCHING = [
  {
    id: 'cw-1',
    titleId: '5346697362276352',
    badge: 'TOP 5',
    title: 'Cubie',
    subtitle: 'Construir & criar',
    progress: 0.85,
    cover: 'https://center.digilivro.com.br/uploads/1775645457.jpeg',
  },
  {
    id: 'cw-2',
    titleId: '5091463662665728',
    badge: 'NOVO',
    title: 'Tempo Giusto',
    subtitle: 'Números & rotina',
    progress: 0.6,
    cover: 'https://center.digilivro.com.br/uploads/1775825077.jpg',
  },
  {
    id: 'cw-3',
    titleId: '5200338063720448',
    badge: 'LIVRE',
    title: 'Floresta Feliz',
    subtitle: 'Natureza',
    progress: 0.95,
    cover: 'https://center.digilivro.com.br/uploads/1775479240.jpg',
  },
  {
    id: 'cw-4',
    titleId: '5634601401712640',
    badge: 'T3',
    title: 'Beto e Fuso',
    subtitle: 'Faz de conta',
    progress: 0.2,
    cover: 'https://center.digilivro.com.br/uploads/1761072880.jpg',
  },
  {
    id: 'cw-5',
    titleId: '5097791692996608',
    badge: 'T2',
    title: "Mimo's World",
    subtitle: 'Amizade',
    progress: 0.05,
    cover: 'https://center.digilivro.com.br/uploads/1775496971.jpg',
  },
]

export const HERO_CONTENT = {
  tag: 'Destaque da semana',
  title: 'Safári na África',
  description:
    'Animais nativos africanos no ambiente natural deles, e as brincadeiras que inventam entre uma soneca e outra.',
  rating: 'Livre',
  ageRange: '4–8 anos',
  duration: '12 min · episódio',
}
