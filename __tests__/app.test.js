require('dotenv').config();

const { formatLocation, mungeWeather, mungeYelpReviews } = require('../lib/mungeFile.js');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const request = require('superagent');

describe('app routes', () => {
  describe('routes', () => {

    test('returns locations that have been munged', async() => {
      const expected = {
        'formatted_query': 'Oakland, Alameda County, California, USA',
        'latitude': '37.8044557',
        'longitude': '-122.2713563'
      };

      const locations =  [
        {
          'place_id': '236402977',
          'licence': 'https://locationiq.com/attribution',
          'osm_type': 'relation',
          'osm_id': '2833530',
          'boundingbox': [
            '37.6336763',
            '37.8854257',
            '-122.355881',
            '-122.1144203'
          ],
          'lat': '37.8044557',
          'lon': '-122.2713563',
          'display_name': 'Oakland, Alameda County, California, USA',
          'class': 'place',
          'type': 'city',
          'importance': 0.731796254253183,
          'icon': 'https://locationiq.org/static/images/mapicons/poi_place_city.p.20.png'
        }];

      const actual = formatLocation(locations);
      expect(actual).toEqual(expected);
    });

    test('returns weather that has been munged', async() => {
      const weatherData = {
        'data': [
          {
            'moonrise_ts': 1614566520,
            'wind_cdir': 'ESE',
            'rh': 56,
            'pres': 1021.38,
            'high_temp': 18.9,
            'sunset_ts': 1614564188,
            'ozone': 339.438,
            'moon_phase': 0.925443,
            'wind_gust_spd': 10.0938,
            'snow_depth': 0,
            'clouds': 0,
            'ts': 1614499260,
            'sunrise_ts': 1614523334,
            'app_min_temp': 8.2,
            'wind_spd': 2.00507,
            'pop': 0,
            'wind_cdir_full': 'east-southeast',
            'slp': 1021.46,
            'moon_phase_lunation': 0.58,
            'valid_date': '2021-02-28',
            'app_max_temp': 17.7,
            'vis': 24.096,
            'dewpt': 2.2,
            'snow': 0,
            'uv': 5.23371,
            'weather': {
              'icon': 'c01d',
              'code': 800,
              'description': 'Clear Sky'
            },
            'wind_dir': 123,
            'max_dhi': null,
            'clouds_hi': 0,
            'precip': 0,
            'low_temp': 8.2,
            'max_temp': 18.9,
            'moonset_ts': 1614529310,
            'datetime': '2021-02-28',
            'temp': 11.8,
            'min_temp': 8.2,
            'clouds_mid': 0,
            'clouds_low': 0
          },
          {
            'moonrise_ts': 1614657206,
            'wind_cdir': 'S',
            'rh': 49,
            'pres': 1020.5,
            'high_temp': 18,
            'sunset_ts': 1614650649,
            'ozone': 326.802,
            'moon_phase': 0.851509,
            'wind_gust_spd': 4.79688,
            'snow_depth': 0,
            'clouds': 8,
            'ts': 1614585660,
            'sunrise_ts': 1614609650,
            'app_min_temp': 9.6,
            'wind_spd': 1.39052,
            'pop': 0,
            'wind_cdir_full': 'south',
            'slp': 1020.56,
            'moon_phase_lunation': 0.61,
            'valid_date': '2021-03-01',
            'app_max_temp': 18,
            'vis': 24.096,
            'dewpt': 2.1,
            'snow': 0,
            'uv': 5.17615,
            'weather': {
              'icon': 'c02d',
              'code': 801,
              'description': 'Few clouds'
            },
            'wind_dir': 180,
            'max_dhi': null,
            'clouds_hi': 4,
            'precip': 0,
            'low_temp': 8.6,
            'max_temp': 18,
            'moonset_ts': 1614617544,
            'datetime': '2021-03-01',
            'temp': 13.3,
            'min_temp': 9.5,
            'clouds_mid': 0,
            'clouds_low': 4
          }
        ],
        'city_name': 'Oakland',
        'lon': -122.27,
        'timezone': 'America/Los_Angeles',
        'lat': 37.8,
        'country_code': 'US',
        'state_code': 'CA'
      };
      
      const expectation = [
        {
          'forecast': 'Clear Sky',
          'time': 'Sun Feb 28 2021'
        },
        {
          'forecast': 'Few clouds',
          'time': 'Mon Mar 01 2021'
        }
      ];

      const actual = mungeWeather(weatherData);
      expect(actual).toEqual(expectation);

    });

    test('returns reviews that have been munged', async() => {
      const reviewData = {
        'businesses': [
          {
            'id': 'DceTpSF9RJ9PBvfX-_EImQ',
            'alias': 'shandong-restaurant-oakland',
            'name': 'Shandong Restaurant',
            'image_url': 'https://s3-media2.fl.yelpcdn.com/bphoto/Suj414J80yiiAcAhbPBPcA/o.jpg',
            'is_closed': false,
            'url': 'https://www.yelp.com/biz/shandong-restaurant-oakland?adjust_creative=VqCGl3K7f8vk-D5glMVyaQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=VqCGl3K7f8vk-D5glMVyaQ',
            'review_count': 3090,
            'categories': [
              {
                'alias': 'chinese',
                'title': 'Chinese'
              },
              {
                'alias': 'seafood',
                'title': 'Seafood'
              },
              {
                'alias': 'noodles',
                'title': 'Noodles'
              }
            ],
            'rating': 4.0,
            'coordinates': {
              'latitude': 37.800607171031,
              'longitude': -122.26986193448
            },
            'transactions': [
              'pickup',
              'delivery'
            ],
            'price': '$$',
            'location': {
              'address1': '328 10th St',
              'address2': 'Ste 101',
              'address3': '',
              'city': 'Oakland',
              'zip_code': '94607',
              'country': 'US',
              'state': 'CA',
              'display_address': [
                '328 10th St',
                'Ste 101',
                'Oakland, CA 94607'
              ]
            },
            'phone': '+15108392299',
            'display_phone': '(510) 839-2299',
            'distance': 447.62395875789565
          },
          {
            'id': '6iT-NihtnFnDh8JOYxRvDQ',
            'alias': 'belly-oakland-2',
            'name': 'Belly',
            'image_url': 'https://s3-media2.fl.yelpcdn.com/bphoto/4bdBl5wXfumHd5K4nrIlQw/o.jpg',
            'is_closed': false,
            'url': 'https://www.yelp.com/biz/belly-oakland-2?adjust_creative=VqCGl3K7f8vk-D5glMVyaQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=VqCGl3K7f8vk-D5glMVyaQ',
            'review_count': 1724,
            'categories': [
              {
                'alias': 'burgers',
                'title': 'Burgers'
              },
              {
                'alias': 'mexican',
                'title': 'Mexican'
              },
              {
                'alias': 'asianfusion',
                'title': 'Asian Fusion'
              }
            ],
            'rating': 4.0,
            'coordinates': {
              'latitude': 37.80918,
              'longitude': -122.27319
            },
            'transactions': [
              'delivery'
            ],
            'price': '$$',
            'location': {
              'address1': '1901 San Pablo Ave',
              'address2': '',
              'address3': '',
              'city': 'Oakland',
              'zip_code': '94612',
              'country': 'US',
              'state': 'CA',
              'display_address': [
                '1901 San Pablo Ave',
                'Oakland, CA 94612'
              ]
            },
            'phone': '+15108390000',
            'display_phone': '(510) 839-0000',
            'distance': 543.0842164070825
          }],
        'total': 2,
        'region': {
          'center': {
            'longitude': -122.2713563,
            'latitude': 37.8044557
          }
        }
      };

      const expected = [
        {
          'name': 'Shandong Restaurant',
          'price': '$$',
          'image': 'https://s3-media2.fl.yelpcdn.com/bphoto/Suj414J80yiiAcAhbPBPcA/o.jpg',
          'rating': 4,
          'url': 'https://www.yelp.com/biz/shandong-restaurant-oakland?adjust_creative=VqCGl3K7f8vk-D5glMVyaQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=VqCGl3K7f8vk-D5glMVyaQ'
        },
        {
          'name': 'Belly',
          'price': '$$',
          'image': 'https://s3-media2.fl.yelpcdn.com/bphoto/4bdBl5wXfumHd5K4nrIlQw/o.jpg',
          'rating': 4,
          'url': 'https://www.yelp.com/biz/belly-oakland-2?adjust_creative=VqCGl3K7f8vk-D5glMVyaQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=VqCGl3K7f8vk-D5glMVyaQ'
        }
      ];

      const actual = mungeYelpReviews(reviewData);
      expect(actual).toEqual(expected);

    });
  });
});
