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
    <div class="addButton" @click="addVariant">+</div>
    <div class="fitButton" @click="fitModel">fit</div>
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
    const gn = new GyroNorm();

    gn.init({frequency:10}).then(() => {
      gn.start((data) => {
        if (!this.recording) {
          return;
        }

        for (let i in data.dm) {
          if (!this.currentExample[i]) {
            this.currentExample[i] = [];
          }
          this.currentExample[i].push(data.dm[i])
        }
      });
    }).catch(function(e){
      console.log(e);
    });

  },

  methods: {
    addVariant: function() {
      this.examples.push([]);
    },
    selectVariant: function(index) {
      this.currentVariant = index;
    },

    startRecord: function() {
      this.currentExample = {};
      this.recording = true;
    },

    endRecord: function() {
      this.recording = false;
      const resizedArr = {};
        
        for (let i in this.currentExample) {
          // this.logs.push(this.currentExample[i].length);
          resizedArr[i] = normalizeArr(smartResizeArr(this.currentExample[i], 100));
        }

        if (this.model) {
          this.check(resizedArr);
        } else {
          this.examples[this.currentVariant].push(resizedArr);
        }
    },


    check: async function (data) {
      try {
        let x = [];

        for (let j in data) {
          x = [...x, ...data[j]];
        }

        const dataXt = tf.tensor2d([x]);

        const res = this.model.predict(dataXt);
        const arr = res.arraySync()[0];
        arr.forEach((val, i) => {
          if (val > 0.5) {
            this.currentVariant = i;
          }
        });
        
        dataXt.dispose();
        res.dispose();


      } catch (err) {
        this.logs.push(err.message);
      }
      
    },

    
    fitModel: async function() {
      this.model = tf.sequential();

      const layer1 = tf.layers.dense({inputShape: [900], units: 10, activation: 'sigmoid'});
      const layer2 = tf.layers.dense({units: this.examples.length, activation: 'sigmoid'});

      this.model.add(layer1);
      this.model.add(layer2);

      this.model.compile({
        optimizer: tf.train.sgd(0.5),
        loss: 'meanSquaredError'
      });

      const dataX = [];
      const dataY = [];

      for (let i = 0; i < this.examples.length; i++) {
        for (let example of this.examples[i]) {
          const y = new Array(this.examples.length).fill(0);
          y[i] = 1;
          dataY.push(y);

          const x = [];

          for (let j in example) {
            x = [...x, ...example[j]];
          }

          dataX.push(x);
        }
      }
      
      const dataXt = tf.tensor2d(dataX);
      const dataYt = tf.tensor2d(dataY);


      await this.model.fit(dataXt, dataYt, { 
        shuffle: true,
        epochs: 500,
        batch: 10,
        callbacks: {
          onEpochEnd: (data, logs) => {
            this.loss = logs.loss
          }
        }
      });

      dataXt.dispose();
      dataYt.dispose();

      this.logs.push('ok');
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

.addButton {
  width:50px;
  height:50px;
  background: lightgreen;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fitButton {
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

