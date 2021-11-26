<template>
  <div>
    <v-toolbar flat dark color="primary">
      <v-btn icon dark @click.stop="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Play</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-toolbar-items>
        <v-btn dark text @click.stop="show = false"> Save </v-btn>
      </v-toolbar-items>
      <v-menu bottom right offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i" @click="() => {}">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </v-toolbar>
    <v-card-text> <run-play></run-play></v-card-text>
  </div>
</template>
	


<script>
import { Bus } from "@/utils/bus";
import { mapGetters } from "vuex";

export default {
  name: "PopupPlay",
  props: ["procedure"],
  components: { RunPlay: () => import("@/views/proceed/procedures/Play") },
  data() {
    let phaseForm = {
      id: "",
      procedure_id: "",
      name: "",
      description: "",
      tags: "",
      color: "",
    };

    //   phaseForm = Object.assign({}, phaseForm, this.phase);

    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      select: [
        { text: "State 1" },
        { text: "State 2" },
        { text: "State 3" },
        { text: "State 4" },
        { text: "State 5" },
        { text: "State 6" },
        { text: "State 7" },
      ],
      visible: false,
      phaseForm,
      items: [],
      search: "", //sync search
    };
  },
  created() {
    Bus.$on("show-phase", () => {
      this.visible = true;
    });

    //Bus.$on("open-new-phase", this.resetForm);
    //console.log(this.procedureId);
  },
  computed: {
    ...mapGetters([
      "getProcProcedures",
      "getProcProceduresActivities",
      "getProcProceduresPhases",
    ]),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        this.visible = value;
        if (!value) {
          this.$emit("close");
          Bus.$emit("close-dialog");
        }
      },
    },
  },
  methods: {
    showNewPhase() {
      Bus.$emit("open-new-phase");
    },
    resetForm() {
      this.phaseForm.id = "";
      this.phaseForm.procedure_id = this.procedureId;
      this.phaseForm.name = "";
      this.phaseForm.description = "";
      this.phaseForm.tags = "";
      this.phaseForm.color = "";
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
    setPhase(item) {
      this.phaseForm.id = item.phase.id;
      this.phaseForm.procedure_id = this.procedureId;
      this.phaseForm.name = item.phase.name;
      this.phaseForm.description = item.phase.description;
      this.phaseForm.tags = item.phase.tags;
      this.phaseForm.color = item.phase.color;
      this.visible = true;
    },
    onFormSubmit(event) {
      event.preventDefault();
      console.log(this.phaseForm);
      // if (this.phaseForm.id !== "") {
      // this.$store.dispatch("updatePhase", this.phaseForm);
      //} else {
      delete this.phaseForm.id;

      let payload = {
        procedure_id: this.getProcProcedures.id,
        name: this.phaseForm.name,
        description: this.phaseForm.description,
        tags: this.phaseForm.tags,
        color: this.phaseForm.color,
      };
      this.$store.dispatch("addPhase", payload);
      // }
    },
  },
};
</script>

<style scoped>
.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow: auto;
}
</style>