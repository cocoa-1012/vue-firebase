 <template>
  <div>
    <v-row>
      <v-col class="col-xl-8 col-lg-8 col-md-7 col-sm-12 col-12">
        <app-card customClasses="elevation-0">
          <div
            class="d-flex justify-space-between align-items-center pa-6 project-grid-title"
          >
            <div class="title">
              <h3 class="mb-0">
                {{ viewType }}
              </h3>
            </div>

            <div class="text-right project-icon">
              <v-icon
                class="mr-2"
                :class="{ active: isActive == 'time-line' }"
                style="cursor: pointer"
                @click="timeLineView()"
                >mdi-chart-timeline</v-icon
              >
              <v-icon
                class="mr-2"
                :class="{ active: isActive == 'card' }"
                style="cursor: pointer"
                @click="cardView()"
                >apps</v-icon
              >
              <v-icon
                class="mr-2"
                :class="{ active: isActive == 'tree' }"
                style="cursor: pointer"
                @click="treeView()"
                >list</v-icon
              >
              <v-icon
                class="mr-2"
                :class="{ active: isActive == 'chart' }"
                style="cursor: pointer"
                @click="chartView()"
                >mdi-vector-polyline</v-icon
              >
            </div>
          </div>

          <!-- grid view			 -->

          <div v-show="selectedView == 'tree'">
            <tree-view
              :data="getTimeLine"
              :options="{ maxDepth: 3 }"
            ></tree-view>
          </div>

          <div v-show="selectedView == 'chart'">
            <organization-chart
              :datasource="getTimeLine ? getTimeLine : null"
            ></organization-chart>
          </div>
          <div v-show="selectedView == 'card'">
            <v-row class="fill-height overflow-auto" id="container">
              <v-col
                v-for="item in getTimeLine"
                :key="item.id"
                :cols="3"
                class="py-2"
              >
                <v-card class="card fill-height">
                  <v-card-title>
                    <span class="font-weight-light text-truncate">
                      <span v-text="item.order + 1 + ' - ' + item.name"></span>
                    </span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <div
                      v-if="
                        procedure.image &&
                        typeof procedure.image.src != 'undefined'
                      "
                      class="text-center"
                    >
                      <img
                        :src="procedure.image.src"
                        style="width: 100% !important"
                      />
                    </div>
                    <!--  <span v-html="item.name" class="mr-2"></span>
                    <v-chip v-text="item.name"></v-chip> -->
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <div v-show="selectedView == 'time-line'">
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
              <template v-for="(action, i) in getTimeLine">
                <v-timeline-item
                  :color="action.phase.color"
                  medium
                  icon="mdi-clipboard-list-outline"
                  icon-color="white"
                  :key="i"
                  class="mb-4"
                  v-if="getLastPhase(getTimeLine, i) != action.phase.id"
                >
                  <v-hover v-slot="{ hover }">
                    <v-row
                      justify="space-between"
                      :class="[{ 'on-hover': hover }, 'timeline']"
                    >
                      <v-col cols="9">
                        {{
                          action.phase.name
                            ? action.phase.name
                            : "Default Phase"
                        }}</v-col
                      >
                      <v-col
                        align="center"
                        justify="start"
                        class="ml-2"
                        cols="2"
                        v-if="hover"
                      >
                        <v-btn x-small icon color="primary" class="mr-2">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>

                        <v-btn x-small icon color="primary" class="mr-2">
                          <v-icon>mdi-content-duplicate</v-icon>
                        </v-btn>

                        <v-btn x-small icon color="primary" class="mr-2">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-hover>
                </v-timeline-item>
                <draggable
                  v-model="list2"
                  class="dragArea"
                  group="people"
                  :key="'a-' + i"
                  :animation="200"
                >
                  <div ref="action" :key="'a-' + i">
                    <v-timeline-item
                      :color="action.phase.color"
                      medium
                      icon="mdi-source-commit"
                      icon-color="white"
                      :key="'a-' + i"
                      class="mb-4"
                    >
                      <v-hover v-slot="{ hover }">
                        <v-row
                          justify="space-between"
                          :class="[{ 'on-hover': hover }, 'timeline']"
                        >
                          <v-col cols="9"> {{ action.name }}</v-col>

                          <v-col
                            align="center"
                            justify="start"
                            class="ml-2"
                            cols="2"
                            v-if="hover"
                          >
                            <v-btn x-small icon color="primary" class="mr-2">
                              <v-icon @click="editAction(action)"
                                >mdi-pencil</v-icon
                              >
                            </v-btn>

                            <v-btn
                              @click="duplicateAction(action)"
                              x-small
                              icon
                              color="primary"
                              class="mr-2"
                            >
                              <v-icon>mdi-content-duplicate</v-icon>
                            </v-btn>

                            <v-btn
                              @click="deleteAction(action.id)"
                              x-small
                              icon
                              color="primary"
                              class="mr-2"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-hover>
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
                            <v-hover v-slot="{ hover }">
                              <v-row
                                justify="space-between"
                                :class="[{ 'on-hover': hover }, 'timeline']"
                              >
                                <v-col cols="12">
                                  {{ details.titleProp }}</v-col
                                >
                              </v-row>
                            </v-hover>
                          </v-timeline-item>
                        </template>
                      </div>
                    </template>
                  </div>
                </draggable>
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
          </div>
        </app-card>
      </v-col>

      <app-card colClasses="col-xl-4 col-lg-4 col-md-5 col-sm-12 col-12 ">
        <management-procedure :managementData="menuData"></management-procedure>
      </app-card>
    </v-row>
  </div>
</template>

<script>
import ManagementProcedure from "Components/Widgets/ManagementProcedure";
import { mapGetters } from "vuex";
import { Bus } from "@/utils/bus";
import draggable from "vuedraggable";
import { firstBy } from "thenby";
import OrganizationChart from "vue-organization-chart";
import "vue-organization-chart/dist/orgchart.css";
//TODO #18 Inserir campo para determinar o nível de detalhamento de visualização da timeline : Instrução/Ação/Fase. Pode entrar no item configuração.

export default {
  name: "Process",
  components: {
    ManagementProcedure,
    draggable,
    OrganizationChart,
  },

  data: () => ({
    showItems: [],

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

    viewType: "projectGrid",
    selectedView: "time-line",
    isActive: "time-line",
  }),
  computed: {
    ...mapGetters([
      "getProcProcedures",
      "getProcProceduresActivities",
      "getProcProceduresPhases",
    ]),
    ...mapGetters({ procedure: "getProcProcedures" }),
    getTimeLine: {
      get() {
        let retorno = Array.from(
          new Set(this.getProcProceduresActivities)
        ).sort(
          firstBy(
            (a, b) =>
              (a.phase.order ? a.phase.order : 0) -
              (b.phase.order ? b.phase.order : 0)
          ).thenBy((a, b) => a.order - b.order)
        );
        return retorno;
      },
    },
    activitiesList: {
      get() {
        
        return this.getProcProceduresActivities;
      },
      // set(value) {
      //  console.log(value);
      //this.$store.commit("actionStoreModule/changeUsedActions", value);
      //},
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
    treeView() {
      this.viewType = "Tree View";
      this.selectedView = "tree";
      this.isActive = "tree";
    },
    cardView() {
      this.viewType = "Card View";
      this.selectedView = "card";
      this.isActive = "card";
    },
    timeLineView() {
      this.viewType = "Timeline";
      this.selectedView = "time-line";
      this.isActive = "time-line";
    },
    chartView() {
      this.viewType = "Chart";
      this.selectedView = "chart";
      this.isActive = "chart";
    },
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
    duplicateAction(action) {
      let maxOrder = this.getProcProceduresActivities.map((act) => {
        return act.phase != "undefined" &&
          act.phase.id == action.phase.id &&
          act.order != "undefined"
          ? act.order
          : 0;
      });

      let payload = {
        procedure_id: this.getProcProcedures.id,
        id: action.id,
        order: Math.max(...maxOrder) + 1,
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


