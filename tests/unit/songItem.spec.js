import { shallowMount, RouterLinkStub } from '@vue/test-utils';

import SongItem from '@/components/SongItem.vue';
import Svg from '@/directives/svg';

describe('SongItem.vue', () => {
  test('render song.displayName', () => {
    const song = {
      displayName: 'Bobby Brown',
    };

    const wrapper = shallowMount(SongItem, {
      props: {
        song,
      },
      global: {
        components: {
          'router-link': RouterLinkStub,
        },
        directives: {
          svg: Svg,
        },
      },
    });

    const songAuthor = wrapper.find('.song__info > p');

    expect(songAuthor.text()).toBe(song.displayName);
  });
});
