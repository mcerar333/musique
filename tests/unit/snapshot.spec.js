import { shallowMount, RouterLinkStub } from '@vue/test-utils';

import SongItem from '@/components/SongItem.vue';
import Svg from '@/directives/svg';

describe('Snapshots SongItem.vue', () => {
  test('component renders correctly', () => {
    const song = {
      docID: '123abc',
      displayName: 'Bobby Brown',
      modifiedName: 'Stairway to Heaven',
      commentCount: 15,
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
          Svg,
        },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
