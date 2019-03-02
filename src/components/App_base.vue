<template>
  <div class="app">
    <div class="variants">
      <div 
        v-for="(example, index) in examples"
        :key="index"
        class="variant"
        :class="{
          active: index == currentVariant
        }"
        @click="selectVariant(index)"
      >
        {{examples[index].length}}
      </div>
    </div>
    recording: {{recording}}<br />
    <!-- examples: {{examples}}<br /> -->
    logs: {{logs}}
    <p v-if="loss">{{loss}}</p>
    <div class="AddButton" @click="addVariant">+</div>
    <div class="FitButton" @click="fitModel" value="fit"/>
    <div class="recordButton" v-touch:start.prevent="startRecord" v-touch:end.prevent="endRecord"></div>
  </div>
</template>

<script>
import GyroNorm from 'gyronorm';
import {smartResizeArr, normalizeArr} from '../assets/index.js';
import * as tf from '@tensorflow/tfjs';

export default {
  name: 'App',

  data: function() {
    return {
      examples: [[]],
      currentVariant: 0,
      currentExample: {},
      recording: false,
      model: null,
      logs: [],
      loss: 1,
    }
  },

  mounted: function() {
    

  },

  methods: {
    addVariant: function() {
      this.examples.push([]);
    },
    selectVariant: function(index) {
      this.currentVariant = index;
    },

    startRecord: function() {
      this.recording = true;
    },

    endRecord: function() {
      this.recording = false;
    },


    check: async function (data) {
      
    },

    
    fitModel: async function() {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.variants {
  display: flex;
  justify-content: space-around;
}

.variant {
  border: 3px solid red;
  padding: 50px;
  background: red;
  border-radius: 50px;
}

.AddButton {
  width:50px;
  height:50px;
  background: lightgreen;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.FitButton {
  width:50px;
  height:50px;
  background: magenta;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.variant.active {
  border-color: black;
}

.recordButton {
  position: fixed;
  bottom:0%;
  left: 50%;
  margin-left: -50px;
  background: blue;
  border-radius: 100px;
  height: 100px;
  width: 100px;
  vertical-align: middle;
  text-align: center;
}
</style>

