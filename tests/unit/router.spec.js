import { shallowMount, RouterLinkStub } from '@vue/test-utils';

import SongItem from '@/components/SongItem.vue';

describe('Vue Router', () => {
  test('renders router link', () => {
    const song = {
      docID: '123abc',
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
          svg: {},
        },
      },
    });

    expect(
      wrapper.findComponent({ name: 'router-link' }).props().to
    ).toStrictEqual({
      name: 'Song',
      params: { id: song.docID },
    });
  });
});
