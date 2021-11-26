<template>
  <div class="courses-detail-wrap">
    <page-title-bar></page-title-bar>
    <v-container class="grid-list-xl pt-0 mt-0" fluid>
      <!-- <procedure-detail-banner></procedure-detail-banner> -->
      <div class="course-detail">
        <v-row class="justify-center align-center">
          <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pt-0 mt-0">
            <v-row>
              <v-col cols="12" sm="12" md="8" lg="9" xl="9" class="pt-0 mt-0">
                <v-row>
                  <procedure-detail-learn></procedure-detail-learn>
                  <procedure-detail-desciption></procedure-detail-desciption>
                  <procedure-detail-overview></procedure-detail-overview>
                  <procedure-detail-instructor></procedure-detail-instructor>
                  <app-card
                    colClasses="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                    customClasses="more-courses-grid"
                    contentCustomClass="layout pt-0"
                    :heading="$t('message.moreCoursesFromJamesColt')"
                  >
                    <v-row class="align-start justify-start mx-0 mb-0">
                      <div class="course-item-wrap">
                        <procedure-card
                          :height="200"
                          :width="335"
                          :data="CourseData.procedureDetail.moreCourses"
                          :colxl="4"
                          :collg="4"
                          :colmd="4"
                          :colsm="6"
                          :cols="12"
                        ></procedure-card>
                      </div>
                    </v-row>
                  </app-card>
                </v-row>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="4"
                lg="3"
                xl="3"
                class="course-sidebar pt-0 mt-0"
              >
                <div class="custom-height-auto">
                  <procedure-detail-billing></procedure-detail-billing>
                  <app-card
                    contentCustomClass="pt-0"
                    heading="Contrary to popular belief ?"
                  >
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                    <a href="#" class="font-weight-bold primary-text"
                      >Nulla eu augue !</a
                    >
                  </app-card>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import CourseData from "./data";
import ProcedureDetailLearn from "./ProcedureWidgets/ProcedureDetailLearn";
//import ProcedureDetailBanner from "./ProcedureWidgets/ProcedureDetailBanner";
import ProcedureDetailDesciption from "./ProcedureWidgets/ProcedureDetailDescription";
import ProcedureDetailOverview from "./ProcedureWidgets/ProcedureDetailOverview";
import ProcedureDetailInstructor from "./ProcedureWidgets/ProcedureDetailInstructor";
import ProcedureCard from "./ProcedureWidgets/ProcedureCard";
import ProcedureDetailBilling from "./ProcedureWidgets/ProcedureDetailBilling";
export default {
  data() {
    return {
      CourseData,
    };
  },
  components: {
    //ProcedureDetailBanner,
    ProcedureDetailLearn,
    ProcedureDetailDesciption,
    ProcedureDetailOverview,
    ProcedureDetailInstructor,
    ProcedureCard,
    ProcedureDetailBilling,
  },
};
</script>
