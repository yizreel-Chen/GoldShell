<template>
  <div class="debug">
    <div v-title>Debug</div>
    <v-card>
      <v-card-text>
        <v-tabs v-model="tab" centered background-color="indigo" @change="changeTab">
          <v-tab v-for="item in items" :key="item"> {{ item }} </v-tab>
        </v-tabs>
      </v-card-text>
    </v-card>
    <v-container v-if="tab !== 9">
      <v-container style="text-align: right">
        <v-btn @click="save" v-show="!isLoading" class="">save</v-btn>
      </v-container>
      <v-tabs-items v-model="tab" v-show="!isLoading">
        <v-tab-item v-for="item in items" :key="item">
          <pre>
            <code>
            {{ data }}
          </code>
          </pre>
        </v-tab-item>
      </v-tabs-items>
      <v-main style="text-align: center">
        <v-progress-circular :size="50" color="primary" indeterminate v-show="isLoading"></v-progress-circular>
      </v-main>
    </v-container>
    <v-container class="chart" v-else v-for="(chipItem, i) in icInfoList" :key="i">
      <v-card class="chart-item" flat>
        <v-card-title> Chip map {{ i + 1 }} </v-card-title>
        <v-card-text>
          <p v-for="(item, index) in chipItem.chipIndex" :key="index" class="clearfix">
            <span v-for="(child, childIndex) in item" :key="childIndex" :class="{ item: true, 'chip-color': child !== '' }">{{ child }}</span>
          </p>
          <v-container> </v-container>
        </v-card-text>
      </v-card>

      <v-card class="chart-item" flat>
        <v-card-title> Good cores {{ i + 1 }} </v-card-title>
        <v-card-text>
          <p v-for="(item, index) in chipItem.bist" :key="index" class="clearfix">
            <span v-for="(child, childIndex) in item" :key="childIndex" :class="{ item: true, 'core-color': child !== '' }">{{ child }}</span>
          </p>
        </v-card-text>
      </v-card>

      <v-card class="chart-item" flat>
        <v-card-title> Temp {{ i + 1 }} </v-card-title>
        <v-card-text>
          <p v-for="(item, index) in chipItem.temp" :key="index" class="clearfix">
            <span v-for="(child, childIndex) in item" :key="childIndex" :class="{ item: true, 'temp-color': child !== '' }">{{ child }}</span>
          </p>
        </v-card-text>
      </v-card>

      <v-card class="chart-item" flat>
        <v-card-title> Clock {{ i + 1 }} </v-card-title>
        <v-card-text>
          <p v-for="(item, index) in chipItem.tempDiff" :key="index" class="clearfix">
            <span v-for="(child, childIndex) in item" :key="childIndex" :class="{ item: true, 'clock-color': child !== '' }">{{ child }}</span>
          </p>
        </v-card-text>
      </v-card>

      <v-card class="chart-item" flat>
        <v-card-title> Nonce {{ i + 1 }} </v-card-title>
        <v-card-text>
          <p v-for="(item, index) in chipItem.perf" :key="index" class="clearfix">
            <span v-for="(child, childIndex) in item" :key="childIndex" :class="{ item: true, 'perf-color': child !== '' }">{{ child }}</span>
          </p>
        </v-card-text>
      </v-card>

      <v-card class="chart-item" flat>
        <v-card-title> HWErr {{ i + 1 }} </v-card-title>
        <v-card-text>
          <p v-for="(item, index) in chipItem.hwerr" :key="index" class="clearfix">
            <span v-for="(child, childIndex) in item" :key="childIndex" :class="{ item: true, 'hwerr-color': child !== '' }">{{ child }}</span>
          </p>
        </v-card-text>
      </v-card>

      <v-card class="chart-item" flat>
        <v-card-title> Reject {{ i + 1 }} </v-card-title>
        <v-card-text>
          <p v-for="(item, index) in chipItem.reject" :key="index" class="clearfix">
            <span v-for="(child, childIndex) in item" :key="childIndex" :class="{ item: true, 'hwerr-color': child !== '' }">{{ child }}</span>
          </p>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { getminerhistory, getdbgkmsg, getdbgsyslog, getdbgpsinfo, getdbgmeminfo, getdbgvsinfo, getdbgminerinfo, getminersyslog, getmonitorlog, getdbgicinfo } from '../api/dbg'
import { getmcbstatus } from '../api/mcb'
import { mapGetters } from 'vuex'
import chipListSort from '../utils/chip-map'
export default {
  data() {
    return {
      tab: 0,
      items: ['minerhistory', 'kmsg', 'syslog', 'ps', 'mem', 'release', 'miner', 'minersyslog', 'monitor', 'chips'],
      data: null,
      isLoading: false,
      chipMap: null,
      chipMapList: [],
      model: '',
      icInfo: {
        chipIndex: [],
        bist: [],
        temp: [],
        tempDiff: [],
        perf: [],
        hwerr: [],
        reject: []
      },
      icInfoList: [],
      chipMapIndex: null,
      temp: 0
    }
  },
  computed: {
    ...mapGetters({
      minerInfo: 'minerInfo'
    })
  },
  created() {
    this.getMinerHistory()
  },
  methods: {
    save() {
      const blob = new Blob([this.data])
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = this.items[this.tab] + '-' + new Date() + '.txt'
      link.click()
      URL.revokeObjectURL(link.href)
    },

    getMinerHistory() {
      this.isLoading = true
      getminerhistory()
        .then((res) => {
          this.data = res.body

          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    getDbgKmsg() {
      this.isLoading = true
      getdbgkmsg()
        .then((res) => {
          this.data = res.body
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    getDbgSystemLog() {
      this.isLoading = true
      getdbgsyslog()
        .then((res) => {
          this.data = res.body
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    getDbgPsInfo() {
      this.isLoading = true
      getdbgpsinfo()
        .then((res) => {
          this.data = res.body
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    getDbgMemInfo() {
      this.isLoading = true
      getdbgmeminfo()
        .then((res) => {
          this.data = res.body
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    getDbgVsInfo() {
      this.isLoading = true
      getdbgvsinfo()
        .then((res) => {
          this.data = res.body
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    getMinerSystemLog() {
      this.isLoading = true
      getminersyslog()
        .then((res) => {
          this.data = res.body
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    getMonitorLog() {
      this.isLoading = true
      getmonitorlog()
        .then((res) => {
          this.data = res.body
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    getDbgMinerInfo() {
      this.isLoading = true
      getdbgminerinfo()
        .then((res) => {
          this.data = res.body
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    getDbgIcInfo() {
      this.isLoading = true
      this.icInfoList = []
      getdbgicinfo()
        .then((res) => {
          this.chipMapList = JSON.parse(res.body).drawdata
          getmcbstatus()
            .then((res) => {
              this.model = res.model.split('-')[1]
              for (let index = 0; index < this.chipMapList.length; index++) {
                this.icInfo = {
                  chipIndex: [],
                  bist: [],
                  temp: [],
                  tempDiff: [],
                  perf: [],
                  hwerr: [],
                  reject: []
                }
                this.chipMap = this.chipMapList[index]
                chipListSort[this.model](this.chipMapList[index], this.dataFormat)
                this.icInfoList.push(this.icInfo)
              }
              this.isLoading = false
            })
            .catch(() => {
              this.isLoading = false
            })
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    dataFormat(i, j, type, model, value) {
      try {
        if (j !== this.chipMapIndex) {
          this.temp = 1
          this.icInfo.chipIndex[j] = new Array()
          this.icInfo.bist[j] = new Array()
          this.icInfo.temp[j] = new Array()
          this.icInfo.tempDiff[j] = new Array()
          this.icInfo.perf[j] = new Array()
          this.icInfo.hwerr[j] = new Array()
          this.icInfo.reject[j] = new Array()
        }
        if (type === 'push') {
          this.chipMap[i].chipindex !== undefined && this.icInfo.chipIndex[j].push(this.chipMap[i].chipindex)
          this.chipMap[i].bist !== undefined && this.icInfo.bist[j].push(this.chipMap[i].bist)
          this.chipMap[i].temp !== undefined && this.icInfo.temp[j].push(this.chipMap[i].temp)
          this.chipMap[i].tempdiff !== undefined && this.icInfo.tempDiff[j].push(this.chipMap[i].tempdiff)
          this.chipMap[i].perf !== undefined && this.icInfo.perf[j].push(this.chipMap[i].perf)
          this.chipMap[i].hwerr !== undefined && this.icInfo.hwerr[j].push(this.chipMap[i].hwerr)
          this.chipMap[i].vol !== undefined && this.icInfo.reject[j].push(this.chipMap[i].vol)
        } else if (type === 'unshift') {
          this.chipMap[i].chipindex !== undefined && this.icInfo.chipIndex[j].unshift(this.chipMap[i].chipindex)
          this.chipMap[i].bist !== undefined && this.icInfo.bist[j].unshift(this.chipMap[i].bist)
          this.chipMap[i].temp !== undefined && this.icInfo.temp[j].unshift(this.chipMap[i].temp)
          this.chipMap[i].tempdiff !== undefined && this.icInfo.tempDiff[j].unshift(this.chipMap[i].tempdiff)
          this.chipMap[i].perf !== undefined && this.icInfo.perf[j].unshift(this.chipMap[i].perf)
          this.chipMap[i].hwerr !== undefined && this.icInfo.hwerr[j].unshift(this.chipMap[i].hwerr)
          this.chipMap[i].vol !== undefined && this.icInfo.reject[j].unshift(this.chipMap[i].vol)
        }
        // 数据空格
        if (this.temp === value && model === 'space') {
          this.chipMap[i].chipindex !== undefined && this.icInfo.chipIndex[j].unshift('')
          this.chipMap[i].bist !== undefined && this.icInfo.bist[j].unshift('')
          this.chipMap[i].temp !== undefined && this.icInfo.temp[j].unshift('')
          this.chipMap[i].tempdiff !== undefined && this.icInfo.tempDiff[j].unshift('')
          this.chipMap[i].perf !== undefined && this.icInfo.perf[j].unshift('')
          this.chipMap[i].hwerr !== undefined && this.icInfo.hwerr[j].unshift('')
          this.chipMap[i].vol !== undefined && this.icInfo.reject[j].unshift('')
        }
        this.temp = this.temp + 1
        this.chipMapIndex = j
      } catch (error) {
        console.log(error)
      }
    },

    changeTab() {
      this.data = ''
      this.tab === 0 && this.getMinerHistory()
      this.tab === 1 && this.getDbgKmsg()
      this.tab === 2 && this.getDbgSystemLog()
      this.tab === 3 && this.getDbgPsInfo()
      this.tab === 4 && this.getDbgMemInfo()
      this.tab === 5 && this.getDbgVsInfo()
      this.tab === 6 && this.getDbgMinerInfo()
      this.tab === 7 && this.getMinerSystemLog()
      this.tab === 8 && this.getMonitorLog()
      this.tab === 9 && this.getDbgIcInfo()
    }
  }
}
</script>

<style lang="scss">
.chart {
  margin-left: 30px;
  .chart-item {
    margin-bottom: 20px;
  }
  .item {
    float: left;
    text-align: center;
    width: 80px;
    height: 80px;
    line-height: 80px;
    color: #fff;
    background-color: #eee;
    border: 1px solid #fff;
    &.chip-color {
      background-color: rgb(125, 232, 146);
    }
    &.core-color {
      background-color: rgb(128, 255, 0);
    }
    &.temp-color {
      background-color: rgb(255, 26, 0);
    }
    &.clock-color {
      background-color: rgb(140, 255, 0);
    }
    &.perf-color {
      background-color: rgb(0, 229, 255);
    }
    &.hwerr-color {
      background-color: rgb(0, 170, 255);
    }
  }
  .clearfix {
    &:after {
      visibility: hidden;
      display: block;
      font-size: 0;
      content: '';
      clear: both;
      height: 0;
    }
  }
}
</style>
