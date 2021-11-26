<template>
  <div>
    <v-row>
      <app-card
        colClasses="col-xl-8 col-lg-8 col-md-7 col-sm-12 col-12 "
        customClasses="mb-0"
      >
        <div
          class="d-flex justify-space-between align-items-center pa-6 project-grid-title"
        >
          <div class="title">
            <h3 class="mb-0">Descriptions</h3>
          </div>
        </div>
        <!-- //TODO #4 Criar componente para sempre que usuário escrever "@" aparece um auto-complete com os atores, o caracter "@" identificará que é um ator. -->
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-text-field
            label="Name"
            v-model="procedure.name"
            counter="50"
            required
          ></v-text-field>

          <!--
            <v-textarea
              label="Description"
              v-model="procedure.description"
            ></v-textarea>
-->
          <quill-editor
            label="Description"
            v-model="procedure.description"
            ref="myQuillEditor"
          >
            <!--  @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)" -->
          </quill-editor>

          <v-row cols="12">
            <v-col sm="6">
              <v-select
                type="text"
                v-model="procedure.proc_categories"
                item-text="name"
                item-value="id"
                :items="getProcCategories"
                label="Category"
                required
              ></v-select>
            </v-col>
            <v-col sm="6">
              <v-select
                type="text"
                v-model="procedure.proc_collections"
                item-text="name"
                item-value="id"
                :items="getProcCollections"
                label="Collection"
              ></v-select>
            </v-col>
          </v-row>

          <v-layout wrap>
            <v-flex xs12>
              <v-combobox
                multiple
                v-model="procedure.tags"
                label="Tags"
                append-icon
                chips
                deletable-chips
                class="tag-input"
                :search-input.sync="search"
                @keyup.tab="updateTags"
                @paste="updateTags"
                required
              ></v-combobox>
            </v-flex>
          </v-layout>

          <!--
          <v-checkbox
            label="Private"
            v-model="procedure.isPublic"
            required
          ></v-checkbox>
          -->
        </v-form>
      </app-card>
      <app-card colClasses="col-xl-4 col-lg-4 col-md-5 col-sm-12 col-12 ">
        <!--  //TODO #5 Inserir simbolo de editar na imagem igual ao do grid da tela principal de procedimentos -->
        <p class="text-gray">
          Imagem de Capa
          <!-- 
            <v-btn @click="resetForm" color="primary" class="mr-3" x-small
            >Buscar na Internet</v-btn
          >
          -->
          <v-btn fab dark x-small color="primary" to="/" class="mr-1">
            <v-icon dark>mdi-file-find</v-icon>
          </v-btn>

          <v-btn fab dark x-small color="primary" to="/" class="mr-1">
            <v-icon dark>mdi-link</v-icon>
          </v-btn>

          <!-- <v-btn fab dark x-small color="primary" to="/">
            <v-icon dark>mdi-upload</v-icon>
          </v-btn> -->

          <v-btn
            fab
            dark
            x-small
            color="primary"
            @click="resetQuiz"
            title="update"
          >
            <v-icon dark>mdi-update</v-icon>
          </v-btn>
        </p>
        <div
          v-if="procedure.image && typeof procedure.image.src != 'undefined'"
        >
          <div class="text-center" id="imgShow" style="display: block">
            <img :src="procedure.image.src" style="width: 100% !important" />
          </div>
          <div id="imgUpdate" style="display: none">
            <dropzone
              id="imgDropzone"
              ref="imgDropzone"
              class="mb-2"
              :options="dropzoneOptions"
              @vdropzone-complete="afterComplete"
            ></dropzone>
          </div>
        </div>
        <div v-else>
          <dropzone
            id="imgDropzone"
            ref="imgDropzone"
            class="mb-2"
            :options="dropzoneOptions"
            @vdropzone-complete="afterComplete"
          ></dropzone>
        </div>

        <v-list class="card-list top-selling management-wrap mb-6">
          <v-list-item class="py-4">
            <v-list-item-content class="py-0">
              <v-list-item-title>Status:</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="my-0">
              <v-select
                class="mb-0"
                :items="status"
                item-text="text"
                item-value="value"
                v-model="procedure.status"
                flat
                solo
              ></v-select>
              <!--  <h5 class="mb-0 text-success">Rascunho</h5> -->
            </v-list-item-action>
          </v-list-item>
          <v-list-item class="py-4">
            <v-list-item-content class="py-0">
              <v-list-item-title>Visibilidade:</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="my-0">
              <v-select
                flat
                solo
                class="mb-0"
                :items="visibility"
                item-text="text"
                item-value="value"
                v-model="procedure.visibility"
                light
              ></v-select>
              <!-- <h5 class="mb-0 text-success">Público</h5> -->
            </v-list-item-action>
          </v-list-item>
          <v-list-item class="py-4">
            <v-list-item-content class="py-0">
              <v-list-item-title>Publicação:</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="my-0">
              <h5 class="mb-0 text-success">
                <!-- //TODO #12 Ajustar a exibição da hora de publicação -->
                {{ procedure.createdAt }}
              </h5>
            </v-list-item-action>
          </v-list-item>
          <v-list-item class="py-4">
            <v-list-item-content class="py-0">
              <v-list-item-title>Visualizações:</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="my-0">
              <h5 class="mb-0 text-success">{{ procedure.countViews }}</h5>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-row class="px-4 justify-content-end" col="12">
          <v-btn class="col-5 mr-1" @click="resetForm" medium color="secondary"
            >{{ $t("message.clear") }}
          </v-btn>
          <v-btn
            @click="onFormSubmit"
            :disabled="!valid"
            color="primary"
            class="col-5"
            medium
          >
            {{ $t("message.save") }}
          </v-btn>
        </v-row>
      </app-card>
    </v-row>
  </div>
</template>

<script>
//const AppCard = () => import('@/components/AppCard/AppCard');
import Dropzone from "vue2-dropzone";
//import ManagementProcedure from "Components/Widgets/ManagementProcedure";
import {
  dbProcCollectionsRef,
  dbProcCategoriesRef,
  // dbMediaRef,
  storageRef,
} from "@/firebase";
import { mapGetters, mapMutations } from "vuex";
import { v1 as uuidv1 } from "uuid";

let uuid = require("uuid");
const user_uid = JSON.parse(localStorage.getItem("user")).uid;

export default {
  name: "Identify",
  components: {
    //  ManagementProcedure,
    Dropzone,

    //AppCard
  },

  data() {
    let visibility = [
      { value: "PUBLIC", text: "Público" },
      { value: "PRIVATE", text: "Privado" },
    ];

    let status = [
      { value: "DRAFT", text: "Rascunho" },
      { value: "PUBLISHED", text: "Publicado" },
    ];

    return {
      status,
      visibility,
      switch1: "Rascunho",
      switch2: "Público",
      dropzoneOptions: {
        maxFiles: 1,
        url: "https://httpbin.org/post",
        maxFilesize: 0.5,
        chunking: true,
        chunkSize: 500, // Bytes
        thumbnailWidth: 250, // px
        thumbnailHeight: 150,
        addRemoveLinks: true,
        acceptedFiles: ".jpg, .jpeg, .png",
        dictDefaultMessage: `<i class="mdi mdi-file-image mdi-36px" aria-hidden="true"></i>
          <p class="form-text">Allowed Files: .jpg, .jpeg, .png</p>
          `,
        headers: { "My-Awesome-Header": "header value" },

        events: [],
        input: null,
        nonce: 0,
      },

      menuData: null,
      visible: false,
      valid: false,
      //TODO #1 Cadastro de Categorias de Procedimentos
      items: [],
      search: "",
    };
  },
  watch: {
    "$route.name": {
      deep: true,
      immediate: true,
      handler: function () {
        // let pathVal = this.$route.name;
      },
    },
  },
  created() {
    this.$store.dispatch("setProcCollectionsRef", dbProcCollectionsRef);
    this.$store.dispatch("setProcCategoriesRef", dbProcCategoriesRef);
  },
  computed: {
    ...mapGetters({ procedure: "getProcProcedures" }),
    ...mapGetters(["getProcCollections", "getProcCategories"]),
    ...mapMutations(["addMedia"]),
    timeline() {
      return this.events;
    },
  },
  methods: {
    async afterComplete(file) {
      try {
        const imageName = uuid.v1();
        var metaData = {
          contentType: "image/png",
        };

        const imageRef = storageRef.child(`images/${imageName}.png`);

        await imageRef.put(file, metaData);
        const downloadUrl = await imageRef.getDownloadURL();

        let payload = {
          name: imageName,
          path: imageRef.fullPath,
          src: downloadUrl,
        };

        console.log(payload);

        this.procedure.image = payload;

        // console.log(this.procedure.image);
        // this.$ref.imgDropZone.removeFile(file);
      } catch (error) {
        console.log(error);
      }
    },
    comment() {
      const time = new Date().toTimeString();
      this.events.push({
        id: this.nonce++,
        text: this.input,
        time: time.replace(/:\d{2}\sGMT-\d{4}\s\((.*)\)/, (match, contents) => {
          return ` ${contents
            .split(" ")
            .map((v) => v.charAt(0))
            .join("")}`;
        }),
      });

      this.input = null;
    },
    resetForm() {
      this.procedure.id = "";
      this.procedure.name = "";
      this.procedure.description = "";
      this.procedure.tags = "";
      this.procedure.proc_collections = "";
      this.procedure.proc_categories = "";
      this.procedure.image = "";
      this.procedure.satus = "";
      this.procedure.visibility = "";
      this.visible = true;
    },
    updateTags() {
      if (this.select !== null) {
        this.$nextTick(() => {
          this.search !== null
            ? this.select.push(...this.search.split(","))
            : "";

          this.$nextTick(() => {
            this.search = "";
          });
        });
      }
    },
    onFormSubmit(event) {
      event.preventDefault();

      if (
        this.$route.path != "/procedures/new" &&
        this.$route.path != "/procedures/new#identify"
      ) {
        this.procedure.owner =
          typeof this.procedure.owner.id != "undefined"
            ? this.procedure.owner.id
            : user_uid;
        this.$store.dispatch("updateProcProcedure", this.procedure);
      } else {
        const slugId = uuidv1();
        let payload = {
          name: this.procedure.name,
          slug: slugId,
          description: this.procedure.description,
          countViews: 0,
          tags: this.procedure.tags,
          image: this.procedure.image ? this.procedure.image : "",
          status: this.procedure.status ? this.procedure.status : "DRAFT",
          visibility: this.procedure.visibility
            ? this.procedure.visibility
            : "PRIVATE",
        };

        if (typeof this.procedure.proc_categories != "undefined") {
          payload.proc_categories = this.procedure.proc_categories;
        }

        if (typeof this.procedure.proc_collections != "undefined") {
          payload.proc_collections = this.procedure.proc_collections;
        }
        this.$store.dispatch("addProcProcedure", payload);
        this.$router.replace(`/procedures/${slugId}/edit#identify`);
      }
    },
    resetQuiz() {
      document.getElementById("imgShow").style.display = "none"; //hide.
      document.getElementById("imgUpdate").style.display = "block"; //show.
      console.log("RESET");
    },
  },
};
</script>

<style scoped>
.img-div {
  display: flex;
  margin: 25px;
}

img {
  max-width: 250px;
  margin: 15px;
}
</style>