<template>
  <section class="about">
    <div class="about__info">
      <h1 class="about__title">{{ $t('about.title') }}</h1>

      <p>{{ $t('about.p1') }}</p>
      <p>{{ $t('about.p2') }}</p>
      <p>{{ $t('about.p3') }}</p>
    </div>

    <figure class="about__image">
      <img src="/assets/img/girl.png" alt="girl listening to music" />
    </figure>
  </section>
</template>

<script>
export default {
  name: 'About',
};
</script>
