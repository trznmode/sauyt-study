/** Клиенты блока «Наши клиенты» + данные для предпросмотра Booking.com */
(function () {
  function bookingSearch(name, city) {
    return 'https://www.booking.com/searchresults.ru.html?ss=' +
      encodeURIComponent(name + ' ' + city) + '&lang=ru';
  }

  function ratingLabel(score) {
    if (score >= 9) return 'Превосходно';
    if (score >= 8) return 'Очень хорошо';
    if (score >= 7) return 'Хорошо';
    if (score >= 6) return 'Неплохо';
    return 'Оценка гостей';
  }

  function enrich(entry) {
    if (entry.rating != null && !entry.ratingLabel) {
      entry.ratingLabel = ratingLabel(entry.rating);
    }
    return entry;
  }

  window.TRUST_CLIENTS = [
    enrich({
      id: 'grand-opera',
      name: 'Grand Opera Hotel',
      city: 'Алматы',
      rooms: 40,
      stars: 4,
      bookingUrl: 'https://www.booking.com/hotel/kz/grand-opera-almaty3.ru.html',
      rating: 7.3,
      reviews: 502,
      photos: ['assets/trust/grand-opera.webp'],
      work: 'Настроили профиль на Booking.com, подключили Channel Manager и синхронизацию тарифов с PMS.'
    }),
    {
      id: 'aqua-grand',
      name: 'Aqua Grand Hotel',
      city: 'Алматы',
      rooms: 50,
      stars: 4,
      bookingUrl: bookingSearch('Aqua Grand Hotel', 'Алматы')
    },
    enrich({
      id: 'vivaldi',
      name: 'Vivaldi International Hotel',
      city: 'Алматы',
      rooms: 23,
      stars: 4,
      bookingUrl: 'https://www.booking.com/hotel/kz/vivaldis.ru.html',
      rating: 7.2,
      reviews: 315,
      photos: ['assets/trust/vivaldi.jpg'],
      work: 'Оформили и оптимизировали карточку на Booking.com, настроили управление номерным фондом.'
    }),
    {
      id: 'kok-tobe-villas',
      name: 'Kok-Tobe Villas Boutique Hotel',
      city: 'Алматы',
      rooms: 8,
      bookingUrl: bookingSearch('Kok-Tobe Villas Boutique Hotel', 'Алматы')
    },
    {
      id: 'kok-tobe-hilltop',
      name: 'Kok-Tobe Hilltop',
      city: 'Алматы',
      rooms: 4,
      bookingUrl: bookingSearch('Kok-Tobe Hilltop', 'Алматы')
    },
    enrich({
      id: 'mir-hotel',
      name: 'MirOtel Hotel',
      city: 'Шымкент',
      rooms: 20,
      bookingUrl: 'https://www.booking.com/hotel/kz/mirotel-shymkent2.ru.html',
      rating: 9.1,
      reviews: 395,
      photos: ['assets/trust/mir-hotel.jpg'],
      work: 'Запустили продажи на Booking.com и настроили автоматическое обновление доступности номеров.'
    }),
    {
      id: 'paradise-villas',
      name: 'Paradise Villas',
      city: 'Шымкент',
      rooms: 35,
      instagramUrl: 'https://www.instagram.com/paradisevillas.kz/',
      work: 'Ведём продвижение объекта в Instagram и помогаем с контентом для соцсетей.'
    },
    enrich({
      id: 'aurum-garden',
      name: 'Aurum Garden Hotel',
      city: 'Шымкент',
      rooms: 45,
      bookingUrl: 'https://www.booking.com/hotel/kz/aurum-garden.ru.html',
      rating: 9.6,
      reviews: 645,
      photos: ['assets/trust/aurum-garden.jpg'],
      work: 'Подключили Booking.com, настроили тарифы и календарь бронирований через Channel Manager.'
    }),
    enrich({
      id: 'mir-hotel-astana',
      name: 'MirOtel Hotel',
      city: 'Астана',
      rooms: 42,
      stars: 3,
      bookingUrl: 'https://www.booking.com/hotel/kz/mirotel.ru.html',
      rating: 8.7,
      reviews: 724,
      photos: ['assets/trust/mirotel-astana.jpg'],
      work: 'Интегрировали PMS с Booking.com, настроили синхронизацию цен и ограничений по номерам.'
    }),
    enrich({
      id: 'airis-residence',
      name: 'Airis Residence Hotel',
      city: 'Алматы',
      rooms: 32,
      stars: 4,
      bookingUrl: 'https://www.booking.com/hotel/kz/airis-rezidence.ru.html',
      rating: 8.4,
      reviews: 377,
      photos: ['assets/trust/airis-residence.jpg'],
      work: 'Оптимизировали профиль на Booking.com и подключили автоматическую выгрузку доступности.'
    }),
    enrich({
      id: 'avenue-boutique',
      name: 'Avenue Boutique Hotel',
      city: 'Боровое',
      rooms: 18,
      bookingUrl: 'https://www.booking.com/hotel/kz/avenue-boutique-burabai.ru.html',
      rating: 9.2,
      reviews: 47,
      photos: ['assets/trust/avenue-boutique.jpg'],
      work: 'Запустили объект на Booking.com и настроили сезонные тарифы для курортного сезона.'
    }),
    {
      id: 'tanzharyk',
      name: 'TanZharyk Hotel',
      city: 'Актобе',
      rooms: 28,
      bookingUrl: bookingSearch('TanZharyk Hotel', 'Актобе')
    },
    {
      id: 'mazhor',
      name: 'Mazhor Hotel',
      city: 'Актобе',
      rooms: 24,
      bookingUrl: bookingSearch('Mazhor Hotel', 'Актобе')
    },
    enrich({
      id: 'keruen',
      name: 'Keruen Hotel',
      city: 'Тараз',
      rooms: 36,
      stars: 4,
      bookingUrl: 'https://www.booking.com/hotel/kz/keruen-gostinitsa.ru.html',
      rating: 8.9,
      reviews: 252,
      photos: ['assets/trust/keruen.jpg'],
      work: 'Настроили Channel Manager и двустороннюю синхронизацию с Booking.com.'
    }),
    enrich({
      id: 'keruen-de-luxe',
      name: 'Keruen De Luxe',
      city: 'Тараз',
      rooms: 24,
      stars: 4,
      bookingUrl: 'https://www.booking.com/hotel/kz/gostinitsa-keruen-taraz.ru.html',
      rating: 9.1,
      reviews: 376,
      photos: ['assets/trust/keruen-de-luxe.jpg'],
      work: 'Подключили премиальный сегмент к Booking.com и настроили управление тарифами.'
    }),
    enrich({
      id: 'bal-meyir',
      name: 'Bal-Meyir Hotel',
      city: 'Алматы',
      rooms: 22,
      bookingUrl: 'https://www.booking.com/hotel/kz/bal-meyir-almaty2.ru.html',
      rating: 7.0,
      reviews: 95,
      photos: ['assets/trust/bal-meyir.jpg'],
      work: 'Оформили карточку отеля на Booking.com и настроили онлайн-бронирование номеров.'
    }),
    {
      id: 'jasmine',
      name: 'Jasmine Hotel',
      city: 'Астана',
      rooms: 20,
      bookingUrl: bookingSearch('Jasmine Hotel', 'Астана')
    },
    enrich({
      id: 'east-astana',
      name: 'East Astana Hotel',
      city: 'Астана',
      rooms: 32,
      bookingUrl: 'https://www.booking.com/hotel/kz/east-astana.ru.html',
      rating: 8.2,
      reviews: 163,
      photos: ['assets/trust/east-astana.jpg'],
      work: 'Интегрировали отель с Booking.com через Channel Manager и настроили тарифные планы.'
    }),
    {
      id: 'seven-house',
      name: 'Seven House Hotel',
      city: 'Астана',
      rooms: 14,
      bookingUrl: bookingSearch('Seven House Hotel', 'Астана')
    },
    {
      id: 'five-hotel',
      name: 'Five Hotel',
      city: 'Астана',
      rooms: 8,
      bookingUrl: bookingSearch('Five Hotel', 'Астана')
    },
    {
      id: 'bed-breakfast',
      name: 'Bed & Breakfast',
      city: 'Астана',
      rooms: 12,
      bookingUrl: bookingSearch('Bed and Breakfast', 'Астана')
    },
    {
      id: 'tau-dream',
      name: 'Tau Dream Hotel',
      city: 'Алматы',
      rooms: 18,
      bookingUrl: bookingSearch('Tau Dream Hotel', 'Алматы')
    },
    enrich({
      id: 'sunny-hostel',
      name: 'Sunny Hostel',
      city: 'Алматы',
      rooms: 12,
      bookingUrl: 'https://www.booking.com/hotel/kz/uiutnyi-khostel-almaty.ru.html',
      rating: 8.3,
      reviews: 285,
      photos: ['assets/trust/sunny-hostel.jpg'],
      work: 'Запустили хостел на Booking.com и настроили управление койко-местами.'
    }),
    enrich({
      id: 'well-sleep',
      name: 'Well Sleep Hotel Almaty',
      city: 'Алматы',
      rooms: 14,
      bookingUrl: 'https://www.booking.com/hotel/kz/well-sleep.ru.html',
      rating: 6.4,
      reviews: 83,
      photos: ['assets/trust/well-sleep.jpg'],
      work: 'Подключили отель к Booking.com и настроили синхронизацию номерного фонда.'
    }),
    enrich({
      id: 'inzhu-premium',
      name: 'Inzhu Premium Hotel',
      city: 'Тараз',
      rooms: 17,
      bookingUrl: 'https://www.booking.com/hotel/kz/inzhu-premium.ru.html',
      photos: ['assets/trust/inzhu-premium.jpg'],
      work: 'Оформили профиль на Booking.com и подготовили объект к приёму онлайн-бронирований.'
    }),
    enrich({
      id: 'sky-28',
      name: 'Sky 28',
      city: 'Алматы',
      stars: 3,
      bookingUrl: 'https://www.booking.com/hotel/kz/sky-28-almaty3.ru.html',
      rating: 9.3,
      reviews: 75,
      photos: ['assets/trust/sky-28.jpg'],
      work: 'Настроили продажи на Booking.com и подключили Channel Manager для управления тарифами.'
    })
  ];

  window.TRUST_CLIENTS_BY_ID = Object.fromEntries(
    window.TRUST_CLIENTS.map(function (c) { return [c.id, c]; })
  );
})();
