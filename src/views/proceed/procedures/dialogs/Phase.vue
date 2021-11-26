<template>
  <div>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click.stop="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Phase</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <!-- <v-btn dark text @click.stop="show = false"> Save </v-btn> -->
        <v-btn icon dark @click="comment()">
          <v-icon> mdi-content-save</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card elevation="0">
      <!-- <v-toolbar dark color="primary" elevation="0">
        <v-toolbar-items>
          <v-btn dark text @click="onFormSubmit">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar> -->
      <v-list three-line subheader>
        <v-list-item>
          <v-list-item-content>
            <v-form>
              <v-text-field
                v-model="phaseForm.name"
                :counter="50"
                label="Título"
                required
              ></v-text-field>

              <!-- <v-select :items="items" label="Configuration"></v-select> -->
              <v-textarea
                label="Descrição"
                v-model="phaseForm.description"
              ></v-textarea>

              <v-label>Cor</v-label>
              <v-color-picker
                v-model="phaseForm.color"
                class="ma-2"
                hide-canvas
              ></v-color-picker>

              <v-layout wrap>
                <v-flex xs12>
                  <v-combobox
                    multiple
                    v-model="phaseForm.tags"
                    label="Tags"
                    append-icon
                    chips
                    deletable-chips
                    class="tag-input"
                    :search-input.sync="search"
                    @keyup.tab="updateTags"
                    @paste="updateTags"
                  ></v-combobox>
                </v-flex>
              </v-layout>
              <!-- <v-btn
                @click="onFormSubmit"
                color="primary"
                class="col-12"
                medium
              >
                {{ $t("message.save") }}
              </v-btn> -->
            </v-form>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <!-- <v-tabs>
				<v-tab>{{ $t('message.recentChat') }}</v-tab>
				<v-tab>{{ $t('message.previousChats') }}</v-tab>
				<v-tab-item>
					<v-list>
						<v-list-item v-for="item in recentChat" v-bind:key="item.id" >
							<v-list-item-avatar>
								<img v-bind:src="item.avatar"/>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title v-html="item.userName"></v-list-item-title>
							</v-list-item-content>
							<v-list-item-action>
								<v-icon v-bind:color="item.active ? 'primary' : 'grey'">chat_bubble</v-icon>
							</v-list-item-action>
						</v-list-item>
					</v-list>
				</v-tab-item>
				<v-tab-item>
					<v-list>
						<v-list-item v-for="item in previousChat" v-bind:key="item.id" >
							<v-list-item-avatar>
								<img v-bind:src="item.avatar"/>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title v-html="item.userName"></v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-tab-item>
			</v-tabs> -->
  </div>
</template>
	


<script>
import { Bus } from "@/utils/bus";
import { mapGetters } from "vuex";

export default {
  name: "PopupPhase",
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
    ...mapGetters(["getProcProcedures"]),
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
    comment() {
      delete this.phaseForm.id;

      let payload = {
        procedure_id: this.getProcProcedures.id,
        name: this.phaseForm.name,
        description: this.phaseForm.description,
        tags: this.phaseForm.tags,
        color: this.phaseForm.color,
      };

      this.$store.dispatch("addPhase", payload);
    },
  },
};
</script>

<style>
</style>