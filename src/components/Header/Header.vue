<!-- Header Structure 

//TODO #19 alterar cor de fundo do header.
-->
<template>
  <div>
    <v-navigation-drawer
      v-if="!horizontal"
      app
      fixed
      v-model="drawer"
      :mini-variant.sync="sidebarState"
      mini-variant-width="70"
      :width="250"
      class="Vuely-sidebar"
      :style="{ backgroundImage: 'url(' + selectedSidebarBgImage.url + ')' }"
      :class="{ 'background-none': !backgroundImage }"
      :right="rtlLayout"
    >
      <!-- App Sidebar -->
      <app-sidebar></app-sidebar>
    </v-navigation-drawer>

    <v-app-bar
      clipped-left
      class="Vuely-toolbar"
      app
      :color="activeHeaderFilter.class"
      fixed
      outlined
      elevation="0"
      thin
    >
      <div class="d-custom-flex align-items-center navbar-left">
        <div v-if="!horizontal">
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
            class="v-step-0"
          ></v-app-bar-nav-icon>
        </div>
        <div
          class="site-logo-wrap d-custom-flex ml-0 align-items-center"
          v-else
        >
          <router-link to="/" class="site-logo-img">
            <v-avatar color="white" size="36">
              <img
                src="/static/img/proceed-icon-black.svg"
                alt="site logo"
                class="pa-2"
                height="10"
              />
            </v-avatar>
          </router-link>
        </div>
        <quick-links :categories="this.getProcCategories"></quick-links>

        <v-text-field
          text
          solo
          prepend-icon="search"
          :placeholder="$t('message.search')"
          style="background-color: #f4f4f4"
          class="search-bar"
          width="450"
        ></v-text-field>
        <div class="mobile-search d-none" style="flex-grow: 1">
          <v-btn
            text
            icon
            small
            class="mobile-search-btn"
            @click="toggleSearchForm"
          >
            <v-icon class="font-md">search</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="navbar-right">
        <v-btn
          class="ma-1"
          color="primary"
          @click="this.goToCreateNewProcedure"
          elevation="0"
        >
          CREATE
        </v-btn>
        <!--    <v-btn
          class="v-step-2 mr-2 upgrade-btn"
          color="secondary"
          elevation="0"
          tag="link"
          @click="sidebarPath('/pages/pricing-1')"
          >Learn More</v-btn
        >
        <v-btn
          class="v-step-2 mr-2 upgrade-btn"
          elevation="0"
          color="secondary"
          tag="link"
          @click="sidebarPath('/pages/pricing-1')"
          >Get started</v-btn
        > -->

        <!--
        <v-menu open-on-hover bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon large v-bind="attrs" v-on="on" class="full-screen ma-0">
              <v-icon color="grey">mdi-plus</v-icon>
            </v-btn>
          </template>

          <div class="mt-2">
            <v-list>
              <v-list-item
                v-for="link in links"
                :key="link.title"
                @click="sidebarPath(link.to)"
                class="dropdown-top d-custom-flex justify-space-between darken"
              >
                <span>
                  <v-icon color="grey">mdi-plus</v-icon>
                  {{ $t(link.title) }}</span
                >
              </v-list-item>
            </v-list>
          </div>
        </v-menu> -->

        <v-btn icon large @click="toggleFullScreen" class="full-screen ma-0">
          <v-icon color="grey">fullscreen</v-icon>
        </v-btn>
        <!-- <v-btn class="ma-0" icon large @click.stop="chatSidebar = !chatSidebar">
					<v-icon color="grey">forum</v-icon>
				</v-btn> 
        <notifications></notifications>-->
        <!-- <cart :horizontal="horizontal"></cart> -->
        <language-provider></language-provider>
        <user></user>
      </div>
    </v-app-bar>
    <!-- Chat Searchbar -->
    <v-navigation-drawer
      fixed
      v-model="chatSidebar"
      :right="!rtlLayout"
      temporary
      app
      class="chat-sidebar-wrap"
      :width="300"
    >
      <chat-sidebar></chat-sidebar>
    </v-navigation-drawer>
    <mobile-search-form></mobile-search-form>
  </div>
</template>

<script>
import Sidebar from "../Sidebar/Sidebar.vue";
import ChatSidebar from "../ChatSidebar/ChatSidebar.vue";
import screenfull from "screenfull";
import LanguageProvider from "./LanguageProvider";
//import Notifications from "./Notifications";
import User from "./User";
//import Cart from "./Cart";
import QuickLinks from "./QuickLinks";
import MobileSearchForm from "./MobileSearchForm";
import { getCurrentAppLayout } from "Helpers/helpers";
import { mapGetters } from "vuex";

export default {
  props: {
    horizontal: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      category: null,
      links: [
        { icon: "mdi-plus", title: "Add Collection", to: "" },
        { icon: "mdi-plus", title: "Add Procedure", to: "/procedures/new" },
      ],
      collapsed: false, // collapse sidebar
      drawer: null, // sidebar drawer default true
      chatSidebar: false, // chat component right sidebar
      sidebarImages: "", // sidebar background images
      enableDefaultSidebar: false,
    };
  },
  computed: {
    ...mapGetters([
      "rtlLayout",
      "backgroundImage",
      "backgroundImage",
      "selectedSidebarBgImage",
      "collapseSidebar",
      "activeHeaderFilter",
      "getProcCategories",
    ]),
    sidebarState: {
      get: function () {
        return this.collapseSidebar;
      },
      set: function () {
        return this.collapseSidebar;
      },
    },
  },
  methods: {
    goToCreateNewProcedure() {
      this.$router.push("/procedures/new");
    },
    // toggle full screen method
    toggleFullScreen() {
      if (screenfull.enabled) {
        screenfull.toggle();
      }
    },
    sidebarPath(link) {
      this.$store.dispatch("setActiveMenuGroup", { pathURL: link });
      this.$router.push(this.getMenuLink(link));
    },
    getMenuLink(link) {
      return "/" + getCurrentAppLayout(this.$router) + link;
    },
    toggleSearchForm() {
      this.$store.dispatch("toggleSearchForm");
    },
  },
  components: {
    appSidebar: Sidebar,
    ChatSidebar,
    LanguageProvider,
    // Notifications,
    //Cart,
    QuickLinks,
    MobileSearchForm,
    User,
  },
};
</script>

<style scoped>
.filter-green {
  filter: invert(86%) sepia(9%) saturate(952%) hue-rotate(73deg) brightness(94%)
    contrast(87%);
}
.filter-white {
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(188deg)
    brightness(102%) contrast(105%);
}

.theme--light.v-app-bar.v-toolbar.v-sheet {
  background-color: #fff !important;
}

.no-border:before {
  border-style: none !important;
}
.no-border:after {
  border-style: none !important;
}
</style>