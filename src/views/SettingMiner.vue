<template>

  <div class="miner-setting " >


    <div v-title>{{ $t('BUTTON_ASIDE_MINER') }} {{ minerInfo.model }}</div>
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <v-card outlined>
          <v-card-title>
            <span>{{ $t('MINER_POOL_SETTINGS') }} </span>
            <lock />
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="addPool" :disabled="!isLogin">{{ $t('MINER_ADD') }}</v-btn>
          </v-card-title>
          <v-card-text>
            <draggable v-model="pools" @change="changePool">
              <transition-group>
                <v-list-item v-for="item in pools" :key="item.dragid">
                  <v-list-item-icon>
                    <v-btn :color="item.active ? 'success' : 'grey'" fab small dark>
                      <v-icon>mdi-shovel</v-icon>
                    </v-btn>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.user + '@' + item.url }}</v-list-item-title>
                  </v-list-item-content>
                  <v-btn outlined color="error" small @click="deletePool(item)" :disabled="!isLogin" :loading="poolLoading"> {{ $t('MINER_REMOVE') }} </v-btn>
                </v-list-item>
              </transition-group>
            </draggable>
          </v-card-text>
          <v-card-actions>
            <v-container class="tip">*{{ $t('MINER_POOLS_PRI_NOTE') }} </v-container>
          </v-card-actions>
        </v-card>

        <v-card outlined class="mt-4">
          <v-card-title @click="openManual"> {{ $t('TITLE_MINER') }} </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="8" md="6" lg="4" xl="4">
                <v-text-field v-model="minerConfig.name" :label="$t('MINER_NAME')" disabled></v-text-field>
                <v-select dense v-model="minerConfig.select" :items="powerPlans" :label="$t('HOME_POWER_PLAN')" @change="minerDisable = false" v-if="isPowerPlanShow">
                  <template v-slot:selection="{ item }">
                    {{ $t(item.text) }}
                  </template>
                  <template v-slot:item="{ item }">
                    {{ $t(item.text) }}
                  </template>
                </v-select>
                <v-text-field v-model="minerConfig.manualPowerplan" :label="$t('HOME_POWER_PLAN')" v-else @change="minerDisable = false"></v-text-field>
              </v-col>
            </v-row>
            <v-switch v-model="minerConfig.tempcontrol" :label="`${$t('MINER_TEMP')}（${$t('MINER_TEMP_NOTE')}）`" disabled></v-switch>
            <v-switch v-model="minerConfig.ledcontrol" :label="`${$t('MINER_LED')}（${$t('MINER_LED_NOTE')}）`" @change="minerDisable = false"></v-switch>

          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="updateMinerConfig()" :loading="minerLoading" :disabled="minerDisable">{{ $t('MINER_APPLY') }}</v-btn>
          </v-card-actions>
        </v-card>

        <v-card outlined class="mt-4">
          <v-card-title>
            {{ $t('MINER_ALGO_SETTING') }}
            <lock />
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="8" md="6" lg="4" xl="4">
                <v-select v-model="algos.algo_select" :items="algoList" :label="$t('MINER_ALGO_PLAN')" @change="algoDisable = false"></v-select>
              </v-col>
            </v-row>
            <div class="tip">*{{ $t('MINER_ALGO_PLAN_NOTE') }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="updateMinerAlgo" :disabled="!isLogin || algoDisable" :loading="algoLoading">{{ $t('MINER_APPLY') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="600">
      <v-form ref="form" v-model="valid">
        <v-card>
          <v-card-title>
            <span class="text-h5"> {{ $t('POOL_CONFIG') }} </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <span>{{ $t('POOL_PROTOCOL') }}：stratum+tcp</span>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="poolConfig.url" label="URL" placeholder="kda.ss.dxpool.com:6611" required :rules="urlRules"></v-text-field>
                  <v-btn class="mr-2" outlined color="blue darken-3" small v-for="item in algoPoolList" :key="item.id" @click="handlePool(item)">
                    <v-avatar size="24" left class="mr-2">
                      <img :src="poolLogo[item.name]" alt="" />
                    </v-avatar>
                    {{ item.name }}
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="poolConfig.user" :label="$t('POOL_USERNAME')" :rules="userRules"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="poolConfig.pass" :label="$t('POOL_PASSWORD')" type="password" :rules="passRules" :placeholder="$t('POOL_PASSWORD_PLA')"></v-text-field>
                </v-col>




              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog"> {{ $t('WARNING_CANCEL') }} </v-btn>
            <v-btn color="blue darken-1" text @click="submitPoolConfig"> {{ $t('POOL_APPLY') }} </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="delPoolDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> {{ $t('POOL_REMOVE') }} </v-card-title>
        <v-card-text>{{ $t('POOL_REMOVE_WARNING') }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="delPoolDialog = false"> {{ $t('WARNING_CANCEL') }} </v-btn>
          <v-btn color="primary" text @click="deletePoolConfig"> {{ $t('WARNING_ENSURE') }} </v-btn>
        </v-card-actions>
      </v-card>



    </v-dialog>



    <!-- RGB风扇设置 -->
    <v-card outlined class="mt-4">
      <v-card-title @click="openManual"> {{ $t('ARGB_FAN_SETTINGS') }} </v-card-title>
      <v-card-text>

        <!-- RGB风扇控制 -->
        <v-container >
          <!-- 模式控制 -->
          <v-subheader>{{ $t('MODE_SELECT') }}</v-subheader>
          <v-card-text
          >
            <v-row   >
              <v-col
                  class="d-flex"
                  cols="8"
                  sm="6"
              >
                <v-select
                    :items="rgb_modules"
                    @change="setMode('0x01')"
                ></v-select>
              </v-col>

            </v-row>
          </v-card-text>

          <!-- 亮度控制 -->

          <v-subheader>{{ $t('BRIGHTNESS_SELECT') }}</v-subheader>
          <v-card-text>
            <v-row>
              <v-col class="pr-4">
                <v-slider
                    v-model="slider"
                    class="align-center"
                    :max="max"
                    :min="min"
                    value=""
                    hide-details
                    @change="brightnessValue=setBrightness('0xff')"
                >
                  <template v-slot:append>
                    <v-text-field
                        v-model="slider"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-slider>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- 速度控制 -->

          <v-subheader>{{ $t('SPEED_SELECT') }}</v-subheader>
          <v-card-text>
            <v-slider
                v-model="speed"
                :tick-labels="speedLables"
                :max="2"
                step="1"
                ticks="always"
                tick-size="3"
                @change="speedValue = setSpeed('0x10')"
            ></v-slider>
          </v-card-text>


          <v-btn text color="primary" @click="sendData(modeValue,brightnessValue,speedValue)" >{{ $t('MINER_APPLY') }}</v-btn>

        </v-container>

      </v-card-text>
      <v-card-actions>
      </v-card-actions>
    </v-card>




  </div>

</template>

<script >
import { mapGetters } from 'vuex'
import { getmcbsetting, getmcbpools, getmcbalgosetting, setmcbsetting, setmcbalgosetting, deletepool, setmcbpools, setmcbnewpool, gettutorial } from '../api/mcb'
import draggable from 'vuedraggable'
import Lock from '../components/Lock.vue'

/* 十六进制字符串 -> 十进制数字 */
function parseHex(str) {
  return parseInt(str,16);
}


/* 十进制数字 -> 十六进制数字 */
function decToHex(params) {
  typeof params == "string" ? params = Number(params) : ''
  return '0x' + params.toString(16);
}

/* 获取校验码 */
function getCheckCode(start,type,mode,brightness,speed,) {
  let result = (start ^ type);
  result ^= mode;
  result ^= brightness;
  result ^= speed;
  return  '0x' + result.toString(16);
}

export default {
  components: {
    draggable,
    Lock
  },
  data() {
    return {
      valid: false,
      minerLevel: ['MINER_LEVEL0', 'MINER_LEVEL1', 'MINER_LEVEL2'],
      algoList: [],
      algos: {},
      pools: [],
      powerPlans: [],
      minerLoading: false,
      algoLoading: false,
      poolLoading: false,
      dialog: false,
      delPoolDialog: false,
      isPowerPlanShow: true,
      minerConfig: {},
      temp: 0,
      poolConfig: {
        url: '',
        user: '',
        pass: ''
      },
      ws: null,
      minerDisable: true,
      algoDisable: true,
      algoName: '',
      algoPoolList: [],
      urlRules: [(v) => !!v || this.$t('UNLOCK_POOL_URL_WARNING')],
      userRules: [(v) => !!v || this.$t('UNLOCK_POOL_USER_WARNING')],
      passRules: [(v) => !!v || this.$t('UNLOCK_POOL_PASSWD_WARNING')],
      poolLogo: {
        dxpool: require('../assets/images/pools/dxpool.svg'),
        f2pool: require('../assets/images/pools/f2pool.svg'),
        viabtc: require('../assets/images/pools/viabtc.svg'),
        poolin: require('../assets/images/pools/poolin.svg')
      },

      /* 亮度调节 */
      min: 0,
      max: 255,
      slider: 40,
      /* 速度调节 */
      speed:0,

      modeValue:0x01,
      brightnessValue:0xff,
      speedValue:0x10,
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'isLogin',
      minerInfo: 'minerInfo'
    }),
    /* 模式调节 */
    rgb_modules() {
      return [
        this.$t('COLORFUL_LOOP_MODE'),
        this.$t('LIGHT_TRACKING_MODE'),
        this.$t('ENERGY_MODE'),
        this.$t('ACCUMULATION_MODE'),
        this.$t('BREATHING_MODE'),
        this.$t('GRADIENT_MODE'),
        this.$t('TAI_CHI_ROTATION_MODE'),
        this.$t('COLORFUL_STREAMERS'),
      ]
    },
    speedLables() {
      return [
        this.$t('SLOW_SPEED'),
        this.$t('MEDIUM_SPEED'),
        this.$t('FAST_SPEED'),
      ]
    },

  },
  created() {
    this.pageInit()
  },
  mounted() {
    let wspath = null
    if (process.env.NODE_ENV === 'production') {
      wspath = 'ws://' + window.location.host + '/mcb/resultpool'
    } else {
      wspath = 'ws://' + process.env.VUE_APP_WS_URL + '/mcb/resultpool'
    }
    this.ws = new WebSocket(wspath)
    this.ws.onopen = () => {
      console.log('Connection open ...')
    }
    this.ws.onmessage = (evt) => {
      this.pools = JSON.parse(evt.data)
    }
  },
  methods: {
    pageInit() {
      this.getMinerConfig()
      this.getPoolConfig()
      this.getMinerAlgo()
    },

    getMinerConfig() {
      getmcbsetting()
          .then((res) => {
            this.minerConfig = res
            for (let index = 0; index < res.powerplans.length; index++) {
              this.powerPlans.push({
                text: this.minerLevel[res.powerplans[index].level],
                value: res.powerplans[index].level
              })
            }
          })
          .catch(() => {
            this.$snackbar.error(this.$t('WARNING_GETMCBSETTINGS'))
          })
    },

    getPoolConfig() {
      getmcbpools()
          .then((res) => {
            this.pools = res
          })
          .catch(() => {
            this.$snackbar.error(this.$t('WARNING_GETMCBPOOLS'))
          })
    },

    getMinerAlgo() {
      getmcbalgosetting().then((res) => {
        this.algos = res
        for (let index = 0; index < res.algos.length; index++) {
          if (res.algos[index].id === res.algo_select) {
            this.algoName = res.algos[index].name
            this.$store.dispatch('setAlgo', res.algos[index].name)
          }
          this.algoList.push({
            text: res.algos[index].name,
            value: res.algos[index].id
          })
        }
      })
    },

    updateMinerConfig() {
      this.minerLoading = true
      setmcbsetting(this.minerConfig)
          .then(() => {
            this.minerLoading = false
          })
          .catch(() => {
            this.minerLoading = false
            this.$snackbar.error(this.$t('WARNING_SETMCBSETTINGS'))
          })
    },

    updateMinerAlgo() {
      this.algoLoading = true
      const data = {
        algo_select: this.algos.algo_select
      }
      setmcbalgosetting(data)
          .then(() => {
            this.algoLoading = false
          })
          .catch(() => {
            this.algoLoading = false
            this.$snackbar.error(this.$t('CHANGE_ALGO_FAIL'))
          })
    },

    deletePoolConfig() {
      this.poolLoading = true
      deletepool(this.poolConfig)
          .then(() => {
            this.poolLoading = false
            this.getPoolConfig()
            this.delPoolDialog = false
          })
          .catch(() => {
            this.poolLoading = false
            this.$snackbar.error(this.$t('WARNING_DELMCBPOOLS'))
          })
    },

    submitPoolConfig() {
      if (this.$refs.form.validate()) {
        const data = {
          url: 'stratum+tcp://' + this.poolConfig.url,
          user: this.poolConfig.user,
          pass: this.poolConfig.pass
        }
        setmcbnewpool(data)
            .then(() => {
              this.dialog = false
              this.pools.push({
                url: 'stratum+tcp://' + this.poolConfig.url,
                user: this.poolConfig.user,
                pass: this.poolConfig.pass,
                dragid: this.pools.length
              })
              setTimeout(() => {
                this.getPoolConfig()
              }, 5000)
            })
            .catch(() => {
              this.$snackbar.error(this.$t('WARNING_SETNEWPOOL'))
            })
      }
    },

    changePool() {
      for (let index = 0; index < this.pools.length; index++) {
        this.pools[index]['pool-priority'] = index
      }
      setmcbpools(this.pools)
          .then(() => {
            this.getPoolConfig()
          })
          .catch(() => {
            this.$snackbar.error(this.$t('WARNING_SETMCBPOOLS'))
          })
    },

    getMinerTutorial() {
      gettutorial().then((res) => {
        for (let index = 0; index < res.tutorial.length; index++) {
          if (this.algoName === res.tutorial[index].algoname) {
            this.algoPoolList = res.tutorial[index].pools
          }
        }
        this.$refs.form.reset()
      })
    },

    handlePool(data) {
      this.poolConfig.url = data.url
    },

    closeDialog() {
      this.dialog = false
    },

    deletePool(value) {
      this.delPoolDialog = true
      this.poolConfig = value
    },

    addPool() {
      this.dialog = true
      this.poolConfig = {
        url: '',
        user: '',
        pass: ''
      }
      this.getMinerTutorial()
    },

    openManual() {
      this.temp++
      if (this.temp === 10) {
        this.isPowerPlanShow = false
      }
    },


    /* 设置亮度状态码（Hex）*/
    setBrightness(brightness) {
      return decToHex(parseHex(brightness));
      // eslint-disable-next-line no-unreachable
    },

    /* 设置速度状态码(Hex) */
    setSpeed(speed) {
      return decToHex(parseHex(speed));
    },

    /* 设置模式状态码 */
    setMode(mode) {
      return decToHex(parseHex(mode));
    },

    /* 发送数据 */
    sendData(mode,brightness,speed) {
      const SerialPort = require("serialport");
      let checkCode = getCheckCode(0xaa,0x01,mode,brightness,speed);
      const data = [0xaa, 0x01, mode, brightness, speed, checkCode];
      let serialPort = new SerialPort( //设置串口属性

          "COM3", {

            baudRate: 9600, //波特率

            dataBits: 8, //数据位

            parity: 'none', //奇偶校验

            stopBits: 2, //停止位

            flowControl: false ,

            autoOpen:false // 自动打开

          }, false);

      serialPort.open();

      serialPort.on('open',() => {
        console.log("串口已打开，准备写入数据")
        serialPort.write(data);
      })

      serialPort.on('readable', function () {
        console.log('Data:', serialPort.read())
      })


      serialPort.on('data',(data) => {

        console.log("命令已经发出")
        console.log("回应的数据: " + data)
        serialPort.close();
      })
    }
  }


}
</script>

<style lang="scss">
.miner-setting {
  max-width: 790px;
  margin: 0 auto;
  .active {
    background-color: #2dce89 !important;
  }
  .inactive {
    background-color: #78909c !important;
  }
  .tip {
    font-size: 12px;
    color: grey;
  }
}
</style>
