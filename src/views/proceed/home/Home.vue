<template>
  <div>
    <!-- <page-title-bar></page-title-bar> -->
    <v-container fluid pt-0 grid-list-xl>
      <!-- Actions -->
      <v-row class="pa-3 align-items-center justify-space-between">
        <div class="title">
          <h3 class="mb-0">{{ $t("message" + "." + viewType) }}</h3>
        </div>
        <div class="text-right project-icon">
          <v-icon
            class="mr-2"
            :class="{ active: isActive == 'grid' }"
            style="cursor: pointer"
            @click="girdView()"
            >apps</v-icon
          >
          <v-icon
            :class="{ active: isActive == 'list' }"
            style="cursor: pointer"
            @click="listView()"
            >list</v-icon
          >
        </div>
      </v-row>
      <div class="d-md-inline-flex mb-5">
        <v-select
          :items="type"
          label="Type"
          class="mr-md-5 select-width-150"
        ></v-select>
        <v-select
          :items="recent"
          label="Recent"
          class="mr-md-5 select-width-150"
        ></v-select>
        <v-select
          :items="noOfItems"
          label="No of Items"
          class="select-width-150"
        ></v-select>
      </div>
      <!-- grid view			 -->
      <div v-show="selectedView == 'grid'">
        <products :productsData="getProcProcedures"></products>
      </div>
      <!-- list view -->
      <v-row class="align-center search-wrap">
        <v-col cols="12" sm="10" md="8" lg="8" class="mx-auto">
          <div v-show="selectedView == 'list'">
            <productslist :productsData="getProcProcedures"></productslist>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { dbProcProceduresRef } from "@/firebase";
import Products from "Components/Widgets/Products";
import Productslist from "Components/Widgets/ProductsList";
import { productsData } from "Views/ecommerce/data.js";
export default {
  components: {
    Products,
    Productslist,
  },
  data() {
    return {
      productsData,
      type: ["Men", "Women", "Gadgets", "Accessories"],
      recent: ["This Week", "This Month", "Past Month"],
      noOfItems: ["10", "20", "30"],
      viewType: "projectGrid",
      selectedView: "grid",
      isActive: "grid",
    };
  },
  methods: {
    listView() {
      this.viewType = "projectList";
      this.selectedView = "list";
      this.isActive = "list";
    },
    girdView() {
      this.viewType = "projectGrid";
      this.selectedView = "grid";
      this.isActive = "grid";
    },
  },
  created() {
    this.$store.dispatch("setProcProcedureRef", dbProcProceduresRef);
  },
  computed: {
    ...mapGetters(["getProcProcedures"]),
  },
};
</script>
