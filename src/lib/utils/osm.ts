export const getPlaceLabel = (result: any): string => {
  const { osm_key, osm_value } = result;

  const map: Record<string, string> = {
    'place:city': 'Cidade',
    'place:town': 'Município',
    'place:village': 'Vila',
    'place:suburb': 'Bairro',
    'place:neighbourhood': 'Bairro',
    'place:locality': 'Localidade',
    'place:hamlet': 'Povoado',

    'highway:residential': 'Rua',
    'highway:primary': 'Avenida',
    'highway:secondary': 'Rua Principal',
    'highway:tertiary': 'Rua',
    'highway:pedestrian': 'Calçadão',
    'highway:trunk': 'Rodovia',
    'highway:motorway': 'Rodovia',
    'highway:service': 'Via de Acesso',
    'highway:track': 'Estrada de Terra',
    'highway:path': 'Caminho',
    'highway:footway': 'Calçada',

    'amenity:pharmacy': 'Farmácia',
    'amenity:hospital': 'Hospital',
    'amenity:clinic': 'Clínica',
    'amenity:doctors': 'Consultório Médico',
    'amenity:dentist': 'Dentista',
    'amenity:school': 'Escola',
    'amenity:university': 'Universidade',
    'amenity:college': 'Faculdade',
    'amenity:kindergarten': 'Jardim de Infância',
    'amenity:restaurant': 'Restaurante',
    'amenity:cafe': 'Café',
    'amenity:bar': 'Bar',
    'amenity:pub': 'Pub',
    'amenity:fast_food': 'Fast Food',
    'amenity:bank': 'Banco',
    'amenity:atm': 'Caixa Eletrônico',
    'amenity:post_office': 'Correios',
    'amenity:police': 'Polícia',
    'amenity:fire_station': 'Bombeiros',
    'amenity:place_of_worship': 'Local de Culto',
    'amenity:fuel': 'Posto de Combustível',
    'amenity:parking': 'Estacionamento',
    'amenity:veterinary': 'Veterinário',
    'amenity:library': 'Biblioteca',
    'amenity:townhall': 'Prefeitura',
    'amenity:courthouse': 'Tribunal',
    'amenity:arts_centre': 'Centro Cultural',

    'shop:supermarket': 'Supermercado',
    'shop:bakery': 'Padaria',
    'shop:clothes': 'Loja de Roupas',
    'shop:convenience': 'Conveniência',
    'shop:mall': 'Shopping',
    'shop:department_store': 'Loja de Departamentos',
    'shop:electronics': 'Eletrônicos',
    'shop:hardware': 'Ferragens',
    'shop:hairdresser': 'Cabeleireiro',
    'shop:beauty': 'Salão de Beleza',
    'shop:car_repair': 'Oficina Mecânica',
    'shop:pet': 'Pet Shop',
    'shop:butcher': 'Açougue',
    'shop:optician': 'Ótica',
    'shop:books': 'Livraria',

    'tourism:museum': 'Museu',
    'tourism:hotel': 'Hotel',
    'tourism:attraction': 'Ponto Turístico',
    'tourism:artwork': 'Arte Pública',
    'tourism:viewpoint': 'Mirante',
    'tourism:zoo': 'Zoológico',
    'tourism:theme_park': 'Parque Temático',
    'leisure:park': 'Parque',
    'leisure:garden': 'Jardim',
    'leisure:stadium': 'Estádio',
    'leisure:sports_centre': 'Centro Esportivo',
    'leisure:playground': 'Parquinho',
    'historic:monument': 'Monumento',
    'historic:memorial': 'Memorial',
    'historic:castle': 'Castelo',
    'historic:ruins': 'Ruínas',
    'historic:building': 'Edifício Histórico',

    'railway:station': 'Estação de Trem',
    'railway:subway_entrance': 'Metrô',
    'public_transport:platform': 'Ponto de Embarque',
    'public_transport:stop_position': 'Ponto de Ônibus',
    'aeroway:aerodrome': 'Aeroporto',
    'aeroway:terminal': 'Terminal de Aeroporto',

    'man_made:tower': 'Torre',
    'building:apartments': 'Condomínio',
    'building:residential': 'Residencial',
    'building:commercial': 'Edifício Comercial',
    'building:office': 'Escritórios',
    'building:university': 'Prédio Universitário',
    'building:yes': 'Edifício',
    'boundary:administrative': 'Região Administrativa',
    'landuse:residential': 'Área Residencial',
    'landuse:commercial': 'Área Comercial',
    'landuse:industrial': 'Área Industrial',
    'office:government': 'Órgão Público'
  };

  const key = `${osm_key}:${osm_value}`;

  return map[key] || osm_value.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
};

export const getPlaceType = (result: any): 'area' | 'point' => {
  const areas = ['city', 'town', 'village', 'suburb', 'neighbourhood', 'park', 'administrative', 'residential', 'industrial', 'commercial'];

  if (areas.includes(result.osm_value) || result.osm_key === 'landuse' || result.osm_key === 'boundary') return 'area';

  return 'point';
};