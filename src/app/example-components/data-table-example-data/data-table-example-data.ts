// example data (randomly generated) to mock database requests

const exampleData = [
  {
    id: 0,
    title: 'Mr',
    name: 'Jacob Shaw',
    gender: 'male',
    email: 'jacob.shaw@example.com',
    age: 17,
    salary: 88.6463,
    registered: '2005-09-04T03:09:06.480Z',
  },
  {
    id: 1,
    title: 'Ms',
    name: 'Angela Cortes',
    gender: 'female',
    email: 'angela.cortes@example.com',
    age: 6,
    salary: 32.1336,
    registered: '2016-03-10T12:35:00.807Z',
  },
  {
    id: 2,
    title: 'Miss',
    name: 'Lorena Gomez',
    gender: 'female',
    email: 'lorena.gomez@example.com',
    age: 7,
    salary: 34.8089,
    registered: '2015-07-05T22:09:00.189Z',
  },
  {
    id: 3,
    title: 'Mr',
    name: 'Davut Bolatlı',
    gender: 'male',
    email: 'davut.bolatli@example.com',
    age: 10,
    salary: 81.0075,
    registered: '2012-08-22T09:17:03.289Z',
  },
  {
    id: 4,
    title: 'Mr',
    name: 'Uwe Schwanz',
    gender: 'male',
    email: 'uwe.schwanz@example.com',
    age: 4,
    salary: 50.3015,
    registered: '2018-06-23T01:48:10.137Z',
  },
  {
    id: 5,
    title: 'Ms',
    name: 'Eevi Jarvi',
    gender: 'female',
    email: 'eevi.jarvi@example.com',
    age: 12,
    salary: 56.0505,
    registered: '2010-04-23T11:37:03.160Z',
  },
  {
    id: 6,
    title: 'Mr',
    name: 'Leo Turner',
    gender: 'male',
    email: 'leo.turner@example.com',
    age: 16,
    salary: 4.5006,
    registered: '2006-01-02T02:38:41.220Z',
  },
  {
    id: 7,
    title: 'Mr',
    name: 'Miguel Lawrence',
    gender: 'male',
    email: 'miguel.lawrence@example.com',
    age: 18,
    salary: 70.3227,
    registered: '2004-10-22T21:07:31.163Z',
  },
  {
    id: 8,
    title: 'Mr',
    name: 'Ibérico Barbosa',
    gender: 'male',
    email: 'iberico.barbosa@example.com',
    age: 6,
    salary: 56.005,
    registered: '2016-09-18T05:24:51.306Z',
  },
  {
    id: 9,
    title: 'Miss',
    name: 'Matilda Erkkila',
    gender: 'female',
    email: 'matilda.erkkila@example.com',
    age: 6,
    salary: 86.6916,
    registered: '2016-08-18T03:24:13.985Z',
  },
  {
    id: 10,
    title: 'Miss',
    name: 'Michelle Lowe',
    gender: 'female',
    email: 'michelle.lowe@example.com',
    age: 7,
    salary: 37.2817,
    registered: '2015-07-20T16:54:17.140Z',
  },
  {
    id: 11,
    title: 'Ms',
    name: 'Belen Ruiz',
    gender: 'female',
    email: 'belen.ruiz@example.com',
    age: 20,
    salary: 74.3902,
    registered: '2002-11-22T01:59:02.233Z',
  },
  {
    id: 12,
    title: 'Mrs',
    name: 'Kitty Lopez',
    gender: 'female',
    email: 'kitty.lopez@example.com',
    age: 16,
    salary: 40.1546,
    registered: '2006-07-01T02:56:30.268Z',
  },
  {
    id: 13,
    title: 'Miss',
    name: 'Karla Jankowski',
    gender: 'female',
    email: 'karla.jankowski@example.com',
    age: 9,
    salary: 34.4814,
    registered: '2013-06-25T05:06:15.263Z',
  },
  {
    id: 14,
    title: 'Mr',
    name: 'Jan Aulie',
    gender: 'male',
    email: 'jan.aulie@example.com',
    age: 3,
    salary: 54.5651,
    registered: '2019-01-11T21:32:57.025Z',
  },
  {
    id: 15,
    title: 'Mr',
    name: 'Roland Miles',
    gender: 'male',
    email: 'roland.miles@example.com',
    age: 9,
    salary: 73.2081,
    registered: '2013-10-01T00:36:42.891Z',
  },
  {
    id: 16,
    title: 'Mr',
    name: 'Stephen Fox',
    gender: 'male',
    email: 'stephen.fox@example.com',
    age: 16,
    salary: 46.3655,
    registered: '2006-01-09T01:23:00.339Z',
  },
  {
    id: 17,
    title: 'Miss',
    name: 'Natalija Stolz',
    gender: 'female',
    email: 'natalija.stolz@example.com',
    age: 14,
    salary: 7.9081,
    registered: '2008-07-21T09:28:50.253Z',
  },
  {
    id: 18,
    title: 'Ms',
    name: 'Latife Saygıner',
    gender: 'female',
    email: 'latife.sayginer@example.com',
    age: 5,
    salary: 37.3471,
    registered: '2017-08-22T10:01:58.872Z',
  },
  {
    id: 19,
    title: 'Mr',
    name: 'Jimmy Carter',
    gender: 'male',
    email: 'jimmy.carter@example.com',
    age: 9,
    salary: 5.2243,
    registered: '2013-09-09T08:56:01.421Z',
  },
  {
    id: 20,
    title: 'Mr',
    name: 'آراد صدر',
    gender: 'male',
    email: 'ard.sdr@example.com',
    age: 18,
    salary: 46.4155,
    registered: '2004-06-24T03:31:24.105Z',
  },
  {
    id: 21,
    title: 'Miss',
    name: 'Valdinélia Gonçalves',
    gender: 'female',
    email: 'valdinelia.goncalves@example.com',
    age: 8,
    salary: 47.8849,
    registered: '2014-06-26T10:01:02.791Z',
  },
  {
    id: 22,
    title: 'Mr',
    name: 'Önal Tahincioğlu',
    gender: 'male',
    email: 'onal.tahincioglu@example.com',
    age: 10,
    salary: 14.6698,
    registered: '2012-03-11T03:08:47.279Z',
  },
  {
    id: 23,
    title: 'Mr',
    name: 'Kelly Adams',
    gender: 'male',
    email: 'kelly.adams@example.com',
    age: 20,
    salary: 4.5383,
    registered: '2002-09-13T18:27:56.485Z',
  },
  {
    id: 24,
    title: 'Mr',
    name: 'Cristian Mendez',
    gender: 'male',
    email: 'cristian.mendez@example.com',
    age: 9,
    salary: 79.7697,
    registered: '2013-06-09T00:19:25.030Z',
  },
  {
    id: 25,
    title: 'Mr',
    name: 'Martin Herrera',
    gender: 'male',
    email: 'martin.herrera@example.com',
    age: 12,
    salary: 59.7223,
    registered: '2010-01-12T05:17:01.500Z',
  },
  {
    id: 26,
    title: 'Mr',
    name: 'Hansjürgen Glock',
    gender: 'male',
    email: 'hansjurgen.glock@example.com',
    age: 7,
    salary: 54.869,
    registered: '2015-09-19T18:19:15.912Z',
  },
  {
    id: 27,
    title: 'Mr',
    name: 'Lewis Vargas',
    gender: 'male',
    email: 'lewis.vargas@example.com',
    age: 9,
    salary: 48.9056,
    registered: '2013-01-05T12:48:31.231Z',
  },
  {
    id: 28,
    title: 'Miss',
    name: 'Auta Pires',
    gender: 'female',
    email: 'auta.pires@example.com',
    age: 11,
    salary: 13.6225,
    registered: '2011-09-24T09:55:16.990Z',
  },
  {
    id: 29,
    title: 'Mrs',
    name: 'Marie Stewart',
    gender: 'female',
    email: 'marie.stewart@example.com',
    age: 4,
    salary: 27.8471,
    registered: '2018-07-01T01:03:25.458Z',
  },
  {
    id: 30,
    title: 'Miss',
    name: 'Asuncion Duran',
    gender: 'female',
    email: 'asuncion.duran@example.com',
    age: 9,
    salary: 19.0301,
    registered: '2013-12-22T07:10:15.461Z',
  },
  {
    id: 31,
    title: 'Mr',
    name: 'Vincent Bell',
    gender: 'male',
    email: 'vincent.bell@example.com',
    age: 16,
    salary: 16.4407,
    registered: '2006-08-04T13:46:21.182Z',
  },
  {
    id: 32,
    title: 'Ms',
    name: 'Lotta Hakala',
    gender: 'female',
    email: 'lotta.hakala@example.com',
    age: 12,
    salary: 46.4459,
    registered: '2010-03-08T16:18:10.107Z',
  },
  {
    id: 33,
    title: 'Mrs',
    name: 'Jessica Wilson',
    gender: 'female',
    email: 'jessica.wilson@example.com',
    age: 8,
    salary: 87.3906,
    registered: '2014-05-05T17:32:31.392Z',
  },
  {
    id: 34,
    title: 'Mrs',
    name: 'Malena Tønnessen',
    gender: 'female',
    email: 'malena.tonnessen@example.com',
    age: 15,
    salary: 52.096,
    registered: '2007-11-22T23:01:00.094Z',
  },
  {
    id: 35,
    title: 'Miss',
    name: 'Alma Johansen',
    gender: 'female',
    email: 'alma.johansen@example.com',
    age: 16,
    salary: 25.8762,
    registered: '2006-03-27T05:16:47.132Z',
  },
  {
    id: 36,
    title: 'Mr',
    name: 'Kasper Oja',
    gender: 'male',
    email: 'kasper.oja@example.com',
    age: 4,
    salary: 62.131,
    registered: '2018-03-01T14:57:54.250Z',
  },
  {
    id: 37,
    title: 'Mr',
    name: 'Etienne Chow',
    gender: 'male',
    email: 'etienne.chow@example.com',
    age: 20,
    salary: 4.6179,
    registered: '2002-06-16T09:31:29.396Z',
  },
  {
    id: 38,
    title: 'Mr',
    name: 'طاها پارسا',
    gender: 'male',
    email: 'th.prs@example.com',
    age: 15,
    salary: 39.5797,
    registered: '2007-03-12T07:55:39.995Z',
  },
  {
    id: 39,
    title: 'Monsieur',
    name: 'Francisco Louis',
    gender: 'male',
    email: 'francisco.louis@example.com',
    age: 3,
    salary: 19.5169,
    registered: '2019-09-25T01:10:55.145Z',
  },
  {
    id: 40,
    title: 'Miss',
    name: 'Minttu Wiitala',
    gender: 'female',
    email: 'minttu.wiitala@example.com',
    age: 13,
    salary: 64.3942,
    registered: '2009-02-22T02:14:08.415Z',
  },
  {
    id: 41,
    title: 'Mr',
    name: 'محمدطاها کامروا',
    gender: 'male',
    email: 'mhmdth.khmrw@example.com',
    age: 17,
    salary: 85.1785,
    registered: '2005-10-17T21:46:58.087Z',
  },
  {
    id: 42,
    title: 'Mr',
    name: 'Iben Engan',
    gender: 'male',
    email: 'iben.engan@example.com',
    age: 10,
    salary: 5.4957,
    registered: '2012-07-25T12:16:37.779Z',
  },
  {
    id: 43,
    title: 'Mrs',
    name: 'Juliette Fortin',
    gender: 'female',
    email: 'juliette.fortin@example.com',
    age: 19,
    salary: 62.3604,
    registered: '2003-04-07T20:55:20.080Z',
  },
  {
    id: 44,
    title: 'Mr',
    name: 'Jared Snyder',
    gender: 'male',
    email: 'jared.snyder@example.com',
    age: 7,
    salary: 79.6144,
    registered: '2015-12-24T09:39:27.181Z',
  },
  {
    id: 45,
    title: 'Ms',
    name: 'Vanessa Bragstad',
    gender: 'female',
    email: 'vanessa.bragstad@example.com',
    age: 17,
    salary: 20.448,
    registered: '2005-05-30T02:42:14.066Z',
  },
  {
    id: 46,
    title: 'Mr',
    name: 'Alvaro Castillo',
    gender: 'male',
    email: 'alvaro.castillo@example.com',
    age: 15,
    salary: 4.0397,
    registered: '2007-11-24T16:08:18.979Z',
  },
  {
    id: 47,
    title: 'Mr',
    name: 'Carter Weaver',
    gender: 'male',
    email: 'carter.weaver@example.com',
    age: 4,
    salary: 77.3023,
    registered: '2018-08-24T18:34:10.853Z',
  },
  {
    id: 48,
    title: 'Miss',
    name: 'Amy Hughes',
    gender: 'female',
    email: 'amy.hughes@example.com',
    age: 18,
    salary: 49.4914,
    registered: '2004-04-29T11:10:58.292Z',
  },
  {
    id: 49,
    title: 'Mrs',
    name: 'Amber Gordon',
    gender: 'female',
    email: 'amber.gordon@example.com',
    age: 3,
    salary: 62.4739,
    registered: '2019-05-17T13:12:39.130Z',
  },
  {
    id: 50,
    title: 'Miss',
    name: 'Samantha Alexander',
    gender: 'female',
    email: 'samantha.alexander@example.com',
    age: 4,
    salary: 54.8563,
    registered: '2018-12-18T17:20:18.782Z',
  },
  {
    id: 51,
    title: 'Ms',
    name: 'Milla Kivi',
    gender: 'female',
    email: 'milla.kivi@example.com',
    age: 9,
    salary: 67.97,
    registered: '2013-11-11T08:07:54.054Z',
  },
  {
    id: 52,
    title: 'Mrs',
    name: 'Ariane Williams',
    gender: 'female',
    email: 'ariane.williams@example.com',
    age: 6,
    salary: 46.2247,
    registered: '2016-07-15T19:04:13.357Z',
  },
  {
    id: 53,
    title: 'Mr',
    name: 'Diether Rüther',
    gender: 'male',
    email: 'diether.ruther@example.com',
    age: 17,
    salary: 74.9874,
    registered: '2005-10-21T18:21:16.300Z',
  },
  {
    id: 54,
    title: 'Mr',
    name: 'Aatu Waisanen',
    gender: 'male',
    email: 'aatu.waisanen@example.com',
    age: 3,
    salary: 1.5358,
    registered: '2019-05-27T01:37:23.243Z',
  },
  {
    id: 55,
    title: 'Monsieur',
    name: 'Jürgen Dumas',
    gender: 'male',
    email: 'jurgen.dumas@example.com',
    age: 20,
    salary: 71.4313,
    registered: '2002-05-02T09:34:17.397Z',
  },
  {
    id: 56,
    title: 'Ms',
    name: 'Phoebe Smith',
    gender: 'female',
    email: 'phoebe.smith@example.com',
    age: 3,
    salary: 33.5953,
    registered: '2019-06-15T12:20:36.704Z',
  },
  {
    id: 57,
    title: 'Mrs',
    name: 'Selma Larsen',
    gender: 'female',
    email: 'selma.larsen@example.com',
    age: 11,
    salary: 69.2807,
    registered: '2011-06-20T15:57:17.155Z',
  },
  {
    id: 58,
    title: 'Ms',
    name: 'Isabella Johnson',
    gender: 'female',
    email: 'isabella.johnson@example.com',
    age: 11,
    salary: 13.9199,
    registered: '2011-03-24T04:20:23.940Z',
  },
  {
    id: 59,
    title: 'Ms',
    name: 'Melike Tunçeri',
    gender: 'female',
    email: 'melike.tunceri@example.com',
    age: 12,
    salary: 22.1256,
    registered: '2010-12-01T17:33:54.918Z',
  },
  {
    id: 60,
    title: 'Mr',
    name: 'Sahel Spekman',
    gender: 'male',
    email: 'sahel.spekman@example.com',
    age: 3,
    salary: 77.42,
    registered: '2019-03-21T11:25:13.256Z',
  },
  {
    id: 61,
    title: 'Mrs',
    name: 'Catherine Rice',
    gender: 'female',
    email: 'catherine.rice@example.com',
    age: 4,
    salary: 5.1927,
    registered: '2018-03-22T14:29:10.536Z',
  },
  {
    id: 62,
    title: 'Mrs',
    name: 'Alicia Johnson',
    gender: 'female',
    email: 'alicia.johnson@example.com',
    age: 6,
    salary: 21.6549,
    registered: '2016-11-29T18:51:25.328Z',
  },
  {
    id: 63,
    title: 'Mr',
    name: 'Angel Cruz',
    gender: 'male',
    email: 'angel.cruz@example.com',
    age: 20,
    salary: 8.618,
    registered: '2002-07-11T07:54:04.202Z',
  },
  {
    id: 64,
    title: 'Ms',
    name: 'Sophie Lemaire',
    gender: 'female',
    email: 'sophie.lemaire@example.com',
    age: 18,
    salary: 86.6886,
    registered: '2004-05-06T18:20:05.339Z',
  },
  {
    id: 65,
    title: 'Miss',
    name: 'Becky Baker',
    gender: 'female',
    email: 'becky.baker@example.com',
    age: 20,
    salary: 8.1712,
    registered: '2002-07-24T00:56:18.355Z',
  },
  {
    id: 66,
    title: 'Mrs',
    name: 'Kristin Rodriguez',
    gender: 'female',
    email: 'kristin.rodriguez@example.com',
    age: 17,
    salary: 68.5662,
    registered: '2005-12-28T21:32:15.312Z',
  },
  {
    id: 67,
    title: 'Mr',
    name: 'Leroy Carpenter',
    gender: 'male',
    email: 'leroy.carpenter@example.com',
    age: 18,
    salary: 22.505,
    registered: '2004-08-02T21:07:56.319Z',
  },
  {
    id: 68,
    title: 'Ms',
    name: 'Sophie Richards',
    gender: 'female',
    email: 'sophie.richards@example.com',
    age: 5,
    salary: 80.9215,
    registered: '2017-10-18T14:10:03.584Z',
  },
  {
    id: 69,
    title: 'Mrs',
    name: 'Jennie Wheeler',
    gender: 'female',
    email: 'jennie.wheeler@example.com',
    age: 9,
    salary: 32.1918,
    registered: '2013-02-13T07:10:16.724Z',
  },
  {
    id: 70,
    title: 'Mr',
    name: 'Felix Sanchez',
    gender: 'male',
    email: 'felix.sanchez@example.com',
    age: 18,
    salary: 74.0723,
    registered: '2004-12-11T18:25:55.490Z',
  },
  {
    id: 71,
    title: 'Mr',
    name: 'Daniel Ambrose',
    gender: 'male',
    email: 'daniel.ambrose@example.com',
    age: 9,
    salary: 42.6366,
    registered: '2013-01-13T02:21:36.554Z',
  },
  {
    id: 72,
    title: 'Mademoiselle',
    name: 'Katia Garnier',
    gender: 'female',
    email: 'katia.garnier@example.com',
    age: 9,
    salary: 56.3817,
    registered: '2013-10-08T01:59:06.405Z',
  },
  {
    id: 73,
    title: 'Mr',
    name: 'Ted Peterson',
    gender: 'male',
    email: 'ted.peterson@example.com',
    age: 7,
    salary: 59.7397,
    registered: '2015-06-18T20:07:01.333Z',
  },
  {
    id: 74,
    title: 'Mr',
    name: 'Vedat Biçer',
    gender: 'male',
    email: 'vedat.bicer@example.com',
    age: 4,
    salary: 75.8018,
    registered: '2018-06-05T14:28:40.170Z',
  },
  {
    id: 75,
    title: 'Mr',
    name: 'Felix Rasmussen',
    gender: 'male',
    email: 'felix.rasmussen@example.com',
    age: 5,
    salary: 41.0358,
    registered: '2017-12-02T11:56:23.744Z',
  },
  {
    id: 76,
    title: 'Mrs',
    name: 'Iina Korpi',
    gender: 'female',
    email: 'iina.korpi@example.com',
    age: 17,
    salary: 38.1905,
    registered: '2005-10-29T07:45:23.014Z',
  },
  {
    id: 77,
    title: 'Mr',
    name: 'Dustin Brooks',
    gender: 'male',
    email: 'dustin.brooks@example.com',
    age: 5,
    salary: 54.5476,
    registered: '2017-01-24T16:43:41.113Z',
  },
  {
    id: 78,
    title: 'Mrs',
    name: 'Lara Husum',
    gender: 'female',
    email: 'lara.husum@example.com',
    age: 17,
    salary: 19.6292,
    registered: '2005-02-25T15:02:47.217Z',
  },
  {
    id: 79,
    title: 'Mrs',
    name: 'Alison Bradley',
    gender: 'female',
    email: 'alison.bradley@example.com',
    age: 6,
    salary: 41.357,
    registered: '2016-03-14T03:07:41.409Z',
  },
  {
    id: 80,
    title: 'Miss',
    name: 'Kari Ursin',
    gender: 'female',
    email: 'kari.ursin@example.com',
    age: 8,
    salary: 32.0221,
    registered: '2014-01-07T01:13:35.914Z',
  },
  {
    id: 81,
    title: 'Miss',
    name: 'Simone Mannes',
    gender: 'female',
    email: 'simone.mannes@example.com',
    age: 15,
    salary: 12.401,
    registered: '2007-02-16T13:05:44.831Z',
  },
  {
    id: 82,
    title: 'Mr',
    name: 'Yasin Yildiz',
    gender: 'male',
    email: 'yasin.yildiz@example.com',
    age: 12,
    salary: 50.2267,
    registered: '2010-06-29T16:34:03.573Z',
  },
  {
    id: 83,
    title: 'Ms',
    name: 'Fatma Kavaklıoğlu',
    gender: 'female',
    email: 'fatma.kavaklioglu@example.com',
    age: 17,
    salary: 83.4913,
    registered: '2005-11-09T04:18:01.901Z',
  },
  {
    id: 84,
    title: 'Miss',
    name: 'Gretchen Kusch',
    gender: 'female',
    email: 'gretchen.kusch@example.com',
    age: 17,
    salary: 23.2745,
    registered: '2005-03-15T01:50:43.754Z',
  },
  {
    id: 85,
    title: 'Miss',
    name: 'Sarah Graves',
    gender: 'female',
    email: 'sarah.graves@example.com',
    age: 20,
    salary: 76.3096,
    registered: '2002-04-27T03:53:03.110Z',
  },
  {
    id: 86,
    title: 'Monsieur',
    name: 'Colin Giraud',
    gender: 'male',
    email: 'colin.giraud@example.com',
    age: 15,
    salary: 80.1164,
    registered: '2007-08-11T18:11:33.874Z',
  },
  {
    id: 87,
    title: 'Mr',
    name: 'Corey Murray',
    gender: 'male',
    email: 'corey.murray@example.com',
    age: 16,
    salary: 28.4909,
    registered: '2006-02-09T06:15:50.829Z',
  },
  {
    id: 88,
    title: 'Mr',
    name: 'Alex Barbier',
    gender: 'male',
    email: 'alex.barbier@example.com',
    age: 11,
    salary: 2.2405,
    registered: '2011-06-24T04:37:27.458Z',
  },
  {
    id: 89,
    title: 'Madame',
    name: 'Simone Bonnet',
    gender: 'female',
    email: 'simone.bonnet@example.com',
    age: 11,
    salary: 37.1596,
    registered: '2011-04-19T02:11:08.552Z',
  },
  {
    id: 90,
    title: 'Mr',
    name: 'August Thomsen',
    gender: 'male',
    email: 'august.thomsen@example.com',
    age: 5,
    salary: 74.8471,
    registered: '2017-11-09T17:44:43.134Z',
  },
  {
    id: 91,
    title: 'Mademoiselle',
    name: 'Samantha Blanchard',
    gender: 'female',
    email: 'samantha.blanchard@example.com',
    age: 12,
    salary: 3.1297,
    registered: '2010-04-26T00:54:35.701Z',
  },
  {
    id: 92,
    title: 'Miss',
    name: 'Aubrey Claire',
    gender: 'female',
    email: 'aubrey.claire@example.com',
    age: 3,
    salary: 14.0074,
    registered: '2019-09-21T00:21:14.461Z',
  },
  {
    id: 93,
    title: 'Ms',
    name: 'Enni Perala',
    gender: 'female',
    email: 'enni.perala@example.com',
    age: 7,
    salary: 10.9083,
    registered: '2015-10-31T18:37:39.433Z',
  },
  {
    id: 94,
    title: 'Mrs',
    name: 'Hailey Baustad',
    gender: 'female',
    email: 'hailey.baustad@example.com',
    age: 10,
    salary: 68.124,
    registered: '2012-06-15T22:08:44.700Z',
  },
  {
    id: 95,
    title: 'Mr',
    name: 'Tristan Dubois',
    gender: 'male',
    email: 'tristan.dubois@example.com',
    age: 12,
    salary: 47.3056,
    registered: '2010-08-09T16:10:06.981Z',
  },
  {
    id: 96,
    title: 'Mr',
    name: 'Bryan Smith',
    gender: 'male',
    email: 'bryan.smith@example.com',
    age: 14,
    salary: 16.089,
    registered: '2008-01-06T12:37:05.680Z',
  },
  {
    id: 97,
    title: 'Ms',
    name: 'Signe Jørgensen',
    gender: 'female',
    email: 'signe.jorgensen@example.com',
    age: 9,
    salary: 89.6213,
    registered: '2013-09-12T15:16:00.989Z',
  },
  {
    id: 98,
    title: 'Mr',
    name: 'Bertram Jørgensen',
    gender: 'male',
    email: 'bertram.jorgensen@example.com',
    age: 13,
    salary: 80.0824,
    registered: '2009-02-07T04:37:40.843Z',
  },
  {
    id: 99,
    title: 'Mrs',
    name: 'Rachel George',
    gender: 'female',
    email: 'rachel.george@example.com',
    age: 17,
    salary: 82.5689,
    registered: '2005-03-01T15:03:08.966Z',
  },
];

const summaryData = [
  {
    name: '[displayedColumns]',
    inOut: 'input',
    type: 'DataTableColumn[]',
    defaultValue: '[]',
    description: 'Mandatory: You must provide the columns to be displayed. Can be updated anytime.',
  },
  {
    name: '[tableData]',
    inOut: 'input',
    type: 'any[]',
    defaultValue: '[]',
    description: 'Mandatory: You must provide data for the table. Can be updated anytime.',
  },
  {
    name: '[page]',
    inOut: 'input',
    type: 'PageEvent',
    syncAsync: 'async',
    description: 'Async usage: Provide pagination data to the table. Can be updated anytime. See example above',
  },
  {
    name: '[filterLabel]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Filter'",
    description: 'Translation: Label for search filter',
  },
  {
    name: '[filterPlaceholder]',
    inOut: 'input',
    type: 'string',
    description: 'Translation: If set, this placeholder text will be displayed in the search field until the user types anything',
  },
  {
    name: '[filterColumnsLabel]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Filter'",
    description: 'Translation: Label for search filter in the column settings modal',
  },
  {
    name: '[filterColumnsPlaceHolder]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Filter available columns'",
    description:
      'Translation: If set, this placeholder text will be displayed in the search field of the columns settings modal until the user types anything',
  },
  {
    name: '[noDataText]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'No matching data found'",
    description: 'Translation: Will be displayed if the table data has zero rows of data',
  },
  {
    name: '[columnSettingsModalTitleLabel]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Column settings'",
    description: 'Translation: Title for column settings modal',
  },
  {
    name: '[selectedLabel]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Selected Columns'",
    description: 'Translation: Title for the box of selected columns in the column settings modal',
  },
  {
    name: '[availableLabel]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Available columns'",
    description: 'Translation: Title for the box of available columns in the column settings modal',
  },
  {
    name: '[infoTextLabel]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Drag and drop a column to select or reorder it.'",
    description: 'Translation: Info text in the column settings modal',
  },
  {
    name: '[saveLabel]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Save'",
    description: 'Translation: Label of the save button in the column settings modal',
  },
  {
    name: '[deleteLabel]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Delete'",
    description: 'Translation: Label of the delete button in the column settings modal (only present if deleteDefinitionAllowed is true)',
  },
  {
    name: '[cancelLabel]',
    inOut: 'input',
    type: 'string',
    defaultValue: "'Cancel'",
    description: 'Translation: Label of the cancel button in the column settings modal',
  },
  {
    name: '[filterEnabled]',
    inOut: 'input',
    type: 'boolean',
    defaultValue: 'false',
    syncAsync: 'sync',
    description: 'Setting: if true, an input for filtering results will be displayed (only possible in synchronous mode)',
  },
  {
    name: '[paginationEnabled]',
    inOut: 'input',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Setting: if true, results will be paged',
  },
  {
    name: '[pageSizeOptions]',
    inOut: 'input',
    type: 'number[]',
    defaultValue: '[5, 10, 15]',
    description: 'Pagination: Options in pageSizeSelection (only if pagination is enabled)',
  },
  {
    name: '[defaultPageSize]',
    inOut: 'input',
    type: 'number',
    description: 'Pagination: initial page size (only if pagination is enabled)',
  },
  {
    name: '[actions]',
    inOut: 'input',
    type: 'DataTableAction[]',
    defaultValue: 'false',
    description: 'Actions: see example above for single/batch mode on how to add row actions to the table',
  },
  {
    name: '[idGenerator]',
    inOut: 'input',
    type: 'any',
    description: 'Function: provide a static function that generates an ID for a row (see example above)',
  },
  {
    name: '(actionEvent)',
    inOut: 'output',
    type: 'DataTableAction',
    description: 'Event: Will be triggered when the user selects an action or clicks on a row (if you use single or batch actions)',
  },
  {
    name: '(sortEvent)',
    inOut: 'output',
    type: 'Sort',
    syncAsync: 'async',
    description: 'Event: Will be triggered when the user sorts a column and [useAsync] is true',
  },
  {
    name: '(pageEvent)',
    inOut: 'output',
    type: 'PageEvent',
    syncAsync: 'async',
    description: 'Event: Will be triggered when the user changes page size or page and [useAsync] is true',
  },
  {
    name: '(allColumnsEvent)',
    inOut: 'output',
    type: 'void',
    description:
      'Event: Will be triggered when the user wants to open the column settings modal and you have not provided [allColumns] yet',
  },
  {
    name: '[allColumns]',
    inOut: 'input',
    type: 'DataTableColumn[]',
    description:
      'Input: List of all available columns for column selection in column settings modal. Modal will only open once this value is provided.',
  },
  {
    name: '(columnDefinitionChangeEvent)',
    inOut: 'output',
    type: 'DataTableColumnDefinitionChange',
    description:
      "Event: Will be triggered saves or deletes a column definition in the column settings modal (use case: cache or store the user's column configuration)",
  },
  {
    name: '(viewDefinitionChangeEvent)',
    inOut: 'output',
    type: 'DataTableColumnDefinition',
    description:
      "Event: Will be triggered when the user selects a different column definition for the table (use-case: cache the user's preference)",
  },
];

export { exampleData, summaryData };