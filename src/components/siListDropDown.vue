<template>
  <div>
    <p v-if="error">{{errorTxt}}</p>
      <draggable v-model="dropDownL" :animation="300" class="siListDropdown">
          <template  #item="{element: items}">
            <div class="siListDropdown__container">
              <v-autocomplete
                  item-disabled="disable"
                  class="siListDropdown__select"
                  v-model="selectedItems[getItemKey(items)]"
                  :label="items.name"
                  :items="getOptionsForDropDown(items)"
                  variant="underlined"
              >
              </v-autocomplete>
            </div>
        </template>
    </draggable>
    <button :disabled="dropDownL.length===0" @click="deleteDropdown">-</button>
    <button :disabled="dropDownL.length === options.length" @click="showDDCreation">+</button>
    <div v-if="creationProc">
      <v-form @submit.prevent="createDropDown">
        <h3>Select lable and options for dropdown</h3>
        <v-text-field :rules="labelRule" v-model="labelNew" label="Label"></v-text-field>
        <div v-for="opt in options" :key="opt.key">
          <v-checkbox :rules="haveTrue" v-model="selectedOptions[opt.key]" :label="opt.text"></v-checkbox>
        </div>
        <v-btn type="submit" block>Submit</v-btn>
      </v-form>
    </div>
    </div>
</template>

<script lang="ts">

import {dropDownOptions, dropDown} from "../models/dropdown.model";
import draggable from 'vuedraggable';

export default {
  name: "siListDropDown",
  components:{
    draggable
  },
  props:{
    globalOptions:{
      type: Array,
      required: true,
    },
    disableDelete: {
      type: Boolean,
      default: false,
    },
    disableAdd: {
      type: Boolean,
      default: false,
    },
    initialDropdowns: {
      type: Array,
      default: () => [],
    },
  },
  emits:['someDataChanged'],
  data(){
    return{
      dropDownL: Array<dropDown>(),
      selectedItems: {},
      options: Array<dropDownOptions>(),
      creationProc: false,
      selectedOptions: [],
      labelNew: '',
      labelRule: [
        value => {
          if (value) return true
          return 'You must enter label.'
        },
      ],
      haveTrue: [
        () => {
            // @ts-ignore-next-line
          if (this.selectedOptions.length > 0 && this.selectedOptions.some((value) => value === true)) return true
          return 'You must enter label.'
        },
      ],
      error: false,
      errorTxt: '',
    }
  },
  watch:{
    selectedItems: {
      handler(newValue){
        const hasDuplicates = new Set(Object.values(newValue)).size !== Object.values(newValue).length;
        if(hasDuplicates){
          this.error = true;
          this.errorTxt = 'you have duplications'
        } else {
          this.error = false;
          this.errorTxt = ''
          this.createDataForParent()

        }
      },
      deep: true,
    },
  },
  created() {
    this.createOptionsList();
    if(this.initialDropdowns.length > 0){
      this.createDropdownList();
    }
  },
  methods:{
    getOptionsForDropDown(dropDown: dropDown){
      const text = Array<string>();
      if(this.options.length> 0 && dropDown.options.length > 0){
        dropDown.options.forEach((el) => {
          const opText = this.options.find(opt => opt.key === el)
          text.push(opText.text);
        })
      }
      return text
    },
    createOptionsList(){
      this.globalOptions.forEach((el)=>{
        const option = {
          key: el.key,
          text: el.text,
          disable: true,
        }
        this.options.push(option)
      })
    },
    createDropdownList(){
      for (let i = 0; i < this.initialDropdowns.length; i++) {
        const dropdown = {
          key: i,
          name: this.initialDropdowns[i].name,
          options: this.initialDropdowns[i].options,
        }
        this.dropDownL.push(dropdown)
      }
    },
    deleteDropdown(){
      this.dropDownL.pop()
    },
    showDDCreation(){
      this.creationProc = true;
    },
    createDropDown(){
      let hasTrue = this.selectedOptions.some((value) => value === true);
      if(this.labelNew !== '' && hasTrue){
        const options = []
        for (let i = 0; i < this.selectedOptions.length; i++){
          if(this.selectedOptions[i]){
            options.push(i.toString())
          }
        }
        const dropDown = {
          key: this.dropDownL.length+ 1,
          name: this.labelNew,
          options: options,
        }
        this.dropDownL.push(dropDown);
        this.creationProc = false;
        this.labelNew = '';
        this.selectedOptions = []
      }
    },
    getItemKey(item){
      const key = this.dropDownL.find(el => el.key === item.key)
      return key.key
    },
    createDataForParent(){
      const answers = [];
      if(Object.keys(this.selectedItems).length > 0){
        Object.keys(this.selectedItems).forEach((key) => {
          const dropdown = this.dropDownL.find(el => el.key == key)
          dropdown.selected = this.options.find(el => el.text === Object.values(this.selectedItems)[key])
          answers.push(dropdown);
        })
        this.$emit('someDataChanged', answers)
      }
    }
  },
}
</script>

<style scoped lang="scss">
</style>
