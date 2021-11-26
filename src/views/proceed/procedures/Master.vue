<template>
  <div>
    <page-title-bar></page-title-bar>

    <v-container fluid class="grid-list-xl pt-0">
      <v-row :v-model="this.selectedTab">
        <app-card colClasses="col-12 " customClasses="mb-0">
          <v-tabs>
            <v-tab :to="{ name: 'ProceedIdentify' }"
              ><v-icon class="mr-2">mdi-clipboard-text</v-icon>Identify</v-tab
            >
            <v-tab
              :to="{ name: 'ProceedProcess' }"
              :disabled="this.flagNewProcedure"
            >
              <v-icon class="mr-2">mdi-source-commit</v-icon>Activities</v-tab
            >
            <!--  <v-tab to="Attachments" :disabled="this.flagNewProcedure" v-key="process"
              ><v-icon class="mr-2">mdi-attachment</v-icon>Attachments</v-tab
            > -->
            <!-- 
              //TODO #13 Versão pró versionamento das alterações 
              -->
            <!--  <v-tab to="Access"
              ><v-icon class="mr-2">mdi-account-edit</v-icon>Access</v-tab
            > -->
          </v-tabs>
        </app-card>
      </v-row>
      <router-view :key="$route.path"></router-view>
    </v-container>
  </div>
</template>

<script>
import { dbProcCollectionsRef, dbProcCategoriesRef } from "@/firebase";
//TODO Importar componentes identity e Process
import { mapGetters } from "vuex";

export default {
  name: "ProceduresNew",
  data() {
    return {
      selectedTab: "identify",
      flagNewProcedure: false,
      username: "",
      slug: "",
      dropzoneOptions: {
        maxFiles: 1,
        url: "https://httpbin.org/post",
        maxFilesize: 0.5,
        chunking: true,
        chunkSize: 500, // Bytes
        thumbnailWidth: 150, // px
        thumbnailHeight: 150,
        addRemoveLinks: true,
        headers: { "My-Awesome-Header": "header value" },
        events: [],
        input: null,
        nonce: 0,
      },

      menuData: null,
      visible: false,
      valid: false,
      //TODO #1 Cadastro de Categorias de Procedimentos
      // procedureForm,
      items: [],
      search: "",
    };
  },
  watch: {
    "$route.path": function () {
      console.log('this.$route.params', this.$route.params);
      if (
        this.$route.path == "/procedures/new" ||
        this.$route.path == "/procedures/new#identify"
      ) {
        this.flagNewProcedure = true;
        this.$store.dispatch("setProcProcedureRefWhere", {});
      } else {
        this.flagNewProcedure = false;
        this.$store.dispatch("setProcProcedureRefWhere", {slug: this.$route.params.slug});
      }
    },
  },
  created() {
    //TODO #20 buscar procedure que tiver o username do ownser e o slug igual ao da url
    this.$store.dispatch("setProcCollectionsRef", dbProcCollectionsRef);
    this.$store.dispatch("setProcCategoriesRef", dbProcCategoriesRef);
    console.log("testfgfgfgf", this.$route.path);

    //testa o nome do usuário
    if (typeof this.$route.params.username != "undefined") {
      this.username = this.$route.params.username;
    } else {
      this.username = "";
    }

    if (typeof this.$route.params.slug != "undefined") {
      this.slug = this.$route.params.slug;

      var payload = {};
      if (this.username != "" && this.slug != "") {
        payload = {
          slug: this.slug,
          username: this.username,
        };
      } else if (this.slug != "") {
        payload = {
          slug: this.slug,
        };
      }
      this.$store.dispatch("setProcProcedureRefWhere", payload);
    }
  },
  mounted() {
    console.log("test-----", this.$route.path);
    if (
      this.$route.path == "/procedures/new" ||
      this.$route.path == "/procedures/new#identify"
    ) {
      this.flagNewProcedure = true;
    } else {
      this.flagNewProcedure = false;
    }
  },
  computed: {
    ...mapGetters([
      "getProcProcedures",
      "getProcCollections",
      "getProcCategories",
      "getProcProceduresPhases",
    ]),
    timeline() {
      return this.events;
    },
  },
};
</script>


