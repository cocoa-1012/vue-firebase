<template>
  <v-container class="w-100">
    <v-row>
      <v-col
        cols="12"
        sm="3"
        xs="3"
        md="6"
        v-for="(icon, key) in itemsMenu"
        :key="key"
      >
        <v-hover v-slot="{ hover }" close-delay="200">
          <v-card
            :elevation="hover ? 16 : 2"
            :class="{ 'on-hover': hover }"
            class="mx-auto menu-card"
            v-on:click="icon.method"
          >
            <v-card-text class="font-weight-medium my-2 text-center subtitle-1">
              <p v-if="icon.secondicon != 'none'">
                <v-badge
                  bordered
                  color="primary"
                  :icon="icon.secondicon"
                  overlap
                >
                  <v-icon large color="primary">
                    {{ icon.icon }}
                  </v-icon>
                </v-badge>
              </p>
              <p v-else>
                <v-icon large color="primary">
                  {{ icon.icon }}
                </v-icon>
              </p>
              <span color="light">{{ icon.title }}</span>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
      <v-col>
        <template>
          <v-dialog v-model="open" max-width="600">
            <v-card class="pa-6">
              <v-text-field label="Name" required></v-text-field>
              <v-text-field label="Email" required></v-text-field>
              <v-text-field label="Phone Number" required></v-text-field>
              <v-text-field label="Location" required></v-text-field>

              <v-card-actions class="pa-0">
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="open = false">Cancel</v-btn>
                <v-btn color="error">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-col>
    </v-row>
    <v-row> </v-row>
    <!-- Chat Searchbar -->
    <v-navigation-drawer
      v-model="dialog"
      temporary
      app
      :right="true"
      class="chat-sidebar-wrap"
    >
      <div v-if="showPhaseDialog">
        <dialog-phase></dialog-phase>
      </div>
      <div v-else-if="showActionDialog">
        <dialog-action :action="this.action"></dialog-action>
      </div>
    </v-navigation-drawer>

    <div v-if="dialogFull">
      <v-dialog
        v-model="showPlayDialog"
        fullscreen
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile class="mx-auto my-auto">
          <div v-if="showPlayDialog">
            <dialog-play :procedure="this.procedure"></dialog-play>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>


<script>
import dialogPhase from "@/views/proceed/procedures/dialogs/Phase";
import dialogAction from "@/views/proceed/procedures/dialogs/Action";
import dialogPlay from "@/views/proceed/procedures/dialogs/Play";
import { Bus } from "@/utils/bus";

export default {
  name: "cardProcedure",
  components: {
    dialogPhase,
    dialogAction,
    dialogPlay,
  },
  props: {
    procedure: Object,
  },
  data() {
    return {
      showPlayDialog: false,
      showPhaseDialog: false,
      showActionDialog: false,
      action: Object,
      phase: Object,
      open: false,
      dialogFull: false,
      dialog: false,
      itemsMenu: [
        {
          title: "Actions",
          icon: "mdi-source-commit",
          secondicon: "mdi-plus",
          color: "",
          route: "Actions",
          method: this.showAction,
        },
        {
          title: "Phases",
          icon: "mdi-clipboard-list-outline",
          secondicon: "mdi-plus",
          color: "",
          route: "Phases",
          method: this.showPhase,
        },
        /* {
          title: "Settings",
          icon: "mdi-settings",
          secondicon: "none",
          color: "",
          route: "Settings",
          method: this.showSetting,
        },*/
        //TODO #6 Fazer levantamento de requisitos da Tela de Banco de dados de imagem, no menu de procedimentos/atividades.
        /* {
          title: "Words Database",
          icon: "mdi-database",
          secondicon: "mdi-magnify",
          color: "",
          route: "Words",
        }, */
        /* {
          title: "Actors",
          icon: "mdi-account-multiple",
          secondicon: "mdi-magnify",
          color: "",
          route: "Actors",
          method: this.showActor,
        }, */
        //TODO #7 Levantar requisitos para modelo de estrutura de documento txt para importação no sistema.
        /* {
          title: "Data Import",
          icon: "mdi-upload",
          secondicon: "none",
          color: "",
          route: "Import",
          method: this.showDataImport,
        }, 
        {
          title: "Play",
          icon: "mdi-play-box-outline",
          secondicon: "none",
          color: "",
          route: "Play",
          method: this.showPlay,
        },*/
      ],
    };
  },
  created() {
    Bus.$on("show-phase", () => {
      this.setShowFalse();
      this.dialog = true;
      this.showPhaseDialog = true;
    });

    Bus.$on("show-play", () => {
      this.setShowFalse();
      this.dialogFull = true;
      this.showPlayDialog = true;
    });

    Bus.$on("close-dialog", () => {
      this.dialog = false;
      this.dialogFull = false;
      this.$emit("close");
    });

    Bus.$on("show-action", (action) => {
      if (typeof action != undefined) {
        //console.log(action);
        this.action = action;
      }
      this.setShowFalse();
      this.dialog = true;
      this.showActionDialog = true;
    });
  },
  computed: {
    itemsMenuAction() {
      let procedureId = this.procedure.id;
      return this.itemsMenu.map(function (item) {
        return {
          id: item.id,
          name: item.name,
          icon: item.icon,
          color: item.color,
          route: item.route,
          procedure_id: procedureId,
        };
      });
    },
  },
  methods: {
    setShowFalse() {
      this.dialog = false;
      this.dialogFull = false;
      this.showActionDialog = false;
      this.showPhaseDialog = false;
    },
    showPhase() {
      Bus.$emit("show-phase");
    },
    showAction() {
      Bus.$emit("show-action", {
        id: "",
        name: "",
        phase: "DEFAULT",
        formulary: "",
      });
    },
    showSetting() {
      Bus.$emit("show-phase");
    },
    showActor() {
      Bus.$emit("show-phase");
    },
    showDataImport() {
      Bus.$emit("show-phase");
    },
    showPlay() {
      Bus.$emit("show-play");
    },
    openDialog() {
      this.open = true;
    },
    close() {
      this.open = false;
    },
  },
};
</script>

<style lang="sass" scoped>
.v-card.on-hover.theme--dark
  background-color: rgba(#FFF, 0.8)
  >.v-card__text
    color: #000
</style>

<style scoped>
.menu-card {
  cursor: pointer;
}

@media screen and (max-device-width: 480px) {
  .chat-sidebar-wrap {
    width: 100% !important;
  }
}

@media screen and (min-width: 481px) {
  .chat-sidebar-wrap {
    width: 30% !important;
  }
}
</style>