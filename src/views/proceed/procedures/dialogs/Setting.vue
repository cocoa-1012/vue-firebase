<template>
  <v-row justify="center">
    <v-dialog
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          dark
          large
          color="primary"
          fixed
          right
          bottom
          v-on="on"
          @click.stop="showNewAction()"
        >
          <v-icon dark>add</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary" elevation="0">
          <v-btn icon dark @click.stop="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <v-toolbar-title v-if="actionForm.title == ''"
            >Adicionar Ação</v-toolbar-title
          >
          <v-toolbar-title v-else>{{ actionForm.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="onFormSubmit">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-list three-line subheader>
          <v-list-item>
            <v-list-item-content>
              <v-form>
                <v-text-field
                  v-model="actionForm.title"
                  :counter="50"
                  label="Título da Ação"
                  required
                ></v-text-field>
                <!--   <v-file-input label="Foto" prepend-icon="mdi-camera"></v-file-input> -->

                <!-- <v-select :items="items" label="Configuration"></v-select> -->

                <v-radio-group v-model="actionForm.phase_id">
                  <v-label>Fase</v-label> <br />
                  <div class="text-left row">
                    <v-chip
                      label
                      class="ma-2 col-5 col-md-2"
                      text-color="primary"
                      color="white"
                      ><v-radio
                        class="ml-2 mt-2 mb-2"
                        color="primary"
                        value="DEFAULT"
                      ></v-radio
                      ><v-icon size="2em" class="mr-2" color="primary"
                        >mdi-source-commit</v-icon
                      >
                      Default</v-chip
                    >

                    <template v-for="(phase, i) in getPhases">
                      <v-chip
                        label
                        class="ma-2 col-5 col-md-2"
                        text-color="primary"
                        color="white"
                        :key="i"
                        ><v-radio
                          class="ml-2 mt-2 mb-2"
                          color="primary"
                          :value="phase.id"
                        ></v-radio>
                        <v-icon
                          size="2em"
                          class="mr-2"
                          :style="{ color: phase.color }"
                          >mdi-source-commit</v-icon
                        >{{ phase.name }}
                      </v-chip>
                    </template>
                  </div>
                </v-radio-group>

                <v-radio-group v-model="actionForm.response_type">
                  <v-label>Tipo de Reação</v-label> <br />
                  <div class="text-left row">
                    <v-chip
                      label
                      class="ma-2 col-5 col-md-2"
                      text-color="primary"
                      color="white"
                      @click="showFormTRUEFALSE"
                      ><v-radio
                        value="TRUEFALSE"
                        class="ml-2 mt-2 mb-2"
                        color="primary"
                      ></v-radio>
                      <v-icon size="2em" class="mr-2" color="primary"
                        >mdi-unfold-more-vertical</v-icon
                      >
                      Default</v-chip
                    >

                    <v-chip
                      label
                      class="ma-2 col-5 col-md-2"
                      text-color="primary"
                      color="white"
                      @click="showFormMULTIPLECHOICES"
                      ><v-radio
                        value="MULTIPLECHOICES"
                        class="ml-2 mt-2 mb-2"
                        color="primary"
                      ></v-radio>
                      <v-icon size="2em" class="mr-2" color="primary"
                        >mdi-checkbox-multiple-marked</v-icon
                      >
                      Multiple Choices</v-chip
                    >

                    <v-chip
                      label
                      class="ma-2 col-5 col-md-2"
                      text-color="primary"
                      color="white"
                      @click="showFormTEXT"
                      ><v-radio
                        value="TEXT"
                        class="ml-2 mt-2 mb-2"
                        color="primary"
                      ></v-radio>
                      <v-icon size="2em" class="mr-2" color="primary"
                        >mdi-format-color-text</v-icon
                      >
                      Text
                    </v-chip>

                    <v-chip
                      label
                      class="ma-2 col-5 col-md-2"
                      text-color="primary"
                      color="white"
                      @click="showFormNUMBER"
                      ><v-radio
                        value="NUMBER"
                        class="ml-2 mt-2 mb-2"
                        color="primary"
                      ></v-radio>
                      <v-icon size="2em" class="mr-2" color="primary"
                        >mdi-numeric</v-icon
                      >
                      Number
                    </v-chip>
                  </div>
                </v-radio-group>
              </v-form>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-label>Reação</v-label>
              <v-container>
                <v-form ref="form" class="ma-4">
                  <v-jsf
                    class="pt-4"
                    v-if="rendered"
                    v-model="model"
                    :schema="rendered.schema"
                  /> </v-form
              ></v-container>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { Bus } from "../../utils/bus";
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
import { mapGetters } from "vuex";
import { db } from "@/db";

export default {
  name: "PopupAction",
  props: {
    procedureId: String,
  },
  components: { VJsf },
  data() {
    let actionArray = [
      {
        const: "NEXT_DEFAULT",
        title: "Go to next action in the sequence.",
      },
      {
        const: "PREVIOUS_DEFAULT",
        title: "Go to previous action in the sequence.",
      },
      {
        const: "END",
        title: "End of the procedure sequence.",
      },
    ];

    let actionForm = {
      title: "",
      id: "",
      procedure_id: "",
      phase_id: "DEFAULT",
      response_type: "TRUEFALSE",
    };

    // actionForm = Object.assign({}, actionForm, this.procedure);

    return {
      actionArray,
      visible: false,
      actionForm,
      name: "name",
      phase_id: "DEFAULT",
      id: "123",
      valid: false,
      model: {},
      options: {},
      rendered: null,
      currentForm: null,
      TRUEFALSE: {
        schema: {
          type: "object",
          properties: {
            nextAction: {
              type: "string",
              oneOf: actionArray,
              //  enum: ["Next Action", "Previous Action", "Quit"],
              title: "Reaction Forward",
              default: "NEXT_DEFAULT",
            },
            previousAction: {
              type: "string",
              oneOf: actionArray,
              title: "Reaction for Back",
              default: "PREVIOUS_DEFAULT",
            },
          },
        },
      },

      NUMBER: {
        schema: {
          type: "object",
          properties: {
            nextAction: {
              type: "string",
              oneOf: actionArray,
              //  enum: ["Next Action", "Previous Action", "Quit"],
              title: "Reaction Forward",
              default: "NEXT_DEFAULT",
            },
            previousAction: {
              type: "string",
              oneOf: actionArray,
              title: "Reaction for Back",
              default: "PREVIOUS_DEFAULT",
            },
            minNumber: {
              type: "number",
              title: "Valor Mínimo",
            },
            minSelectAction: {
              type: "string",
              enum: this.actionArray,
              title: "Reação para Menor Valor",
            },
            maxNumber: {
              type: "number",
              title: "Valor Máximo",
            },
            maxSelectAction: {
              type: "string",
              enum: this.actionArray,
              title: "Reação para Maior Valor",
            },
            choicesArray: {
              type: "array",
              title: "Adicionar Outras Reações",
              items: {
                type: "object",
                properties: {
                  value: {
                    type: "number",
                    title: "Valor",
                  },
                  nextAction: {
                    type: "string",
                    enum: this.actionArray,
                    title: "Reação",
                  },
                },
              },
              minItems: 0,
              maxItems: 10,
            },
          },
        },
      },
      TEXT: {
        schema: {
          type: "object",
          properties: {
            nextAction: {
              type: "string",
              oneOf: actionArray,
              //  enum: ["Next Action", "Previous Action", "Quit"],
              title: "Reaction Forward",
              default: "NEXT_DEFAULT",
            },
            previousAction: {
              type: "string",
              oneOf: actionArray,
              title: "Reaction for Back",
              default: "PREVIOUS_DEFAULT",
            },
            totalChars: {
              type: "integer",
              title: "Quantidade de Caracteres",
            },
          },
        },
      },
      MULTIPLECHOICES: {
        schema: {
          type: "object",
          properties: {
            choicesArray: {
              type: "array",
              title: "Adicionar Itens de Múltipla Escola",
              description: "This description is used as a help message.",
              "x-itemTitle": "titleProp",
              items: {
                type: "object",
                required: ["titleProp"],
                properties: {
                  title: {
                    type: "string",
                    title: "Response Title",
                  },
                  true: {
                    type: "boolean",
                    title: "Valid/True",
                  },
                  nextAction: {
                    type: "string",
                    oneOf: actionArray,
                    //  enum: ["Next Action", "Previous Action", "Quit"],
                    title: "Reaction Forward",
                    default: "NEXT_DEFAULT",
                  },
                },
              },
              minItems: 1,
              maxItems: 10,
            },
          },
        },
      },
    };
  },
  created() {
    //  console.log("Evento recebido");
    Bus.$on("open-edit-action", this.setAction);
    Bus.$on("open-new-action", this.resetForm);

    this.$store.commit("setProcedureId", {
      procedure_id: this.procedureId,
    });
    this.$store.dispatch("setPhaseRef", {
      procedure_id: this.procedureId,
    });
  },
  computed: {
    ...mapGetters(["getPhases", "getActions"]),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        this.visible = value;
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
  methods: {
    updateActionArray() {
      this.getActions.map((e) => {
        this.actionArray.push({
          const: e.id,
          title: e.title,
        });
      });
    },
    showNewAction() {
      Bus.$emit("open-new-action");
    },
    setAction(item) {
      console.log(item);
      //this.actionForm.title = item.procedure.name;
      this.actionForm.id = item.action.id;
      this.actionForm.title = item.action.title;
      this.actionForm.procedure_id = db.doc(
        "/procedures/" + item.action.procedure_id
      ).ref;
      this.actionForm.phase_id = db.doc("/phases/" + item.action.phase_id).ref;
      this.actionForm.formulary = item.action.formulary;
      this.actionForm.response_type = item.action.response_type;

      if (this.actionForm.response_type == "MULTIPLECHOICES") {
        // this.showFormMULTIPLECHOICES();
        this.rendered = this.MULTIPLECHOICES;
      } else if (this.actionForm.response_type == "TEXT") {
        // this.showFormTEXT();
        this.rendered = this.TEXT;
      } else if (this.actionForm.response_type == "NUMBER") {
        // this.showFormNUMBER();
        this.rendered = this.NUMBER;
      } else if (this.actionForm.response_type == "TRUEFALSE") {
        // this.showFormTRUEFALSE();
        this.rendered = this.TRUEFALSE;
      }

      this.model = item.action.formulary;
      this.visible = true;
    },
    resetForm() {
      this.updateActionArray();
      this.actionForm.title = "";
      this.actionForm.id = "";
      this.actionForm.procedure_id = db.doc(
        "/procedures/" + this.procedureId
      ).ref;
      this.actionForm.phase_id = db.doc("/phases/DEFAULT").ref;
      this.actionForm.formulary = this.model;
      this.actionForm.response_type = "TRUEFALSE";
      this.visible = true;
      this.showFormTRUEFALSE();
    },
    onFormSubmit(event) {
      event.preventDefault();
      console.log(this.actionForm);
      if (this.actionForm.id !== "") {
        this.$store.dispatch("updateAction", this.actionForm);
      } else {
        delete this.actionForm.id;
        this.$store.dispatch("addAction", this.actionForm);
      }
    },
    showFormMULTIPLECHOICES() {
      this.rendered = null;
      this.$nextTick(() => {
        this.rendered = this.MULTIPLECHOICES;
      });
    },
    showFormTEXT() {
      this.rendered = null;
      this.$nextTick(() => {
        this.rendered = this.TEXT;
      });
    },
    showFormNUMBER() {
      this.rendered = null;
      this.$nextTick(() => {
        this.rendered = this.NUMBER;
      });
    },
    showFormTRUEFALSE() {
      this.rendered = null;
      this.$nextTick(() => {
        this.rendered = this.TRUEFALSE;
      });
    },
    addField() {
      this.inputs.push({
        name: "",
        party: "",
      });
      console.log(this.inputs);
    },

    removeField(index) {
      this.inputs.splice(index, 1);
    },

    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
  },
};
</script>

<style>
</style>