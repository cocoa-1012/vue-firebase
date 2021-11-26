<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      absolute
      color="white"
      app
      class="elevation-0"
    >
      <v-sheet color="white" class="pa-4" fixed outlined thin>
        <v-avatar
          class="mb-4"
          color="grey darken-1"
          size="64"
          :src="this.currentUser.photoUrl"
        ></v-avatar>

        <div>{{ this.currentUser.email }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item v-for="[icon, text] in links" :key="icon" link>
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <v-col v-for="card in cards" :key="card" cols="12">
            <v-card>
              <v-subheader>{{ card }}</v-subheader>

              <v-list two-line>
                <template v-for="n in 6">
                  <v-list-item :key="n">
                    <v-list-item-avatar color="grey darken-1">
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Message {{ n }}</v-list-item-title>

                      <v-list-item-subtitle>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Nihil repellendus distinctio similique
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider
                    v-if="n !== 6"
                    :key="`divider-${n}`"
                    inset
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    cards: ["Today", "Yesterday"],
    drawer: null,
    links: [
      ["mdi-view-quilt", "My Collections"],
      ["mdi-checkbox-blank", "My Procedures"],
      /*  ["mdi-clipboard-text", "Description"],
      ["mdi-source-commit", "Activities"],
      ["mdi-clipboard-list-outline", "Phases"],
      ["mdi-source-commit", "Actions"],*/
    ],
  }),

  created() {},
  computed: {
    currentUser: {
      get() {
        return JSON.parse(localStorage.getItem("userSession"));
      },
    },
  },
};
</script>

<!-- <template>
  <v-container>
    <v-row>
      <v-text-field
        placeholder="Add title"
        class="procedureTitle col-10"
      ></v-text-field>
      <v-btn
        @click="onFormSubmit"
        :disabled="!valid"
        color="primary"
        class="col-1 col-auto offset-lg-1"
        medium
      >
        {{ $t("message.save") }}
      </v-btn>
    </v-row>
    <v-row>
      <v-col cols="12" lg="2" md="2">
        <v-select
          prepend-icon="mdi-lock"
          placeholder="Privacity"
          box
          :items="names"
          item-value="id"
          item-text="name"
          return-object
        >
          <template slot="selection" slot-scope="{ item }">
            {{ item.name }}
          </template>
          <template slot="item" slot-scope="{ item }">
            {{ item.name }}
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" lg="2" md="2">
        <v-select
          prepend-icon="mdi-eye"
          placeholder="Status"
          box
          :items="status"
          item-value="id"
          item-text="name"
          return-object
        >
          <template slot="selection" slot-scope="{ item }">
            {{ item.name }}
          </template>
          <template slot="item" slot-scope="{ item }">
            {{ item.name }}
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-tabs v-model="tab" align-with-title class="pt-10">
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <v-card flat style="border-top: 1px solid gray" class="rounded-0">
          <v-card-text v-text="text"></v-card-text>
          <v-row>
            <v-col cols="12">
              <v-icon>mdi-image</v-icon>
              <v-btn
                class="ma-2"
                color="primary"
                href="/procedures/new"
                elevation="0"
              >
                Add Image To Procedure
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-textarea
                prepend-icon="mdi-pencil"
                filled
                name="input-7-4"
                placeholder="Description"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field
                prepend-icon="mdi-tag-multiple"
                box
                placeholder="Tags"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                prepend-icon="mdi-format-list-numbers"
                box
                v-model="value"
                :items="getProcCategories"
                item-text="name"
                item-value="id"
                placeholder="Categories"
                multiple
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                prepend-icon="mdi-view-quilt"
                box
                v-model="collection"
                :items="getProcCollections"
                item-text="name"
                item-value="id"
                placeholder="Collection"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { dbProcCollectionsRef, dbProcCategoriesRef } from "@/firebase";
import { mapGetters } from "vuex";

export default {
  data: () => ({
    tab: null,
    items: ["Procedure Details", "Phases", "Activities"],
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    value: [],
    collection: [],
    names: [
      {
        id: 1,
        name: "Public",
        age: "Share with the community.",
        icon: "mdi-lock-open",
      },
      {
        id: 2,
        name: "Private",
        age: "You control access to this collection.",
        icon: "mdi-lock",
      },
    ],
    status: [
      { id: 1, name: "Publicated", age: "" },
      { id: 2, name: "Draft", age: "" },
    ],
  }),
  created() {
    this.$store.dispatch("setProcCollectionsRef", dbProcCollectionsRef);
    this.$store.dispatch("setProcCategoriesRef", dbProcCategoriesRef);
  },
  computed: {
    ...mapGetters([
      "getProcProcedures",
      "getProcCollections",
      "getProcCategories",
    ]),
  },
};
</script>

<style scooped>
.procedureTitle {
  font-size: 2.2em;
}

.v-tab {
  text-transform: none !important;
}

.col-xl,
.col-xl-auto,
.col-xl-12,
.col-xl-11,
.col-xl-10,
.col-xl-9,
.col-xl-8,
.col-xl-7,
.col-xl-6,
.col-xl-5,
.col-xl-4,
.col-xl-3,
.col-xl-2,
.col-xl-1,
.col-lg,
.col-lg-auto,
.col-lg-12,
.col-lg-11,
.col-lg-10,
.col-lg-9,
.col-lg-8,
.col-lg-7,
.col-lg-6,
.col-lg-5,
.col-lg-4,
.col-lg-3,
.col-lg-2,
.col-lg-1,
.col-md,
.col-md-auto,
.col-md-12,
.col-md-11,
.col-md-10,
.col-md-9,
.col-md-8,
.col-md-7,
.col-md-6,
.col-md-5,
.col-md-4,
.col-md-3,
.col-md-2,
.col-md-1,
.col-sm,
.col-sm-auto,
.col-sm-12,
.col-sm-11,
.col-sm-10,
.col-sm-9,
.col-sm-8,
.col-sm-7,
.col-sm-6,
.col-sm-5,
.col-sm-4,
.col-sm-3,
.col-sm-2,
.col-sm-1,
.col,
.col-auto,
.col-12,
.col-11,
.col-10,
.col-9,
.col-8,
.col-7,
.col-6,
.col-5,
.col-4,
.col-3,
.col-2,
.col-1 {
  width: 100%;
  padding: 5px !important;
}
</style>

-->