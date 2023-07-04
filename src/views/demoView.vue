<template>
  <div class="demoView">
    <si-list-drop-down
        @some-data-changed="logAnswer"
        :global-options="list"
        :disable-add="true"
        :disable-delete="false"
        :initial-dropdowns="testDropdown"
    />
  </div>
</template>

<script lang="ts">
import SiListDropDown from "../components/siListDropDown.vue";

export default {
  name: 'DemoView',
  components: {SiListDropDown},
  data(){
    return{
      list:[
        { key: '0', text: 'Netherlands' },
        { key: '1', text: 'Germany' },
        { key: '2', text: 'United Kingdom' },
        { key: '3', text: 'Poland' },
        { key: '4', text: 'Italy' },
        { key: '5', text: 'Spain' },
      ],
      testDropdown: [
        {
          name: 'test',
          options: ['1','2', '5']
        },
        {
          name: 'test2',
          options: ['1','2', '4']
        }
      ]
    }
  },
  methods:{
    logAnswer(e: any){
        console.log(e)
    }
  }
};
</script>

<style scoped>

</style>
