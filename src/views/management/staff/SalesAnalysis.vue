<template>
  <div class="sales-analysis">
    <h1 class="title"><i class="fas fa-chart-line"></i> تحليل بيانات المبيعات</h1>
    <p class="subtitle">تحليل أداء المبيعات وإنشاء تقارير استراتيجية</p>

    <div class="action-section">
      <button @click="analyzeSalesData" :disabled="loading" class="analyze-btn">
        <span v-if="loading"><i class="fas fa-spinner fa-spin"></i> جاري التحليل...</span>
        <span v-else><i class="fas fa-chart-line"></i> تحليل البيانات</span>
      </button>
    </div>

    <div v-if="error" class="error-container">
      <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
      <div class="error-content">
        <h3>خطأ في التحليل</h3>
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-if="loading && !error" class="loading-container">
      <i class="fas fa-spinner fa-spin fa-2x"></i>
      <p>جاري تحليل البيانات...</p>
    </div>

    <div v-if="!report && !loading && !error" class="welcome-message">
      <div class="welcome-icon"><i class="fas fa-rocket"></i></div>
      <h2>ابدأ تحليل بياناتك الآن</h2>
      <p>اضغط على زر "تحليل البيانات" لبدء تحليل بيانات المبيعات وعرض التقرير التفصيلي</p>
    </div>

    <div v-if="report && !loading && !error" class="report-container">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="card revenue">
          <div class="card-icon"><i class="fas fa-money-bill-wave"></i></div>
          <div class="card-content">
            <h4>إجمالي الإيرادات</h4>
            <p class="value">{{ totalRevenue }} <span class="currency-symbol">ر.س</span></p>
          </div>
        </div>
        <div class="card best-month">
          <div class="card-icon"><i class="fas fa-trophy"></i></div>
          <div class="card-content">
            <h4>أفضل أسبوع</h4>
            <p class="value">{{ bestWeekName }}</p>
            <p class="detail">{{ bestWeekRevenue }} ر.س</p>
          </div>
        </div>
        <div class="card top-shipping">
          <div class="card-icon"><i class="fas fa-truck"></i></div>
          <div class="card-content">
            <h4>أفضل طريقة شحن</h4>
            <p class="value">{{ topShippingMethod }}</p>
            <p class="detail">{{ topShippingRevenue }} ر.س</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-container">
          <div class="chart-header">
            <h3><i class="fas fa-chart-bar"></i> الإيرادات الأسبوعية</h3>
          </div>
          <div class="chart-wrapper">
            <canvas ref="weeklyChart" class="chart-canvas"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <div class="chart-header">
            <h3><i class="fas fa-pie-chart"></i> توزيع الإيرادات حسب طريقة الشحن</h3>
          </div>
          <div class="chart-wrapper">
            <canvas ref="shippingChart" class="chart-canvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Detailed Report -->
      <div class="detailed-report">
        <div class="report-header">
          <h3><i class="fas fa-file-alt"></i> التقرير التفصيلي</h3>
        </div>
        <div class="report-content" v-html="formattedReport"></div>
      </div>

      <!-- Strategic Recommendations -->
      <div class="recommendations">
        <div class="recommendation-header">
          <h3><i class="fas fa-lightbulb"></i> التوصيات الاستراتيجية</h3>
        </div>
        <div class="recommendation-content">
          <ul>
            <li>تحليل أسباب اختلاف الأداء في فترات مختلفة لتحديد العوامل المؤثرة</li>
            <li>زيادة الترويج للمنتجات التي حققت أعلى مبيعات خلال الأسابيع الناجحة</li>
            <li>تحسين تجربة الشحن للعملاء من خلال تقييم أداء خيارات الشحن المختلفة</li>
            <li>تحليل سلوك العملاء خلال الأسابيع ذات المبيعات العالية لفهم أنماط الشراء</li>
            <li>استهداف العملاء المحتملين من خلال حملات تسويقية مخصصة بناءً على بيانات المبيعات</li>
            <li>توفير خيارات شحن إضافية بناءً على احتياجات العملاء وتفضيلاتهم</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  name: 'SalesAnalysis',
  data() {
    return {
      loading: false,
      error: null,
      report: null,
      weeklySalesData: [],
      shippingAnalysisData: [],
      weeklyChartInstance: null,
      shippingChartInstance: null,
      totalRevenue: '0.00',
      bestWeekName: '-',
      bestWeekRevenue: '0.00',
      topShippingMethod: '-',
      topShippingRevenue: '0.00',
      extractedSalesData: null,
    };
  },
  computed: {
    formattedReport() {
      if (!this.report) return '';
      let formatted = this.report;
      formatted = formatted.replace(/(تقرير تحليل المبيعات)/g, '<strong class="report-title">$1</strong>');
      formatted = formatted.replace(/(1\. تحليل المبيعات الأسبوعية:)/g, '<strong class="section-title">$1</strong>');
      formatted = formatted.replace(/(2\. تحليل خيارات الشحن:)/g, '<strong class="section-title">$1</strong>');
      formatted = formatted.replace(/(3\. النصائح والإجراءات المقترحة)/g, '<strong class="section-title">$1</strong>');
      formatted = formatted.replace(/\n/g, '<br>');
      return formatted;
    }
  },
  mounted() {
    Chart.register(...registerables);
  },
  methods: {
    async analyzeSalesData() {
      this.loading = true;
      this.error = null;
      try {
        const apiResponse = await this.fetchSalesData();
        this.extractedSalesData = this.extractSalesData(apiResponse);
        this.processSalesData(this.extractedSalesData);
        this.extractSummaryData();
        this.$nextTick(() => {
          setTimeout(() => {
            this.generateCharts();
          }, 100);
        });
        this.generateReport();
      } catch (error) {
        this.error = error.message || 'حدث خطأ أثناء تحليل البيانات';
        console.error('Error analyzing sales data:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchSalesData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('لم يتم العثور على token في localStorage');
        }
        const response = await fetch('https://vmi2584358.contaboserver.net/api/billing/sales-analysis/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`خطأ في الاستجابة: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching sales data:', error);
        throw error;
      }
    },

    extractSalesData(apiResponse) {
      if (apiResponse && typeof apiResponse === 'object') {
        if (apiResponse.message && typeof apiResponse.message === 'object') {
          return apiResponse.message;
        }
        if (apiResponse.report) {
          return apiResponse;
        }
      }
      return { report: "" };
    },

    processSalesData(salesData) {
      this.weeklySalesData = [];
      this.shippingAnalysisData = [];

      if (salesData.report) {
        const reportLines = salesData.report.split('\n');
        const weeklyData = {};
        const shippingData = {};

        // Extraire les données des ventes hebdomadaires
        reportLines.forEach(line => {
          const weeklyMatch = line.match(/(\d{4}-W\d{2}): إيرادات ([\d,]+\.?\d*)/);
          if (weeklyMatch) {
            const week = weeklyMatch[1];
            const revenue = parseFloat(weeklyMatch[2].replace(',', ''));
            weeklyData[week] = revenue;
          }
          // Extraire les données des options d'expédition
          const shippingMatch = line.match(/(\d+): إيرادات ([\d,]+\.?\d*)/);
          if (shippingMatch) {
            const option = shippingMatch[1];
            const revenue = parseFloat(shippingMatch[2].replace(',', ''));
            shippingData[option] = revenue;
          }
        });

        this.weeklySalesData = Object.keys(weeklyData).map(week => ({
          week: week,
          revenue: weeklyData[week]
        }));

        this.shippingAnalysisData = Object.keys(shippingData).map(option => ({
          option: option,
          revenue: shippingData[option]
        }));
      }
    },

    extractSummaryData() {
      // Calculer إجمالي الإيرادات
      this.totalRevenue = this.weeklySalesData.reduce((sum, item) => sum + item.revenue, 0).toFixed(2);

      // Extraire أفضل أسبوع
      if (this.weeklySalesData.length > 0) {
        const bestWeek = this.weeklySalesData.reduce((max, item) => item.revenue > max.revenue ? item : max, this.weeklySalesData[0]);
        this.bestWeekName = bestWeek.week;
        this.bestWeekRevenue = bestWeek.revenue.toFixed(2);
      }

      // Extraire أفضل طريقة شحن
      if (this.shippingAnalysisData.length > 0) {
        const topShipping = this.shippingAnalysisData.reduce((max, item) => item.revenue > max.revenue ? item : max, this.shippingAnalysisData[0]);
        this.topShippingMethod = `خيار الشحن ${topShipping.option}`;
        this.topShippingRevenue = topShipping.revenue.toFixed(2);
      }
    },

    generateCharts() {
      if (!this.$refs.weeklyChart || !this.$refs.shippingChart) {
        console.warn('Canvas elements not available yet');
        return;
      }

      if (this.weeklyChartInstance) {
        this.weeklyChartInstance.destroy();
      }
      if (this.shippingChartInstance) {
        this.shippingChartInstance.destroy();
      }

      // Générer le graphique des ventes hebdomadaires
      try {
        const weeklyCtx = this.$refs.weeklyChart.getContext('2d');
        this.weeklyChartInstance = new Chart(weeklyCtx, {
          type: 'bar',
          data: {
            labels: this.weeklySalesData.map(item => item.week),
            datasets: [{
              label: 'الإيرادات (ر.س)',
              data: this.weeklySalesData.map(item => item.revenue),
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'الإيرادات الأسبوعية',
                font: { size: 16 }
              },
              legend: { position: 'top' }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'الإيرادات (ر.س)' }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error creating weekly chart:', error);
      }

      // Générer le graphique de distribution des options d'expédition
      try {
        const shippingCtx = this.$refs.shippingChart.getContext('2d');
        this.shippingChartInstance = new Chart(shippingCtx, {
          type: 'pie',
          data: {
            labels: this.shippingAnalysisData.map(item => `خيار الشحن ${item.option}`),
            datasets: [{
              data: this.shippingAnalysisData.map(item => item.revenue),
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(245, 158, 11, 0.7)'
              ],
              borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'توزيع الإيرادات حسب طريقة الشحن',
                font: { size: 16 }
              },
              legend: { position: 'right' }
            }
          }
        });
      } catch (error) {
        console.error('Error creating shipping chart:', error);
      }
    },

    generateReport() {
      if (this.extractedSalesData && this.extractedSalesData.report) {
        this.report = this.extractedSalesData.report;
        return;
      }

      let report = "تقرير تحليل المبيعات";
      report += "===============================";
      report += "1. تحليل المبيعات الأسبوعية:";
      if (this.weeklySalesData.length === 0) {
        report += "- لا توجد بيانات للمبيعات";
      } else {
        this.weeklySalesData.forEach(item => {
          report += `- ${item.week}: إيرادات ${item.revenue.toFixed(2)} ر.س`;
        });
      }

      report += "2. تحليل خيارات الشحن:";
      if (this.shippingAnalysisData.length === 0) {
        report += "- لا توجد بيانات للشحن";
      } else {
        const totalRevenue = this.shippingAnalysisData.reduce((sum, item) => sum + item.revenue, 0);
        this.shippingAnalysisData.forEach(item => {
          const percentage = totalRevenue > 0 ? (item.revenue / totalRevenue * 100) : 0;
          report += `- خيار الشحن ${item.option}: إيرادات ${item.revenue.toFixed(2)} ر.س (${percentage.toFixed(1)}%)`;
        });
      }

      report += "3. النصائح والإجراءات المقترحة:";
      if (this.weeklySalesData.length > 0) {
        const bestWeek = this.weeklySalesData.reduce((max, item) => item.revenue > max.revenue ? item : max, this.weeklySalesData[0]);
        const worstWeek = this.weeklySalesData.reduce((min, item) => item.revenue < min.revenue ? item : min, this.weeklySalesData[0]);
        report += `- أفضل أسبوع من حيث الإيرادات: ${bestWeek.week} (${bestWeek.revenue.toFixed(2)} ر.س)`;
        report += `- أضعف أسبوع من حيث الإيرادات: ${worstWeek.week} (${worstWeek.revenue.toFixed(2)} ر.س)`;
      }
      if (this.shippingAnalysisData.length > 0) {
        const topShipping = this.shippingAnalysisData.reduce((max, item) => item.revenue > max.revenue ? item : max, this.shippingAnalysisData[0]);
        report += `- طريقة الشحن الأكثر ربحية: خيار الشحن ${topShipping.option}`;
      }
      report += "- عزز الحملات التسويقية في الأسابيع الضعيفة";
      report += "- قدم عروضاً على خيارات الشحن الأقل استخداماً";
      report += "- قم بتحليل سلوك العملاء بشكل أعمق عبر الذكاء الاصطناعي للتنبؤ بالاتجاهات";
      this.report = report;
    },

    beforeUnmount() {
      if (this.weeklyChartInstance) {
        this.weeklyChartInstance.destroy();
      }
      if (this.shippingChartInstance) {
        this.shippingChartInstance.destroy();
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

.sales-analysis {
  font-family: 'Tajawal', sans-serif;
  width: 95%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  background: #f9fafb;
  min-height: 100vh;
}

.title {
  font-size: 2.5rem;
  color: #1f2937;
  margin: 0;
  font-weight: 700;
  text-align: center;
}

.subtitle {
  font-size: 1.3rem;
  color: #6b7280;
  margin-top: 12px;
  text-align: center;
}

/* Action Section */
.action-section {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.analyze-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

.analyze-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.analyze-btn i {
  font-size: 1.3rem;
}

/* Error Container */
.error-container {
  background: #fee;
  border: 2px solid #f44;
  border-radius: 16px;
  padding: 25px;
  margin: 30px 0;
  display: flex;
  align-items: flex-start;
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

.error-icon {
  font-size: 2.5rem;
  color: #f44;
  margin-right: 20px;
}

.error-content {
  flex: 1;
}

.error-content h3 {
  margin: 0 0 15px 0;
  color: #c00;
  font-size: 1.5rem;
  font-weight: 600;
}

.error-content p {
  margin: 0;
  color: #555;
  line-height: 1.6;
  font-size: 1.1rem;
}

/* Loading Container */
.loading-container {
  text-align: center;
  padding: 60px 30px;
  color: #6b7280;
}

.loading-container i {
  font-size: 3rem;
  color: #3b82f6;
  margin-bottom: 20px;
}

.loading-container p {
  font-size: 1.3rem;
  font-weight: 500;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  height: 140px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.12);
  border-color: #d1d5db;
}

.card-icon {
  font-size: 2.5rem;
  margin-right: 20px;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
}

.card.revenue .card-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.card.best-month .card-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.card.top-shipping .card-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.card-content {
  flex: 1;
}

.card-content h4 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 600;
}

.card-content .value {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-content .detail {
  margin: 8px 0 0 0;
  color: #6b7280;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.sar-icon {
  width: 28px;
  height: 28px;
  vertical-align: middle;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

@media (min-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr 1fr;
  }
}

.chart-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
}

.chart-header {
  background: #f9fafb;
  color: #1f2937;
  padding: 20px 25px;
  border-bottom: 1px solid #e5e7eb;
}

.chart-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-wrapper {
  padding: 25px;
  min-height: 450px;
  position: relative;
}

.chart-canvas {
  width: 100% !important;
  height: 400px !important;
}

/* Detailed Report */
.detailed-report, .recommendations {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
  margin-bottom: 40px;
}

.report-header, .recommendation-header {
  background: #f9fafb;
  color: #1f2937;
  padding: 20px 25px;
  border-bottom: 1px solid #e5e7eb;
}

.report-header h3, .recommendation-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.report-content, .recommendation-content {
  padding: 25px;
}

.report-content {
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 1.1rem;
}

.report-content .report-title {
  color: #1f2937;
  font-size: 1.6rem;
  font-weight: 700;
  display: block;
  margin: 15px 0;
}

.report-content .section-title {
  color: #3b82f6;
  font-size: 1.4rem;
  font-weight: 600;
  display: block;
  margin: 20px 0 15px 0;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.report-content .sar-icon {
  width: 22px;
  height: 22px;
  margin: 0 4px;
  vertical-align: middle;
}

.recommendation-content ul {
  padding-right: 25px;
}

.recommendation-content li {
  margin-bottom: 15px;
  line-height: 1.7;
  font-size: 1.1rem;
}

/* Welcome Message */
.welcome-message {
  text-align: center;
  padding: 80px 30px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
}

.welcome-icon {
  font-size: 5rem;
  color: #3b82f6;
  margin-bottom: 30px;
}

.welcome-message h2 {
  color: #1f2937;
  margin: 0 0 20px 0;
  font-size: 2.2rem;
  font-weight: 600;
}

.welcome-message p {
  color: #6b7280;
  font-size: 1.3rem;
  line-height: 1.7;
  max-width: 700px;
  margin: 0 auto;
}

/* Responsive design */
@media (max-width: 992px) {
  .sales-analysis {
    width: 98%;
    padding: 20px;
  }
  .title {
    font-size: 2rem;
  }
  .subtitle {
    font-size: 1.1rem;
  }
  .analyze-btn {
    padding: 16px 32px;
    font-size: 1.1rem;
  }
  .summary-cards {
    grid-template-columns: 1fr;
  }
  .card {
    height: auto;
    padding: 20px;
  }
  .card-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
    margin-right: 15px;
  }
  .card-content .value {
    font-size: 1.8rem;
  }
  .chart-wrapper {
    min-height: 350px;
  }
  .chart-canvas {
    height: 320px !important;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 1.8rem;
  }
  .charts-section {
    grid-template-columns: 1fr;
  }
  .card-content .value {
    font-size: 1.6rem;
  }
  .chart-wrapper {
    min-height: 300px;
    padding: 15px;
  }
  .chart-canvas {
    height: 280px !important;
  }
  .welcome-message {
    padding: 50px 20px;
  }
  .welcome-icon {
    font-size: 4rem;
  }
  .welcome-message h2 {
    font-size: 1.8rem;
  }
  .welcome-message p {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .sales-analysis {
    padding: 15px;
  }
  .title {
    font-size: 1.6rem;
  }
  .analyze-btn {
    padding: 14px 24px;
    font-size: 1rem;
  }
  .card {
    padding: 16px;
  }
  .card-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    margin-right: 15px;
  }
  .card-content h4 {
    font-size: 1.1rem;
  }
  .card-content .value {
    font-size: 1.4rem;
  }
  .card-content .detail {
    font-size: 1rem;
  }
  .sar-icon {
    width: 22px;
    height: 22px;
  }
}
</style>