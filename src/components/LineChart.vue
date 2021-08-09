<script>
import { Line, mixins } from 'vue-chartjs'
import 'chartjs-plugin-streaming'
const { reactiveProp } = mixins
export default {
  name: 'LineChart',
  extends: Line,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  watch: {
    options() {
      this.$data._chart.destroy()
      this.renderChart(this.chartData, this.options)
    }
  },
  mounted() {
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options)
  }
}
</script>
