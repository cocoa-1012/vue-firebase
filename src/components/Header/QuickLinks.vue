<template>
  <div>
    <!-- <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          large
          class="mx-2 quick-link v-step-1"
          v-bind="attrs"
          v-on="on"
        >
          <i
            class="zmdi grey--text zmdi-hc-fw font-lg zmdi-circle"
            alt="Dashbaord"
          ></i>
        </v-btn>
      </template>
      <span>Home</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          large
          class="mx-2 quick-link v-step-1"
          v-bind="attrs"
          v-on="on"
        >
          <i class="zmdi grey--text zmdi-hc-fw font-lg zmdi-view-dashboard"></i>
        </v-btn>
      </template>
      <span>Dashboard</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          large
          class="mx-2 quick-link v-step-1"
          v-bind="attrs"
          v-on="on"
          @click="sidebarPath('/')"
        >
          <i
            class="zmdi grey--text zmdi-hc-fw font-lg zmdi-square-o"
            alt="Dashbaord"
          ></i>
        </v-btn>
      </template>
      <span>Procedures</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          large
          class="mx-2 quick-link v-step-1"
          v-bind="attrs"
          v-on="on"
          @click="sidebarPath('/')"
        >
          <i
            class="zmdi grey--text zmdi-hc-fw font-lg zmdi-collection-item"
            alt="Dashbaord"
          ></i>
        </v-btn>
      </template>
      <span>Collections</span>
    </v-tooltip>
 
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          large
          class="mx-2 quick-link v-step-1"
          v-bind="attrs"
          v-on="on"
        >
          <i
            class="zmdi grey--text zmdi-hc-fw font-lg zmdi-search"
            alt="Dashbaord"
          ></i>
        </v-btn>
      </template>
      <span>Search</span>
    </v-tooltip>   -->
    <v-menu
      offset-y
      origin="left top"
      transition="slide-y-transition"
      content-class="quciklink-dropdown"
      right
      nudge-top="-10"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" class="mx-2 quick-link v-step-1" elevation="0">
          <v-icon small color="grey"> mdi-format-list-numbers</v-icon>
          <v-icon x-small color="grey" class="ml-n3"> mdi-chevron-down </v-icon>
        </v-btn>
      </template>

      <div class="dropdown-content">
        <div class="dropdown-top d-custom-flex justify-space-between primary">
          <span class="white--text fw-bold">Categories</span>
        </div>
        <v-list class="dropdown-list" style="overflow-y: auto">
          <v-list-item v-for="cat in categories" :key="cat.name" class="col-12">
            <i class="mr-3"> <v-icon>zmdi-apps </v-icon></i>
            <span>{{ cat.name }}</span>
          </v-list-item>

          <!--
          <v-list-item
            v-for="link in links"
            :key="link.title"
            @click="sidebarPath(link.to)"
          >
            <i class="mr-3" :class="link.icon"></i>
            <span>{{ $t(link.title) }}</span>
          </v-list-item> -->
        </v-list>
      </div>
    </v-menu>
  </div>
</template>

<script>
import { getCurrentAppLayout } from "Helpers/helpers";
export default {
  props: ["categories"],
  data() {
    return {
      links: [
        {
          title: "message.gallery",
          to: "/pages/gallery",
          icon: "ti-gallery primary--text",
        },
        {
          title: "message.tables",
          to: "/tables/searchwithtext",
          icon: "ti-layout error--text",
        },
        {
          title: "message.inbox",
          to: "/inbox",
          icon: "ti-email success--text",
        },
        {
          title: "message.calendar",
          to: "/calendar",
          icon: "ti-calendar info--text",
        },
        {
          title: "message.chat",
          to: "/chat",
          icon: "ti-comments error--text",
        },
        {
          title: "message.userProfile",
          to: "/users/user-profile",
          icon: "ti-user warning--text",
        },
      ],
    };
  },
  methods: {
    sidebarPath(link) {
      this.$store.dispatch("setActiveMenuGroup", { pathURL: link });
      this.$router.push(this.getMenuLink(link));
    },
    getMenuLink(link) {
      return "/" + getCurrentAppLayout(this.$router) + link;
    },
  },
};
</script>