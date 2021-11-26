<template>
  <div>
    <page-title-bar></page-title-bar>
    <v-container fluid class="grid-list-xl pt-0 mt-n3">
      <v-row>
        <v-col cols="12" md="12" lg="12" sm="12" class="col-height-auto">
          <div>
            <user-detail></user-detail>
            <div class="profile-body">
              <app-card>
                <userInfoChange></userInfoChange>
              </app-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import UserDetail from "Components/Widgets/UserDetail";
import UserInfoChange from "Components/Widgets/UserInfoChange";

export default {
  components: {
    UserDetail,
    UserInfoChange,
  },
};
</script>
