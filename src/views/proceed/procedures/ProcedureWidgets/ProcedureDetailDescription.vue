<template>
  <app-card
    class="detail-dec-wrap"
    colClasses="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
    :heading="$t('message.description')"
    contentCustomClass="pt-0"
  >
    <p class="font-weight-bold mrgn-b-sm">
      {{ CourseData.procedureDetail.description.title }}
    </p>
    <p>{{ CourseData.procedureDetail.description.content }}</p>
    <ul>
      <li
        v-for="(feature, key) of CourseData.procedureDetail.description
          .features"
        :key="key"
      >
        {{ feature }}
      </li>
    </ul>
  </app-card>
</template>

<script>
import CourseData from "../data";
export default {
  data() {
    return {
      CourseData,
    };
  },
};
</script>