import { shallowMount } from '@vue/test-utils';

import Home from '@/views/Home.vue';
import SongItem from '@/components/SongItem.vue';

jest.mock('@/includes/firebase', () => {});

describe('Home.vue', () => {
  test('renders a list of songs', () => {
    const songs = [{}, {}, {}];

    Home.methods.initialFetch = () => false;

    const component = shallowMount(Home, {
      data() {
        return {
          songs,
        };
      },
      global: {
        directives: {
          svg: {},
        },
        mocks: {
          $t: msg => msg,
        },
      },
    });

    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);

    items.forEach((item, i) => {
      expect(item.props().song).toStrictEqual(songs[i]);
    });
  });
});
