<template>
  <div>
    <!-- <page-title-bar></page-title-bar> -->
    <v-container fluid pt-0 grid-list-xl>
      <!--  <course-banner></course-banner>

     search box 
      <v-row class="align-items-center search-wrap">
        <v-col
          cols="12"
          sm="12"
          md="12"
          lg="12"
          class="align-items-center pt-0"
        >
          <app-card customClasses="mb-0 py-12">
            <v-row>
              <v-col cols="12" sm="12" md="12" lg="3" class="align-center">
                <h2 class="mb-0">Procedures</h2>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12" class="pb-0">
                <div class="d-flex search-field-wrap">
                  <div class="w-100">
                    <v-text-field class="pt-0 pr-4" label="Search Procedures">
                    </v-text-field>
                  </div>
                  <div>
                    <v-btn color="primary" class="my-0 ml-0 mr-2" medium
                      >Search</v-btn
                    >
                  </div>
                </div>
              </v-col>
            </v-row>
          </app-card>
        </v-col>
      </v-row>
     
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
      </v-row>-->

      <v-row class="align-items-center search-wrap">
        <v-col
          cols="12"
          sm="12"
          md="12"
          lg="12"
          class="align-items-center pt-0"
        >
          <app-card customClasses="mb-0 py-12">
            <v-row>
              <v-col cols="12" sm="12" md="12" lg="3" class="align-center">
                <h2 class="mb-0">Procedures</h2>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12" class="pb-0">
                <div class="d-flex search-field-wrap">
                  <div class="w-100">
                    <v-text-field
                      class="pt-0 pr-4"
                      label="Search Procedures"
                      @input="
                        (e) => {
                          filterParams.searchText = e;
                        }
                      "
                    >
                    </v-text-field>
                  </div>
                  <div>
                    <v-btn color="primary" class="my-0 ml-0 mr-2" medium
                      >Search</v-btn
                    >
                  </div>
                </div>
              </v-col>
            </v-row>
          </app-card>
        </v-col>
      </v-row>
      <p>
        <span style="color: red"> {{ procCategories.length }} </span> procedures
        found
      </p>
      <div class="d-md-inline-flex mb-5">
        <v-select
          :items="getProcCategories"
          item-text="name"
          item-value="name"
          label="Category"
          class="mr-md-5 select-width-150"
          @change="
            (e) => {
              filterParams.category = e;
            }
          "
        ></v-select>
        <v-select
          :items="recent"
          label="Recent"
          class="mr-md-5 select-width-150"
          @change="
            (e) => {
              filterParams.recent = e;
            }
          "
        ></v-select>
        <!-- <v-select
          :items="noOfItems"
          label="No of Items"
          class="select-width-150"
        ></v-select> -->
      </div>
      <!-- grid view			 -->
      <div v-show="selectedView == 'grid'">
        <products
          v-if="procCategories.length > 0"
          :proceduresData="procCategories"
        ></products>
      </div>
      list
      <!-- <v-row class="align-center search-wrap">
        <v-col cols="12" sm="10" md="8" lg="8" class="mx-auto">
          <div v-show="selectedView == 'list'">
            <productslist :proceduresData="getProcProcedures"></productslist>
          </div>
        </v-col>
      </v-row> -->
    </v-container>
  </div>
</template>
<script>
//import CourseBanner from "Views/courses/CourseWidgets/CourseBanner";
import { mapGetters } from "vuex";
import { dbProcProceduresRef, dbProcCategoriesRef } from "@/firebase";
import Products from "Components/Widgets/Products";
//import Productslist from "Components/Widgets/ProductsList";
import { productsData } from "Views/ecommerce/data.js";
import moment from "moment";

export default {
  components: {
    Products,
    //CourseBanner,
    // Productslist,
  },
  data() {
    return {
      productsData,
      type: ["Men", "Women", "Gadgets", "Accessories"],
      recent: ["This Week", "This Month", "Past Month"],
      viewType: "projectGrid",
      selectedView: "grid",
      isActive: "grid",
      procCategories: [],
      initialProcData: [],
      filterParams: {
        searchText: "",
        category: "",
        recent: "",
      },
      procLengh: 0,
      pageNumber: 2,
      pageRangeNumber: 5,
      pageListNumber: 3,
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
    isThisWeek(data) {
      var now = moment();
      var date = new Date(data * 1000);
      var input = moment(date);
      return now.isoWeek() == input.isoWeek();
    },
    isThisMonth(data) {
      var now = moment();
      var date = new Date(data * 1000);
      var input = moment(date);
      const getDate = (date) => moment(date, "DD/MM/YYYY").startOf("month");
      const diff = Math.abs(getDate(input).diff(getDate(now), "months"));
      return diff == 0;
    },
    isPastMonth(data) {
      var now = moment();
      var date = new Date(data * 1000);
      var input = moment(date);
      const getDate = (date) => moment(date, "DD/MM/YYYY").startOf("month");
      const diff = Math.abs(getDate(input).diff(getDate(now), "months"));
      return diff == 1;
    },
    selectedDate(date, value) {
      var selectedDate =
        value == "This Week"
          ? this.isThisWeek(date)
          : value == "This Month"
          ? this.isThisMonth(date)
          : this.isPastMonth(date);
      return selectedDate;
    },
  },
  computed: {
    ...mapGetters(["getProcProcedures", "getProcCategories"]),
  },
  watch: {
    filterParams: {
      deep: true,
      immediate: false,
      handler: function (val) {
        this.procCategories = this.getProcProcedures.filter(
          (item) =>
            (this.selectedDate(item.createAt.seconds, val.recent) ||
              !val.recent.length) &&
            (item.proc_categories.name == val.category ||
              !val.category.length) &&
            (item.name.includes(val.searchText) ||
              item.description.includes(val.searchText) ||
              item.proc_collections.name.includes(val.searchText) ||
              !val.searchText.length)
        );
      },
    },
  },
  created() {
    this.$store.dispatch("setProcProcedureRef", dbProcProceduresRef);
    this.$store.dispatch("setProcCategoriesRef", dbProcCategoriesRef);
  },
  mounted() {
    this.procCategories = this.getProcProcedures;
  },
};
</script>

<style scoped>
</style>