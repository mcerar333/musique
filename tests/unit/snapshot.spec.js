import { shallowMount, RouterLinkStub } from '@vue/test-utils';

import SongItem from '@/components/SongItem.vue';
import Svg from '@/directives/svg';

import NotFound from '@/views/NotFound.vue';
import BaseLottie from '@/components/BaseLottie.vue';
import * as animationData from '@/assets/lottie/error.json';

import About from '@/views/About.vue';

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

jest.mock('lottie-web', () => ({
  loadAnimation: () => true,
}));

describe('Snapshots BaseLottie.vue', () => {
  test('component renders correctly', () => {
    const wrapper = shallowMount(BaseLottie, {
      props: {
        options: { animationData },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});

describe('Snapshots NotFound.vue', () => {
  test('component renders correctly', () => {
    const wrapper = shallowMount(NotFound, {
      components: { BaseLottie },

      data() {
        return {
          lottieOptions: { animationData },
        };
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});

describe('Snapshots About.vue', () => {
  test('component renders correctly', () => {
    const wrapper = shallowMount(About, {
      global: {
        mocks: {
          $t: msg => msg,
        },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
