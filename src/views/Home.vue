<template>
  <div class="px-4 home">
    <div v-title>{{ $t('BUTTON_ASIDE_HOME') }} {{ minerInfo.model }}</div>
    <v-row>
      <v-col cols="12" md="8" lg="8" xl="8">
        <v-card outlined tile v-if="!isLoading">
          <v-card-title>
            {{ $t('HOME_MINER_STATUS') }}
            <v-spacer></v-spacer>
            <v-btn text color="primary" v-show="isError" @click="$router.push('/config')">{{ $t('MINER_POOL_SETTINGS') }}</v-btn>
          </v-card-title>
          <v-card-text v-if="isError" class="text-center">
            <v-container>
              <v-icon color="blue-grey" x-large>mdi-lightbulb-on</v-icon>
            </v-container>
            <v-container v-if="minerStatus === 0">{{ $t('HOME_NOMINER_DISCONNECT_WARNING') }}</v-container>
            <v-container v-else-if="minerStatus === 1">{{ $t('HOME_NOMINER_FANERR_WARNING') }}</v-container>
            <v-container v-else>{{ $t('HOME_NOMINER_WARNING') }}</v-container>
            <v-container>{{ $t('HOME_NOMINER_WARNING1') }}</v-container>
          </v-card-text>
          <v-card-text v-else>
            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <span>{{ $t('HOME_AV_HASHRATE') }}</span>
                <span class="float-right item-value item-width">
                  {{ $common.hashrateConversion(total.avHashrate) }}
                </span>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <span>{{ $t('HOME_FAN_SPEED') }}</span>
                <span class="float-right item-value item-width">
                  {{ hashrateInfo.fanspeed.replace(/rpm/g, '') }}
                </span>
              </v-col>

              <v-col cols="12" md="6" lg="6" xl="6">
                <span>{{ $t('HOME_HW_ERR') }}</span>
                <span class="float-right item-value item-width" v-if="hashrate.length !== 0"> {{ ((total.hwerrRation * 100) / hashrate.length).toFixed(2) }}% </span>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <span>{{ $t('HOME_REJECT_RATE') }}</span>
                <span class="float-right item-value item-width" v-if="hashrateInfo.rejected !== 0 || hashrateInfo.accepted !== 0">
                  {{ ((total.rejected / (total.rejected + total.accepted)) * 100).toFixed(2) }}%
                </span>
                <span class="float-right item-value item-width" v-else>0.00%</span>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <span>{{ $t('HOME_POWER_PLAN') }}</span>
                <span class="float-right item-value item-width">
                  {{ $t(powerPlan[hashrateInfo.powerplan]) }}
                </span>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <span>{{ $t('HOME_ONLINE_FOR') }}</span>
                <span class="float-right item-value item-width">
                  {{ $common.minute2string(hashrateInfo.time) }}
                </span>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <span>{{ $t('HOME_TEMPRATURE') }}</span>
                <span class="float-right item-value item-width">
                  {{ total.temp0 }}
                  <span v-if="hashrateInfo.temp.indexOf('/') !== -1"> / {{ total.temp1 }} </span>
                </span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`" v-else>
          <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4">
        <v-card outlined tile v-if="!isMinerInfoLoading">
          <v-card-title>{{ minerInfo.model }}</v-card-title>
          <v-card-text>
            <p>
              <span>{{ $t('HOME_MODEL') }} </span>
              <span class="float-right item-value">{{ minerInfo.model }}</span>
            </p>
            <p>
              <span>{{ $t('HOME_FIRMWARE') }}</span>
              <span class="float-right item-value">{{ minerInfo.firmware }}</span>
            </p>
            <p>
              <span>{{ $t('HOME_HARDWARE') }}</span>
              <span class="float-right item-value">{{ minerInfo.hardware }}</span>
            </p>
          </v-card-text>
        </v-card>
        <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`" v-else>
          <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- 算力图表 -->
    <v-card class="mt-6" outlined tile>
      <v-card-title>{{ $t('HOME_HASHRATE_CHART') }}</v-card-title>
      <div class="chart-box" v-if="!isError">
        <line-chart :chart-data="dataCollection" :options="options" :height="170"></line-chart>
      </div>
    </v-card>

    <!-- 计算板数据显示 -->
    <v-row>
      <v-col cols="12" md="3" lg="3" xl="3" v-for="(item, index) in hashrate" :key="index">
        <v-card class="mt-6" outlined tile>
          <v-card-title> CPB{{ index }} </v-card-title>
          <v-card-text v-if="item.minerstatus === 0">
            <div class="pt-1">
              <span>{{ $t('HOME_HASHRATE') }}</span>
              <span class="float-right item-value">{{ $common.hashrateConversion(item.hashrate) }}</span>
            </div>
            <div class="pt-1">
              <span>{{ $t('HOME_TEMPRATURE') }}</span>
              <span class="float-right item-value">{{ item.temp }}</span>
            </div>
            <div class="pt-1">
              <span>Nonces</span>
              <span class="float-right item-value">{{ item.nonces }}</span>
            </div>
            <div class="pt-1">
              <span>{{ $t('OPACCEPT') }}</span>
              <span class="float-right item-value">{{ item.accepted }}</span>
            </div>
            <div class="pt-1">
              <span>{{ $t('HOME_HW_ERR') }}</span>
              <span class="float-right item-value">{{ item.hwerrors }}</span>
            </div>
            <div class="pt-1">
              <span>{{ $t('HOME_REJECT') }}</span>
              <span class="float-right item-value">{{ item.rejected }}</span>
            </div>
          </v-card-text>
          <v-card-text v-else>
            <p class="text-h6 text-center red--text">
              {{ $t(errorMsg[item.minerstatus]) }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LineChart from '../components/LineChart.vue'
import { getmcbcgminer } from '../api/mcb'
import { getcpbhshistory } from '../api/cpb'
import { mapGetters } from 'vuex'
import 'chartjs-plugin-streaming'
export default {
  name: 'Home',
  components: {
    LineChart
  },
  inject: {
    theme: {
      default: { isDark: false }
    }
  },
  data() {
    return {
      open: true,
      minerStatus: null,
      isError: false,
      isMinerInfoLoading: false,
      right: null,
      isLoading: false,
      trigger: null,
      powerPlan: ['MINER_LEVEL0', 'MINER_LEVEL1', 'MINER_LEVEL2'],
      errorMsg: ['', 'HOME_MINER_INACTIVE_NOTE_NORMAL', 'HOME_MINER_INACTIVE_NOTE_OVERTEMP', 'HOME_MINER_INACTIVE_NOTE_OVERHEAT', 'HOME_MINER_ILLEGAL_NOTE'],
      hashrateList: [],
      hashrate: [],
      dataCollection: {},
      options: {},
      hashrateInfo: {},
      total: {
        accepted: 0,
        avHashrate: 0,
        hwerrRation: 0,
        rejected: 0,
        temp0: 0,
        temp1: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      language: 'language',
      minerInfo: 'minerInfo'
    })
  },
  watch: {
    language() {
      this.fillData()
    }
  },
  created() {
    this.isLoading = true
    this.getMinerInfo()
    this.getHashrateChart()
    this.trigger = setInterval(() => {
      this.getMinerInfo()
    }, 3000)
  },
  methods: {
    getMinerInfo() {
      const params = {
        cgminercmd: 'devs'
      }
      getmcbcgminer(params)
        .then((res) => {
          this.minerStatus = res.status
          this.isError = this.minerStatus === 1 || this.minerStatus === 0
          if (!this.isError) {
            this.hashrateInfo = res.data[0]
            this.hashrate = res.data
            this.total = {
              accepted: 0,
              avHashrate: 0,
              hwerrRation: 0,
              rejected: 0,
              temp0: 0,
              temp1: 0
            }
            var arr1 = []
            var arr2 = []
            var temp = ''
            for (let index = 0; index < this.hashrate.length; index++) {
              this.total.avHashrate = this.total.avHashrate + this.hashrate[index]['av_hashrate']
              this.total.accepted = this.total.accepted + this.hashrate[index]['accepted']
              this.total.hwerrRation = this.total.hwerrRation + this.hashrate[index]['hwerr_ration']
              this.total.rejected = this.total.rejected + this.hashrate[index]['rejected']
              if (this.hashrate[index]['temp'].indexOf('/') !== -1) {
                temp = this.hashrate[index]['temp'].split(' / ').join('').split('°C')

                if (parseFloat(temp[0]) > 0) {
                  arr1.push(parseFloat(temp[0]))
                }
                if (parseFloat(temp[1]) > 0) {
                  arr2.push(parseFloat(temp[1]))
                }
              } else {
                temp = this.hashrate[index]['temp'].split('°C')
                if (parseFloat(temp[0]) > 0) {
                  arr1.push(parseFloat(temp[0]))
                }
              }
            }
            this.getAvgTemp(arr1, arr2)
          }
          this.isLoading = false
        })
        .catch(() => {
          this.hashrate = []
          this.isLoading = false
          this.isError = true
        })
    },

    getAvgTemp(arr1, arr2) {
      var sum1 = 0
      var sum2 = 0
      for (let index = 0; index < arr1.length; index++) {
        sum1 = sum1 + arr1[index]
      }

      for (let index = 0; index < arr2.length; index++) {
        sum2 = sum2 + arr2[index]
      }

      if (arr1.length !== 0) {
        this.total.temp0 = (sum1 / arr1.length).toFixed(1)
      }
      if (arr2.length !== 0) {
        this.total.temp1 = (sum2 / arr2.length).toFixed(1)
      }
    },

    getHashrateChart() {
      getcpbhshistory()
        .then((res) => {
          this.hashrateList = res
          this.fillData()
        })
        .catch(() => {
          this.$snackbar.error(this.$t('WARNING_GETHSHISTORY'))
        })
    },

    fillData() {
      let timeList = []
      let mytime = Date.parse(new Date())
      for (let index = 0; index < 288; index++) {
        timeList.unshift(mytime - index * 60000)
      }
      this.dataCollection = {
        labels: timeList,
        type: 'line',
        datasets: [
          {
            label: this.$t('HOME_HASHRATE'),
            backgroundColor: 'rgba(124, 181, 236, 0.2)',
            borderColor: 'rgba(124, 181, 236, 1)',
            data: this.hashrateList,
            borderWidth: 3,
            pointRadius: 0
          }
        ]
      }
      this.options = {
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem) => {
              return this.$t('HOME_HASHRATE') + '：' + this.$common.hashrateConversion(tooltipItem.yLabel)
            }
          }
        },
        scales: {
          xAxes: [
            {
              time: {
                displayFormats: {
                  millisecond: 'HH:mm',
                  second: 'HH:mm',
                  minute: 'HH:mm',
                  hour: 'HH:mm',
                  day: 'HH:mm',
                  week: 'HH:mm',
                  month: 'HH:mm',
                  quarter: 'HH:mm',
                  year: 'HH:mm'
                },
                tooltipFormat: 'YYYY-MM-DD HH:mm:ss',
                unitStepSize: 30
              },
              type: 'realtime',
              realtime: {
                onRefresh: (chart) => {
                  chart.data.datasets.forEach((dataset) => {
                    getcpbhshistory().then((response) => {
                      this.hashrateList = response
                      dataset.data.push(this.hashrateList[this.hashrateList.length - 1])
                      chart.data.labels.push(Date.now())
                      dataset.data.shift()
                      chart.data.labels.shift()
                    })
                  })
                },
                duration: 17100000,
                refresh: 60000,
                delay: 120000
              }
            }
          ],
          yAxes: [
            {
              type: 'linear',
              display: true,
              ticks: {
                min: 0,
                userCallback: (tick) => {
                  return this.$common.dataFormat(tick, this.$common.unitFormat(this.hashrateList))
                }
              }
            }
          ]
        }
      }
    }
  },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.trigger)
    next()
  }
}
</script>
<style lang="scss" scoped>
.home {
  margin: 0 auto;
  .chart-box {
    padding: 12px;
  }
  .item-value {
    font-weight: 700;
    color: #111;
    font-size: 12px;
  }
  .item-width {
    text-align: right;
    width: 170px;
  }
}
</style>
