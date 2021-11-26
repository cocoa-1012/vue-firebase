 <template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" class="my-auto">
        <app-card customClasses="elevation-0">
          <div
            class="d-flex justify-space-between align-items-center pl-1 pa-0 project-grid-title"
          >
            <div class="title">
              <h3 class="mb-0">
                Timeline
                <!-- {{ $t("message" + "." + viewType) }}-->
              </h3>
            </div>
            <div class="text-right project-icon">
              <v-icon
                class="mr-2"
                :class="{ active: isActive == 'time-line' }"
                style="cursor: pointer"
                @click="girdView(1)"
                >mdi-chart-timeline</v-icon
              >
              <v-icon
                class="mr-2"
                :class="{ active: isActive == 'grid' }"
                style="cursor: pointer"
                @click="girdView(1)"
                >apps</v-icon
              >
              <v-icon
                :class="{ active: isActive == 'list' }"
                style="cursor: pointer"
                @click="listView(2)"
                >list</v-icon
              >
            </div>
          </div>

          <v-timeline dense clipped>
            <v-timeline-item
              color="primary"
              icon-color="white"
              large
              icon="mdi-source-commit-start"
              return-object
            >
              <v-row justify="space-between">
                <v-col cols="7">START</v-col>
              </v-row>
            </v-timeline-item>
            <!--   <draggable v-model="list"> 
            //TODO #3 Ordenar atividades pelo campo ORDER
            //TODO #10 Ao clicar no título da ação, na timeline, transformar em campo editável.
            -->

            <template v-for="(action, i) in getProcProceduresActivities">
              <v-timeline-item
                :color="action.phase.color"
                medium
                icon="mdi-clipboard-list-outline"
                icon-color="white"
                :key="i"
                class="mb-4"
                @click.stop="showItems[action.phase.id] = false"
              >
                <v-row
                  justify="space-between"
                  :class="[{ 'on-hover': hover }, 'timeline']"
                >
                  <v-col cols="12">
                    {{
                      action.phase.name ? action.phase.name : "Default Phase"
                    }}</v-col
                  >
                </v-row>
              </v-timeline-item>
              <div ref="action" :key="'a-' + i">
                <v-timeline-item
                  :color="action.phase.color"
                  medium
                  icon="mdi-source-commit"
                  icon-color="white"
                  :key="'a-' + i"
                  class="mb-4"
                >
                  <v-row
                    justify="space-between"
                    :class="[{ 'on-hover': hover }, 'timeline']"
                  >
                    <v-col cols="9"> {{ action.name }}</v-col>
                  </v-row>
                </v-timeline-item>

                <template v-for="(instruction, iid) in action.instructions">
                  <div :key="iid">
                    <template v-for="(details, index) in instruction">
                      <v-timeline-item
                        :color="action.phase.color"
                        small
                        :key="index"
                        class="mb-4"
                      >
                        <v-row
                          justify="space-between"
                          :class="[{ 'on-hover': hover }, 'timeline']"
                        >
                          <v-col cols="12"> {{ details.titleProp }}</v-col>
                        </v-row>
                      </v-timeline-item>
                    </template>
                  </div>
                </template>
              </div>
            </template>
            <v-timeline-item
              color="primary"
              large
              icon="mdi-source-commit-end"
              icon-color="white"
            >
              <v-row justify="space-between">
                <v-col cols="7">END</v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </app-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
//import Dropzone from "vue2-dropzone";
//import { dbProcCollectionsRef, dbProcCategoriesRef } from "@/firebase";
//import { mapGetters } from "vuex";
//import draggable from "vuedraggable";
//import PopupAction from "./popup/PopupAction";
//import { mapGetters } from "vuex";
import { mapGetters } from "vuex";
import { Bus } from "@/utils/bus";

//TODO #18 Inserir campo para determinar o nível de detalhamento de visualização da timeline : Instrução/Ação/Fase. Pode entrar no item configuração.

export default {
  components: {},
  name: "ProceduresPlay",
  data: () => ({
    list2: [],
    showItems: [],
    isActive: "time-line",
    hover: false,
    phases: [{ value: "DEFAULT", text: "Default" }],
    nonce: 0,
    events: [],
    action: {
      id: null,
      order: null,
      name: null,
      phase: "DEFAULT",
    },
    result: [],
    menuData: null,
  }),
  computed: {
    ...mapGetters([
      "getProcProcedures",
      "getProcProceduresActivities",
      "getProcProceduresPhases",
    ]),
    activitiesList: {
      get() {
        return this.getProcProceduresActivities;
      },
      set(value) {
        console.log(value);
        //this.$store.commit("actionStoreModule/changeUsedActions", value);
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
            color: data.phase.color,
          };
        });

        return [...defaultItem, ...dbItems];
      },
    },
    timeline() {
      return this.events.slice().reverse();
    },
  },
  methods: {
    getLastPhase(obj, indice) {
      if (indice > 0) {
        let objReturn = obj[indice - 1];
        return objReturn.phase.id;
      } else {
        return "";
      }
    },
    editAction(action) {
      Bus.$emit("show-action", action);
    },
    //TODO #2 Fazer Modal perguntando se tem certeza que deseja excluir.
    deleteAction(id) {
      let payload = {
        procedure_id: this.getProcProcedures.id,
        id: id,
      };

      this.$store.dispatch("deleteAction", payload);
    },
    //TODO #9 #8 Fazer método Store para duplicar Ação no banco de dados.
    duplicateAction(id) {
      let payload = {
        procedure_id: this.getProcProcedures.id,
        id: id,
      };
      this.$store.dispatch("duplicateAction", payload);
    },
    comment() {
      let payload = {
        procedure_id: this.getProcProcedures.id,
        id: null,
        order: this.nonce++,
        name: this.action.name,
        phase: this.action.phase,
      };

      this.events.push({
        payload,
      });

      this.$store.dispatch("addAction", payload);

      this.action.name = null;
    },
  },
};
</script>


<style scoped>
.timeline:not(.on-hover) {
  opacity: 0.6;
  background: white;
}
.timeline {
  background: #eeeeee;
  transition: opacity 0.4s ease-in-out;
}
</style>


