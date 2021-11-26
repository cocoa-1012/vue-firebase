<template>
  <v-menu
    offset-y
    origin="right top"
    left
    content-class="language-dropdown"
    transition="slide-y-transition"
    nudge-top="-10"
  >
    <template v-slot:activator="{ on }">
      <v-btn small v-on="on" class="v-step-3 white" elevation="0">
        <v-icon color="grey"> mdi-translate </v-icon>
        <v-icon x-small color="grey"> mdi-chevron-down </v-icon>
      </v-btn>
    </template>
    <div class="dropdown-content">
      <div class="dropdown-top d-custom-flex justify-space-between primary">
        <span class="white--text fw-bold">Languages</span>
      </div>
      <v-list class="dropdown-list">
        <v-list-item
          v-for="language in languages"
          :key="language.name"
          @click="changeLanguage(language)"
        >
          <img
            class="img-responsive mr-3"
            :src="`/static/flag-icons/${language.icon}.png`"
          />
          <span>{{ language.name }}</span>
        </v-list-item>
      </v-list>
    </div>
  </v-menu>
</template>

<script>
//:src="`/static/flag-icons/${selectedLocale.icon}.png`"
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["selectedLocale", "languages"]),
  },
  methods: {
    changeLanguage(language) {
      this.$i18n.locale = language.locale;
      this.$store.dispatch("changeLanguage", language);
    },
  },
};
</script>
