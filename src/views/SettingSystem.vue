<template>
  <div class="system-setting">
    <div v-title>{{ $t('BUTTON_ASIDE_SYSTEM') }} {{ minerInfo.model }}</div>
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <!-- 网络设置 -->
        <v-form ref="form" v-model="valid">
          <v-card outlined class="mb-4">
            <v-card-title> {{ $t('SYSTEM_NETWORK_SETTINGS') }} </v-card-title>
            <v-card-text>
              <v-switch v-model="isDHCP" :label="$t('SYSTEM_DHCP_ENABLE')" @change="resetDHCP"></v-switch>
              <v-row v-if="!isDHCP">
                <v-col cols="12" sm="8" md="6" lg="4" xl="4">
                  <v-text-field v-model="ipv4Address" :label="$t('SYSTEM_IPV4_ADDR')" required :rules="addrRules"></v-text-field>
                  <v-text-field v-model="subnetMask" :label="$t('SYSTEM_SUBNET_MASK')" required :rules="subnetMaskRules"></v-text-field>
                  <v-text-field v-model="gateway" :label="$t('SYSTEM_ROUTER')" required :rules="gatewayRules"></v-text-field>
                </v-col>
              </v-row>
              <v-switch v-model="isAuto" :label="$t('SYSTEM_DNSAUTO_ENABLE')" @change="resetDNS"></v-switch>
              <v-row v-if="!isAuto">
                <v-col cols="12" sm="8" md="6" lg="4" xl="4">
                  <v-text-field v-model="DNS1" label="DNS 1"></v-text-field>
                  <v-text-field v-model="DNS2" label="DNS 2"></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" @click="updateMinerIP" :disabled="!valid" :loading="ipLoading">{{ $t('SYSTEM_APPLY') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>

        <!-- wifi设置 -->
        <v-card outlined class="mb-4">
          <v-card-title>
            {{ $t('SYSTEM_WIFI_SETTINGS') }}
            <a :href="'http://' + connected.ip" target="_blank" class="text-decoration-none" v-if="this.connected && connected.ip">
              <v-icon class="ml-3">mdi-link-variant</v-icon>
            </a>
          </v-card-title>
          <v-card-text v-if="!isExist">{{ $t('SYSTEM_WIFI_NONE') }}</v-card-text>
          <v-card-title v-else>
            <v-row>
              <v-col cols="12" sm="8" md="6" lg="6" xl="6">
                <div class="d-flex justify-space-between ml-6">
                  <span class="d-flex align-center"> WLAN </span>
                  <span class="d-flex">
                    <v-switch v-model="isEnable" @change="changeWifiConfig" :disabled="wifiModel !== 'sta'"></v-switch>
                  </span>
                </div>
                <v-expansion-panels v-model="currentPanel" flat hover focusable>
                  <v-expansion-panel v-for="(item, index) in wifiList" :key="index" @change="inputPasswordShow = false">
                    <v-expansion-panel-header hide-actions>
                      <div>
                        <v-img :src="rssIcons[item.rss]" width="30" height="30" class="mr-4 float-left"></v-img>
                        <div style="height: 30px; line-height: 30px">
                          <span>{{ item.ssid === '' ? $t('SYSTEM_WIFI_HIDE_NET') : item.ssid }}</span>
                          <span v-if="item.status === 2">（{{ $t('SYSTEM_WIFI_CONNECTED') }}）</span>
                        </div>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="text-right">
                      <div v-if="inputPasswordShow" class="mt-3">
                        <v-alert border="left" colored-border color="deep-purple accent-4" class="text-left text-caption" v-if="wifiModel === 'ap'">
                          {{ $t('SUSTEM_WIFI_AP_NOTE') }}
                          <a href="https://find.goldshell.com/" target="_blank" rel="noopener noreferrer">https://find.goldshell.com/</a>
                        </v-alert>
                        <v-text-field v-model="wifiSsid" label="ssid" v-if="item.ssid === ''"></v-text-field>
                        <v-text-field
                          v-model="wifiPassword"
                          :label="$t('SYSTEM_WIFI_INPUT_MSG')"
                          :type="passwordShow ? 'text' : 'password'"
                          :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="passwordShow = !passwordShow"
                        ></v-text-field>
                        <v-row>
                          <v-col cols="6">
                            <v-btn class="mt-2" depressed block @click="updateWifi(item.ssid === '' ? wifiSsid : item.ssid, wifiPassword)">{{ $t('WARNING_ENSURE') }}</v-btn>
                          </v-col>
                          <v-col cols="6">
                            <v-btn class="mt-2" depressed block @click="inputPasswordShow = false">{{ $t('WARNING_CANCEL') }}</v-btn>
                          </v-col>
                        </v-row>
                      </div>

                      <div v-else>
                        <v-btn class="mt-6 mr-2" depressed outlined @click="forgetWifiPassword(item.ssid)" v-if="item.saved === 1">{{ $t('SYSTEM_WIFI_FORGET') }}</v-btn>
                        <v-btn class="mt-6" depressed outlined @click="connectWifi(item.saved, item.ssid)" v-if="item.status !== 2">{{ $t('SYSTEM_WIFI_CONNECT') }}</v-btn>
                        <v-btn class="mt-6" depressed outlined @click="disconnect(item.ssid)" v-else>{{ $t('SYSTEM_WIFI_DISCONNECT') }}</v-btn>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>

        <!-- 修改密码 -->
        <v-form ref="passwordForm" v-model="passwordValid">
          <v-card outlined class="mb-4">
            <v-card-title
              >{{ $t('SYSTEM_CHANGE_PASSWORD') }}
              <lock />
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="8" md="6" lg="4" xl="4">
                  <v-text-field v-model="oldPassword" :label="$t('SYSTEM_ORIGINAL_PASSWORD')" type="password" :rules="[() => !!oldPassword || $t('SYSTEM_WRONG_ORIGINAL_PASSWORD')]"></v-text-field>
                  <v-text-field v-model="newPassword" :label="$t('SYSTEM_NEW_PASSWORD')" type="password" :rules="[() => !!newPassword || $t('SYSTEM_WRONG_NEW_PASSWORD')]"></v-text-field>
                  <v-text-field
                    v-model="confirmPassword"
                    :label="$t('SYSTEM_CFM_NEW_PASSOWORD')"
                    type="password"
                    :rules="[() => !!confirmPassword || $t('SYSTEM_WRONG_CFM_PASSWORD'), () => !confirmPassword || newPassword === confirmPassword || $t('SYSTEM_WRONG_IDENTICAL_PASSWORD')]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" @click="resetPassword" :disabled="!isLogin" :loading="passwordLoading">{{ $t('SYSTEM_CHANGE') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>

        <!-- 固件更新 -->
        <v-form ref="fileForm" v-model="fileValid">
          <v-card outlined class="mb-4">
            <v-card-title>
              {{ $t('SYSTEM_UPDATE_FIRMWARE') }}
              <lock />
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="8" md="6" lg="4" xl="4">
                  <v-file-input :label="$t('HOME_FIRMWARE')" @change="changefile" accept=".tgz,.cpb" show-size :rules="rules" :clearable="false"></v-file-input>
                </v-col>
              </v-row>
              <v-row v-show="isShow">
                <v-col cols="12" sm="8" md="6" lg="4" xl="4" class="text-center">
                  {{ stepMsg }}
                  <v-progress-linear color="light-blue" height="10" :value="progress" striped></v-progress-linear>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" :disabled="!(isLogin && !isEmpty)" @click="updateFirmware">{{ $t('SYSTEM_UPDATE_FIRMWARE') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>

        <!-- 矿机重置 -->
        <v-card outlined class="mb-4">
          <v-card-title>
            {{ $t('MINER_RESET') }}
            <lock />
          </v-card-title>
          <v-card-text>
            <v-row v-show="isResetShow">
              <v-col cols="12" sm="8" md="6" lg="6" xl="6" class="text-center">
                {{ $t('SYSTEM_RESTARTTING') }}
                <v-progress-linear color="light-blue" height="10" :value="resetProgress" striped></v-progress-linear>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="4" md="3" lg="3" xl="3" class="label">
                {{ $t('SYSTEM_RESTART_MINER') }}
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="3" xl="3" class="text-right">
                <v-btn text color="primary" @click="resetMiner">{{ $t('SYSTEM_RESTART') }}</v-btn>
              </v-col>
            </v-row>
            <v-row v-show="isFactoryShow">
              <v-col cols="12" sm="8" md="6" lg="6" xl="6" class="text-center">
                {{ $t('SYSTEM_FACTRSTING') }}
                <v-progress-linear color="light-blue" height="10" :value="factoryProgress" striped></v-progress-linear>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="4" md="3" lg="3" xl="3" class="label">
                {{ $t('SYSTEM_FACTORY_RESET') }}
              </v-col>
              <v-col cols="6" sm="4" md="3" lg="3" xl="3" class="text-right">
                <v-btn text color="primary" @click="factoryreset" :disabled="!isLogin" :loading="factoryLoading">{{ $t('SYSTEM_RESET') }}</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-container class="tip">*{{ $t('IP_CHANGE_NOTE') }} <a href="https://find.goldshell.com/" target="_blank" rel="noopener noreferrer">https://find.goldshell.com/</a></v-container>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getmcbip, setmcbip, factoryreset, restartmcbminer, uploadimage, getwifiList, changewifi } from '../api/mcb'
import { updatepassword } from '../api/user'
import { mapGetters } from 'vuex'
import Lock from '../components/Lock.vue'
export default {
  components: {
    Lock
  },
  data() {
    return {
      valid: true,
      fileValid: true,
      passwordValid: true,
      isDHCP: true,
      isAuto: true,
      ipv4Address: '',
      subnetMask: '',
      gateway: '',
      DNS1: '',
      DNS2: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      wifiModel: 'ap',
      file: null,
      progress: 0,
      resetProgress: 0,
      factoryProgress: 0,
      isResetShow: false,
      isFactoryShow: false,
      isShow: false,
      isVerify: false,
      passwordShow: false,
      interval: null,
      stepMsg: null,
      resetInterval: null,
      factoryInterval: null,
      wifiInterval: null,
      ipLoading: false,
      passwordLoading: false,
      factoryLoading: false,
      resetLoading: false,
      updateLoading: false,
      isExist: false,
      isEnable: false,
      wifiSsid: '',
      wifiPassword: '',
      wifiList: [],
      eysIcon: 'mdi-eye',
      currentPanel: null,
      inputPasswordShow: false,
      isEmpty: true,
      connected: null,
      ws: null,
      rssIcons: {
        strong: require('../assets/images/rss2.png'),
        normal: require('../assets/images/rss1.png'),
        weak: require('../assets/images/rss0.png')
      },
      wifiNetwork: [],
      trigger: null,
      addrRules: [(v) => !!v || this.$t('SYSTEM_IPV4_ADDR_WARNING_REQUIRED'), (v) => /^\d+\.\d+\.\d+\.\d+$/.test(v) || this.$t('SYSTEM_IPV4_ADDR_WARNING')],
      subnetMaskRules: [(v) => !!v || this.$t('SYSTEM_SUBNET_MASK_WARNING_REQUIRED'), (v) => /^\d+\.\d+\.\d+\.\d+$/.test(v) || this.$t('SYSTEM_SUBNET_MASK_WARNING')],
      gatewayRules: [(v) => !!v || this.$t('SYSTEM_ROUTER_WARNING_REQUIRED'), (v) => /^\d+\.\d+\.\d+\.\d+$/.test(v) || this.$t('SYSTEM_ROUTER_WARNING')],
      rules: [(value) => !value || value.name.indexOf('.tgz') !== -1 || value.name.indexOf('.cpb') !== -1 || this.$t('SYSTEM_UPDATE_FORMAT_WARNING')]
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'isLogin',
      minerInfo: 'minerInfo',
      language: 'language'
    })
  },
  watch: {
    language() {
      this.$refs.form.resetValidation()
      this.$refs.passwordForm.resetValidation()
      this.$refs.fileForm.resetValidation()
    }
  },
  created() {
    this.getMinerIP()
    this.getWifiList()
    this.scanWifi()
  },

  mounted() {
    let wspath = null
    if (process.env.NODE_ENV === 'production') {
      wspath = 'ws://' + window.location.host + '/mcb/wifiresult'
    } else {
      wspath = 'ws://' + process.env.VUE_APP_WS_URL + '/mcb/wifiresult'
    }
    this.ws = new WebSocket(wspath)
    this.ws.onopen = () => {
      console.log('Connection open ...')
    }
    this.ws.onmessage = (evt) => {
      this.wifiList = JSON.parse(evt.data)
      this.getWifiIp()
    }
  },

  methods: {
    getMinerIP() {
      getmcbip()
        .then((res) => {
          this.isDHCP = res.useDHCP
          this.isAuto = res.useAuto
        })
        .catch(() => {
          this.$snackbar.error(this.$t('WARNING_GETIP'))
        })
    },

    getWifiList() {
      getwifiList().then((res) => {
        this.wifiNetwork = res.network
        this.wifiList = res.status
        this.isExist = res.exist
        this.isEnable = res.enable
        this.wifiModel = res.mode
        this.getWifiIp()
      })
    },

    getWifiIp() {
      if (this.wifiList) {
        const result = this.wifiList.filter((e) => {
          return e.status === 2
        })
        this.connected = result[0]
      }
    },

    updateWifi(ssid, passowrd) {
      const data = {
        connect: {
          ssid: ssid,
          password: passowrd
        }
      }
      changewifi(data).then(() => {
        this.wifiPassword = ''
        this.currentPanel = null
      })
    },

    scanWifi() {
      const data = {
        scan: true
      }
      changewifi(data).then(() => {
        this.wifiPassword = ''
        this.currentPanel = null
      })
    },

    disconnect(ssid) {
      const data = {
        disconnect: {
          ssid: ssid
        }
      }
      changewifi(data).then(() => {
        this.currentPanel = null
      })
    },

    updateMinerIP() {
      this.ipLoading = true
      const data = {
        setIP: {},
        useAuto: this.isAuto,
        useDHCP: this.isDHCP
      }

      this.DNS1 && (data.setIP.DNS1 = this.DNS1)
      this.DNS2 && (data.setIP.DNS2 = this.DNS2)
      this.ipv4Address && (data.setIP.IPv4addr = this.ipv4Address)
      this.subnetMask && (data.setIP.Subnetmask = this.subnetMask)
      this.gateway && (data.setIP.Router = this.gateway)
      setmcbip(data)
        .then(() => {
          this.ipLoading = false
        })
        .catch(() => {
          this.ipLoading = false
          this.$snackbar.error(this.$t('WARNING_SETIP'))
        })
    },

    resetPassword() {
      if (this.$refs.passwordForm.validate()) {
        this.passwordLoading = true
        const params = {
          cfmpassword: this.confirmPassword,
          newpassword: this.newPassword,
          oldpassword: this.oldPassword
        }
        updatepassword(params)
          .then(() => {
            this.passwordLoading = false
            localStorage.removeItem('token')
            this.$store.dispatch('setIsLogin', false)
            this.$router.push('/login')
          })
          .catch(() => {
            this.passwordLoading = false
            this.$snackbar.error(this.$t('WARNING_SETUPDATEPD'))
          })
      }
    },

    factoryreset() {
      this.factoryLoading = true
      factoryreset()
        .then(() => {
          this.factoryLoading = false
          this.factoryProgress = 0
          this.isFactoryShow = true
          this.factoryInterval = setInterval(() => {
            if (this.factoryProgress > 100) {
              this.isFactoryShow = false
              clearInterval(this.factoryInterval)
            }
            this.factoryProgress += 1
          }, 250)
        })
        .catch(() => {
          this.factoryLoading = false
          this.$snackbar.error(this.$t('WARNING_SETFACRST'))
        })
    },

    resetMiner() {
      this.resetLoading = true
      restartmcbminer()
        .then(() => {
          this.resetLoading = false
          this.resetProgress = 0
          this.isResetShow = true
          this.resetInterval = setInterval(() => {
            if (this.resetProgress > 100) {
              this.isResetShow = false
              clearInterval(this.resetInterval)
            }
            this.resetProgress += 1
          }, 250)
        })
        .catch(() => {
          this.resetLoading = false
          this.$snackbar.error(this.$t('WARNING_SETRESTART'))
        })
    },

    updateFirmware() {
      if (this.$refs.fileForm.validate()) {
        this.updateLoading = true
        this.progress = 0
        this.isShow = true
        let formData = new FormData()
        formData.append('file', this.files)
        this.isVerify = false
        uploadimage(formData)
          .then(() => {
            this.isVerify = true
          })
          .catch(() => {
            clearInterval(this.interval)
            this.isShow = false
            this.progress = 0
            this.updateLoading = false
          })
        this.interval = setInterval(() => {
          if (this.progress < 20) {
            this.stepMsg = this.$t('SYSTEM_FIRMWARE_UPLOADING')
          } else if (this.progress < 30) {
            this.stepMsg = this.$t('SYSTEM_FIRMWARE_VERIFYING')
          } else {
            this.stepMsg = this.$t('SYSTEM_FIRMWARE_UPDATING')
          }
          if (this.progress > 20 && !this.isVerify) {
            return
          }
          if (this.progress > 100) {
            clearInterval(this.interval)
            this.progress = 0
            this.isShow = false
          }
          this.progress += 1
        }, 400)
      }
    },

    changefile(value) {
      this.files = value
      this.isEmpty = false
    },

    changeWifiConfig() {
      const data = {
        enable: this.isEnable
      }
      changewifi(data).then(() => {
        this.getWifiList()
      })
    },

    connectWifi(saved, ssid) {
      if (saved === 1) {
        const result = this.wifiNetwork.filter((e) => {
          return e.ssid === ssid
        })
        if (result.length === 1) {
          const data = {
            connect: {
              ssid: result[0].ssid,
              password: result[0].passowrd
            }
          }
          changewifi(data).then(() => {
            this.currentPanel = null
          })
        }
      } else {
        this.inputPasswordShow = true
      }
    },

    forgetWifiPassword(ssid) {
      const data = {
        forget: {
          ssid: ssid
        }
      }
      changewifi(data).then(() => {
        this.currentPanel = null
      })
    },

    prependIconCallback() {},

    resetDHCP() {
      this.ipv4Address = ''
      this.subnetMask = ''
      this.gateway = ''
    },

    resetDNS() {
      this.DNS1 = ''
      this.DNS2 = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.system-setting {
  max-width: 790px;
  margin: 0 auto;
  .label {
    font-size: 16px;
    line-height: 36px;
  }
  .tip {
    font-size: 12px;
    color: grey;
  }
}
</style>
