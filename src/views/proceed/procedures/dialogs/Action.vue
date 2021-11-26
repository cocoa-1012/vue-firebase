<template>
  <div>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click.stop="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Action</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon dark @click="comment()">
          <v-icon> mdi-content-save</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card elevation="0">
      <v-tabs>
        <v-tab>{{ !action.id ? "Inserir" : "Editar" }}</v-tab>
        <v-tab>Instruções</v-tab>
        <v-tab-item>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-form>
                  <v-col cols="12" md="12" lg="12" class="pb-0">
                    <div class="d-flex search-field-wrap">
                      <div class="w-100">
                        <v-text-field
                          class="pt-0 pr-3"
                          label="Activity"
                          v-model="action.name"
                        >
                        </v-text-field>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="12" lg="12" class="pb-4">
                    <div class="d-flex search-field-wrap">
                      <v-select
                        class="pt-0 pr-3"
                        v-model="phase"
                        label="Phase"
                        :items="getPhases"
                        item-text="text"
                        item-value="value"
                        @change="this.action.phase = phase"
                      >
                        <!--
                      //TODO alterar ordem após alterar a fase
                      -->
                        <template slot="selection" slot-scope="data">
                          <v-list-item-avatar>
                            <v-icon small :color="data.item.color">
                              {{ data.item.icon }}
                            </v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ data.item.text }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>
                        <template slot="item" slot-scope="data">
                          <v-list-item-avatar>
                            <v-icon small :color="data.item.color">
                              {{ data.item.icon }}
                            </v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ data.item.text }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </v-select>
                    </div>
                  </v-col>
                </v-form>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>

        <v-tab-item>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-container>
                  <v-form ref="form" class="ma-0">
                    <v-jsf
                      class="pt-0"
                      v-model="instructions"
                      :options="options"
                      :schema="schema"
                    /> </v-form
                ></v-container>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
import { Bus } from "@/utils/bus";
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
import { mapGetters } from "vuex";

const schema = {
  type: "object",
  properties: {
    objectArrayProp: {
      type: "array",
      title: "Add Instructions",
      description: "This description is used as a help message.",
      "x-itemTitle": "titleProp",
      items: {
        type: "object",
        required: ["titleProp"],
        properties: {
          iconOneOf: {
            title: "Icon Type",
            type: "string",
            "x-display": "icon",
            "x-itemIcon": "icon",
            oneOf: [
              {
                const: "ALERT",
                title: "Alert",
                icon: "mdi-alert",
              },
              {
                const: "HELP",
                title: "Question",
                icon: "mdi-help-circle",
              },
              {
                const: "INFORMATION",
                title: "Information",
                icon: "mdi-information",
              },
              {
                const: "RADIOACTIVE",
                title: "Radioactive",
                icon: "mdi-radioactive",
              },
              {
                const: "DEFAULT",
                title: "Check Default",
                icon: "mdi-checkbox-marked-outline",
              },
            ],
            default: "DEFAULT",
          },
          titleProp: {
            type: "string",
            title: "Title",
          },
          limitedObjectsArray: {
            type: "array",
            title: "Add Custom Reactions for Responses",
            items: {
              type: "object",
              properties: {
                titleProp: {
                  type: "string",
                  title: "Response",
                },
                nextAction: {
                  type: "string",
                  oneOf: [],
                  title: "Reaction",
                  default: "NEXT_DEFAULT",
                },
                booleanSwitchProp: {
                  type: "boolean",
                  title: "Default",
                  "x-display": "switch",
                },
              },
            },
            //TODO #14 VERSÃO PRO: Quantidade maior de possibilidades de resultado na instrução. Default: 3
            maxItems: 3,
          },
        },
      },
    },
  },
};

export default {
  name: "PopupAction",
  props: {
    procedureId: String,
    action: {
      id: String,
      name: String,
      procedure_id: String,
      phase: Object,
      instructions: Object,
    },
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

    return {
      schema,
      hover: false,
      nonce: 0,
      actionArray,
      visible: false,
      valid: false,
      options: {},
      rendered: null,
    };
  },
  mounted(){

    this.getProcProceduresPhases.map((data) => {
          console.log(data.name);
    });
    
  },
  computed: {
    ...mapGetters([
      "getProcProcedures",
      "getProcProceduresActivities",
      "getProcProceduresPhases",
    ]),
    instructions: {
      get() {
        if (typeof this.action.instructions == "undefined") {
          return {};
        } else {
          return this.action.instructions;
        }
      },
      set(value) {
        this.action.instructions = value;
      },
    },
    order: {
      get(phase_id) {
        return this.getPhaseNextPosition(phase_id);
      },
    },
    getPhases: {
      get() {
        let defaultItem = [
          {
            value: "DEFAULT",
            text: "Default",
            icon: "mdi-checkbox-blank-circle",
            color: "primary",
          },
        ];
        let dbItems = this.getProcProceduresPhases.map((data) => {
          return {
            value: data.id,
            text: data.name,
            icon: "mdi-checkbox-blank-circle",
            color: data.color,
          };
        });

        return [...defaultItem, ...dbItems];
      },
    },
    phase: {
      get() {
        if (typeof this.action.phase === "object") {
          return this.action.phase.id;
        } else if (typeof this.action.phase === "string") {
          return this.action.phase;
        } else {
          return "DEFAULT";
        }
      },
      set(value) {
        this.action.phase = value;
      },
    },
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        this.visible = value;
        if (!value) {
          Bus.$emit("close-dialog");
          this.$emit("close");
        }
      },
    },
  },
  methods: {
    getPhaseNextPosition(phase_id) {
      if (
        typeof this.getProcProceduresActivities != "undefined" &&
        this.getProcProceduresActivities.length > 0
      ) {
        // let maxOrder = this.getProcProceduresActivities.sort((a, b) => a - b);

        let maxOrder = this.getProcProceduresActivities.map((act) => {
          return act.phase != "undefined" &&
            (act.phase.id == phase_id ||
              ("DEFAULT" == phase_id && act.phase == phase_id)) &&
            act.order != "undefined"
            ? act.order
            : 0;
        });

        return Math.max(...maxOrder) + 1;
      }
      return 0;
    },
    comment() {
      //TODO #15 Após salvar action permanecer com o ID salvo para que usuário possa alterar a action
      //TODO #16 Permitir inserir imagem na ação e ou instrução.
      //BUG #17 Após inserir uma ação, ao tentar inserir a próxima dá erro. Verificar se as informação são apagadas ao clicar em inserir e depois de salvar/atualizar uma ação
      let payload = {
        procedure_id: this.getProcProcedures.id,
        order: this.action.order,
        name: this.action.name,
        phase:
          typeof this.action.phase == "object"
            ? this.action.phase.id
            : this.action.phase
            ? this.action.phase
            : "DEFAULT",
      };

      console.log(payload);

      if (typeof this.action.instructions != "undefined") {
        payload.instructions = this.action.instructions;
      }

      console.log(payload);

      if (this.action.id && this.action.id != null && this.action.id != "") {
        payload.id = this.action.id;
        this.$store.dispatch("updateAction", payload);
      } else {
        payload.order = this.getPhaseNextPosition(this.phase);

        this.$store.dispatch("addAction", payload);
        this.resetForm;
      }
    },
    updateActionArray() {
      this.getProcProceduresActivities.map((e) => {
        /*
        schema.properties.objectArrayProp.items.properties.limitedObjectsArray.items.properties.nextAction.oneOf.push(
          {
            const: e.id,
            title: e.name,
          }
        );*/
        this.actionArray.push({
          const: e.id,
          title: e.name,
        });
      });
    },
    setAction(item) {
      console.log(item);
      this.action.id = item.id;
      this.action.name = item.name;

      this.action.order = item.order;
      this.action.phase = item.phase.id;
      this.action.instructions = item.instructions;
      this.action.procedure_id = this.getProcProcedures.id;
      this.show = true;
    },
    resetForm() {
      this.updateActionArray();
      this.action.id = "";
      this.action.name = "";
      this.action.order = "";

      this.action.procedure_id = "";
      this.action.phase = "";
      this.action.instructions = schema;
      this.show = true;
    },
  },
};
</script>

<style>
</style>