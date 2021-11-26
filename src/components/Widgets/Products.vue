<template>
  <div>
    <v-row ref="pageWrapper">
      <template
        v-for="(details, index) in proceduresData.slice(0, pageLimit * 10)"
      >
        <app-card
          :id="index"
          colClasses="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12"
          :key="index"
        >
          <v-row class="contact-item-info">
            <v-col cols="12" lg="12" md="12" sm="12" class="text-center">
              <div class="tab-image">
                <!-- <router-link
                  :to="{ name: 'procedureDetails', params: { id: details.id } }"
                > -->
                <!--<img
                    :src="details.image"
                    style="width: 100%; height: 300px !important"
                  />-->
                <div v-if="!!details.image">
                  <img
                    :src="details.image.src"
                    style="width: 100% !important ; height: 200px !important"
                  />
                </div>
                <div v-else>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/g-rams.appspot.com/o/images%2Fproceedlogo.png?alt=media&token=505faaa9-4d4f-4e5a-b920-e044903e2a50"
                    style="width: 100% !important ; height: 200px !important"
                  />
                </div>
                <div v-if="details.owner.id == userID" class="d-flex">
                  <!-- <div v-if="details.owner.id == userID" class="d-flex"> -->
                  <v-btn
                    fab
                    dark
                    small
                    color="primary"
                    class="edit-btn"
                    :to="`/${'procedures/' + details.slug + '/edit/'}`"
                  >
                    <v-icon dark>edit</v-icon>
                  </v-btn>

                  <v-btn
                    fab
                    dark
                    small
                    color="primary"
                    class="edit-btn mt-12"
                    @click="deleteDialog(details)"
                  >
                    <v-icon dark>delete</v-icon>
                  </v-btn>
                </div>
                <!-- </router-link> -->
              </div>
            </v-col>
            <v-col cols="12" lg="12" md="12" sm="12" class="pt-0 border-top-1">
              <div class="d-flex justify-end mt-n8 mr-2">
                <v-avatar size="60">
                  <img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                    alt="John"
                  />
                </v-avatar>
              </div>
              <p class="fs-14 mb-3">
                {{ details.proc_categories.name }}
              </p>
              <h4 class="mb-3">
                {{ details.proc_collections.name }}: {{ details.name }}
              </h4>
              <small class="mb-3">{{
                details.description.substring(0, 100)
              }}</small>
              <!-- <span class="fs-14 d-inline-flex">
                <del>$ {{ details.price }}</del>
                 <span class="primary--text pl-3"
                  >${{ details.discountPriceValue }}</span
                > 
              </span>-->
              <div class="rating-text layout row wrap ma-0 pt-5">
                <v-rating color="warning" background-color="warning"></v-rating>
              </div>
            </v-col>
          </v-row>
          <v-row class="d-custom-flex justify-space-between">
            <div class="d-flex justify-space-between mr-3 ma-0">
              <v-icon color="grey">mdi-eye</v-icon>
              <p class="ma-2">2.3k</p>
            </div>
            <div v-if="details.owner.id != userID">
              <v-btn icon>
                <v-icon color="grey">favorite</v-icon>
              </v-btn>
              <v-btn icon class="mr-3">
                <v-icon color="grey">share</v-icon>
              </v-btn>
            </div>
            <!-- <v-btn icon>
              <v-icon class="grey--text">more_horiz</v-icon>
            </v-btn> -->
          </v-row>
        </app-card>
      </template>
    </v-row>
    <delete-confirmation-dialog
      ref="deleteConfirmationDialog"
      heading="Are You Sure You Want To Delete?"
      message="Are you sure you want to delete this Product permanently?"
      @onConfirm="DeleteProduct"
    >
    </delete-confirmation-dialog>
  </div>
</template>
<script>
import { getCurrentAppLayout } from "Helpers/helpers";
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

export default {
  components: {
    DeleteConfirmationDialog,
  },
  props: ["proceduresData"],
  data() {
    return {
      /*   products: this.productsData.men.concat(
        this.productsData.women,
        this.productsData.accessories,
        this.productsData.gadgets
      ),*/
      currentPage: "",
      selectItemToDelete: "",
      open: false,
      userID: "",
      pageLimit: 1,
    };
  },
  created() {
    var currentRoute = this.$route.path;
    var splitRoute = currentRoute.split("/");
    this.currentPage = splitRoute[3];
    let userData = JSON.parse(localStorage.getItem("user"));
    this.userID = userData.uid;
    window.addEventListener("scroll", this.handleScroll, true);
    // console.log("proceduresData", this.proceduresData);
    // console.log("UserData", userData);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      var element = this.$refs.pageWrapper;
      var position = element.getBoundingClientRect();
      if (position.bottom <= window.innerHeight) {
        this.pageLimit++;
      }
    },
    deleteDialog(item) {
      this.$refs.deleteConfirmationDialog.openDialog();
      this.selectItemToDelete = item;
    },
    DeleteProduct() {
      this.$refs.deleteConfirmationDialog.close();
      this.$store.dispatch("deleteProcProcedure", this.selectItemToDelete.id);
      // var index = this.proceduresData.indexOf(this.selectItemToDelete);
      // this.proceduresData.splice(index, 1);
    },
    openDialog() {
      this.open = true;
      console.log("dddd");
      this.$refs.deleteConfirmationDialog.openDialog();
    },
    close() {
      this.open = false;
    },
    getCurrentAppLayoutHandler() {
      return getCurrentAppLayout(this.$router);
    },
  },
};
</script>
<style scoped>
.delete-btn {
  position: absolute;
  right: 38px;
  top: 32px;
  cursor: pointer;
}
.edit-btn {
  position: absolute;
  right: 30px;
  top: 22px;
}
</style>