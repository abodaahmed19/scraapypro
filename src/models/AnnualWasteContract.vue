<template>
  <div dir="rtl" class="contract-container">
    <!-- En-tête avec filigrane -->
    <div class="contract-watermark">
      <div class="watermark-text">عقد رسمي</div>
    </div>
    
    <div class="contract-header">
      <div class="header-decoration">
        <div class="decoration-line"></div>
        <div class="header-icon">📄</div>
        <div class="decoration-line"></div>
      </div>
      
      <h1>عقد إلكتروني سنوي لجمع ونقل النفايات الخطرة غير القابلة لإعادة التدوير (للتخلص الآمن)</h1>
      <p class="subtitle">المُعد وفقًا لنظام العقود الإلكترونية واللوائح البيئية في المملكة العربية السعودية</p>
      
      <div class="contract-number">
        <span>رقم العقد التسلسلي: {{ contractNumber }}</span>
      </div>
    </div>

    <div class="contract-body">
      <div class="section-divider">
        <span>بداية العقد</span>
      </div>

      <p class="basmalha"><strong>بسم الله الرحمن الرحيم</strong></p>
      <p class="agreement-place">تم الاتفاق في مدينة <strong>{{ location }}</strong> في يوم <strong>{{ date }}</strong> الموافق <strong>{{ hijriDate }}</strong> هـ بين:</p>

      <div class="party-section">
        <div class="party-card">
          <h2>الطرف الأول (طالب الخدمات): {{ firstPartyName }}</h2>
          <p>هو مدخل البيانات في منصة سكرابي (طالب الخدمات) ويتم تعريف الطرف الأول تعريفًا قانونيًا من خلال:</p>
          <ul class="styled-list">
            <li>بيانات التسجيل الإلكتروني في منصة "سكرابي".</li>
            <li>الوثائق الرسمية المرفقة في الملف الإلكتروني.</li>
            <li>يُعتبر التفعيل الناجح للحساب على المنصة بمثابة موافقة على التعريف الرسمي ويشار إليه فيما بعد بالطرف الأول.</li>
          </ul>
        </div>

        <div class="party-card">
          <h2>الطرف الثاني (مقدم الخدمات): {{ secondPartyName }}</h2>
          <p>هو مدخل البيانات في منصة سكرابي (مقدم الخدمات) ويتم تعريف الطرف الثاني تعريفًا قانونيًا من خلال:</p>
          <ul class="styled-list">
            <li>بيانات التسجيل الإلكتروني في منصة "سكرابي".</li>
            <li>الوثائق الرسمية المرفقة في الملف الإلكتروني.</li>
            <li>يُعتبر التفعيل الناجح للحساب على المنصة بمثابة موافقة على التعريف الرسمي ويشار إليه فيما بعد بالطرف الثاني. ومتخصص في التخلص الآمن من النفايات الخطرة.</li>
          </ul>
        </div>
      </div>

      <div class="section-divider">
        <span>بنود العقد</span>
      </div>

      <div class="contract-articles">
        <article class="contract-article">
          <h2>المادة رقم 1 – التمهيد:</h2>
          <p>حيث إن الطرف الأول يزاول نشاطًا بيئيًا أو تجاريًا أو خدميًا أو صناعيًا وينتج لديه كمية من النفايات الخطرة ويرغب في التخلص منها بصفة دورية بيعًا أو إتلافًا، وحيث إن الطرف الثاني شركة مختصة في مجال إعادة التدوير والنقل المرخص وتملك الخبرة الكافية في مجالها ومرخصة من المركز الوطني لإدارة النفايات (موان)، فقد اتفق الطرفان على إبرام هذا العقد الإلكتروني وفقًا لأحكام نظام التعاملات الإلكترونية السعودي الصادر بموجب المرسوم الملكي رقم (م/18) وتاريخ 8/1/1428هـ الموافق 26/1/2007م ولوائح إدارة النفايات. وبناءً على حسن النوايا وتحديد الحقوق والالتزامات لكل طرف.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 2 – السلطة المؤسسية:</h2>
          <p>يتعهد كل طرف بأنه مرخص حسب الأصول ولديه السلطة الكاملة للدخول في هذا العقد، وأن دخوله في هذه الاتفاقية لا يتعارض مع أي أنظمة أو قوانين.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 3 – آلية التحقق:</h2>
          <p>تخضع هوية الأطراف لتحقق إلكتروني من خلال:</p>
          <ul class="styled-list">
            <li>مطابقة البيانات مع السجل التجاري عبر "وزارة التجارة".</li>
            <li>التحقق من تراخيص النفايات عبر "منصة موان".</li>
          </ul>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 4 – الغرض من الاتفاقية:</h2>
          <p>الغرض من هذه الاتفاقية هو قيام الطرف الثاني بالتخلص من النفايات الخطرة غير القابلة لإعادة التدوير الناتجة عن أعمال الطرف الأول بمقابل مالي، وفقًا للأسعار المحددة في المادة (8).</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 5 – التعريفات</h2>
          <h3>النفايات الخطرة غير القابلة للتدوير:</h3>
          <p>المواد التي لا يمكن إعادة استخدامها أو تدويرها وتصنف خطرة حسب نظام (موان)، وتشمل:</p>
          <ul class="styled-list">
            <li>السوائل الكيميائية الخطرة.</li>
            <li>الأقمشة الملوثة بالمواد الخطرة.</li>
            <li>بطاريات الليثيوم التالفة.</li>
            <li>مخلفات العمليات الصناعية الخطرة.</li>
          </ul>

          <h3>الشهادة البيئية:</h3>
          <p>وثيقة تصدر من (موان) تثبت التخلص الآمن وفق المعايير.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 6 – مدة الاتفاقية:</h2>
          <p>سنة ميلادية تبدأ من تاريخ التوقيع الإلكتروني، مع تجديد تلقائي من خلال التوقيع الإلكتروني عبر المنصة (سكرابي) لمدة مماثلة ما لم يُخطر أحد الطرفين الآخر برغبته في عدم التجديد قبل 30 يومًا.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 7 – النطاق المكاني:</h2>
          <p>ينطبق العقد على مواقع الطرف الأول داخل المملكة العربية السعودية والمحددة في الجدول أدناه:</p>
          
          <div class="table-container">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>ايميل</th>
                  <th>هاتف اتصال</th>
                  <th>الموظف المسؤول</th>
                  <th>العنوان المكاني</th>
                  <th>المدينة</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(location, index) in locations" :key="index">
                  <td>{{ location.email }}</td>
                  <td>{{ location.phone }}</td>
                  <td>{{ location.responsible }}</td>
                  <td>{{ location.address }}</td>
                  <td>{{ location.city }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 8 – قيمة الاتفاقية:</h2>
          <ul class="styled-list">
            <li>قيمة العقد: يلتزم الطرف الأول بسداد قيمة إصدار عقد الخدمة الإلكتروني بتحويل بنكي فور إصدار الفاتورة الإلكترونية من منصة سكرابي.</li>
            <li>قيمة التخلص من النفايات: اتفق الطرفان على الأسعار التالية (غير شاملة ضريبة القيمة المضافة):</li>
          </ul>

          <div class="table-container">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>نوع النفايات</th>
                  <th>السعر (ريال)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(waste, index) in wastePrices" :key="index">
                  <td>{{ waste.type }}</td>
                  <td>{{ waste.price }} / كغم</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <!-- المواد من 9 إلى 24 -->
        <article class="contract-article">
          <h2>المادة رقم 9 – آلية الدفع:</h2>
          <ul class="styled-list">
            <li>يلتزم الطرف الأول بسداد قيمة إصدار عقد الخدمة الإلكتروني بتحويل بنكي فور إصدار الفاتورة الإلكترونية من منصة سكرابي.</li>
            <li>يلتزم الطرف الأول بسداد قيمة التخلص بتحويل بنكي فور إصدار الفاتورة الإلكترونية من منصة سكرابي.</li>
          </ul>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 10 – التزامات الطرف الأول:</h2>
          <ul class="styled-list">
            <li>توفير قائمة مفصلة بأنواع وكميات النفايات الخطرة عبر منصة "سكرابي".</li>
            <li>إصدار تصاريح الدخول والخروج.</li>
            <li>تخزين النفايات في حاويات معتمدة من (موان) ومُصنفة حسب الخطورة.</li>
            <li>التأكد من خلو النفايات من المواد المشعة.</li>
            <li>التواصل عبر منصة سكرابي لجميع العمليات.</li>
          </ul>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 11 – التزامات الطرف الثاني:</h2>
          <ul class="styled-list">
            <li>الالتزام بأنظمة الصحة والسلامة.</li>
            <li>إصدار نموذج الاستلام والتسليم لكل شحنة.</li>
            <li>استخدام مركبات وناقلات مرخصة لنقل النفايات الخطرة.</li>
            <li>إصدار "شهادة التخلص الآمن" لكل شحنة وفقًا لنموذج (موان).</li>
          </ul>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 12 – استقلالية المواد:</h2>
          <p>بطلان أي بند لا يؤثر على بقية الأحكام.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 13 – سرية المعلومات:</h2>
          <p>يمنع كشف شروط العقد لأي طرف ثالث دون موافقة إلكترونية عبر موقع سكرابي من الطرفين.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 14 – التنازل للآخرين:</h2>
          <p>لا يجوز التنازل عن العقد دون موافقة إلكترونية عبر موقع سكرابي من الطرف الأول.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 15 – التعاقد من الباطن:</h2>
          <p>لا يجوز للطرف الثاني التعاقد من الباطن مع الاحتفاظ بمسؤوليته الكاملة.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 16 – كفاية العطاء:</h2>
          <p>يقر الطرفان بكفاية الأسعار لتغطية الالتزامات.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 17 – شمولية الاتفاقية:</h2>
          <p>هذا العقد يمثل الاتفاق الكامل بين الطرفين.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 18 – القوة القاهرة:</h2>
          <p>لا يتحمل الطرفان المسؤولية في حالات القوة القاهرة.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 19 – التعديلات:</h2>
          <p>تتم التعديلات عبر منصة سكرابي وبالتوقيع الإلكتروني من الطرفين.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 20 – المسؤولية وفسخ العقد:</h2>
          <p>يحمل الطرف الثاني المسؤولية الكاملة عن أي مخالفات بيئية أثناء النقل أو التخلص.</p>
          <p>للطرف الأول حق الفسخ في حال:</p>
          <ul class="styled-list">
            <li>عدم الحصول على الشهادة البيئية لأي شحنة.</li>
            <li>تكرار المخالفات البيئية المسجلة من (موان).</li>
            <li>في حال الإخلال بالالتزامات، للطرف الأول حق الإنهاء بشرط:</li>
          </ul>
          <ol class="ordered-list">
            <li>إخطار مسبق 30 يومًا.</li>
            <li>سداد جميع المستحقات.</li>
          </ol>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 21 – تسوية الخلافات والمنازعات:</h2>
          <p>تسوى المنازعات عبر المركز السعودي للتحكيم التجاري بمدينة الرياض، بلغة العقد (العربية).</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 22 – التحديثات:</h2>
          <p>يلتزم كل طرف بتحديث بياناته على المنصة خلال (5) أيام عمل من أي تغيير في:</p>
          <ul class="styled-list">
            <li>معلومات التواصل.</li>
            <li>الوثائق الرسمية.</li>
            <li>العناوين المسجلة.</li>
          </ul>
          <p>يشترط للتجديد: تقديم الطرف الثاني شهادة تجديد ترخيص (موان) قبل شهر من انتهاء العقد.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 23 – الإخطارات:</h2>
          <p>تتم المراسلات عبر البريد الإلكتروني أو العنوان الوطني.</p>
        </article>

        <article class="contract-article">
          <h2>المادة رقم 24 – نسخ العقد:</h2>
          <p>تم إعداد العقد إلكترونيًا عبر منصة سكرابي وملزم للطرفين.</p>
        </article>
      </div>

      <div class="signature-section">
        <div class="signature-block">
          <div class="signature-line"></div>
          <p>توقيع الطرف الأول: {{ firstPartyName }}</p>
        </div>
        
        <div class="signature-block">
          <div class="signature-line"></div>
          <p>توقيع الطرف الثاني: {{ secondPartyName }}</p>
        </div>
      </div>

      <div class="contract-footer">
        <p class="closing">والله الموفق،</p>
        <p class="print-date">تم إنشاء هذا العقد إلكترونياً في {{ date }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contractNumber: {
      type: String,
      default: '00000000000'
    },
    location: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    hijriDate: {
      type: String,
      required: true
    },
    firstPartyName: {
      type: String,
      required: true
    },
    secondPartyName: {
      type: String,
      required: true
    },
    locations: {
      type: Array,
      default: () => [
        {
          email: 'xxxxx',
          phone: 'xxxxx',
          responsible: 'xxxxx',
          address: 'xxxxx',
          city: 'xxxxx'
        }
      ]
    },
    wastePrices: {
      type: Array,
      default: () => [
        { type: 'مخلفات سائل تبريد الراديتر', price: '3,5' },
        { type: 'مخلفات سائل غسيل المحركات', price: '3,5' },
        { type: 'مخلفات بطاريات الليثيوم', price: '4.5' },
        { type: 'الأقمشة الملوثة', price: '2.5' }
      ]
    }
  }
}
</script>

<style scoped>
.contract-container {
  font-family: 'Tajawal', 'Segoe UI', 'Arial', sans-serif;
  line-height: 1.8;
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  color: #2c3e50;
  position: relative;
}

.contract-watermark {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
  opacity: 0.03;
}

.watermark-text {
  position: absolute;
  font-size: 120px;
  font-weight: bold;
  color: #1a3b5d;
  transform: rotate(-45deg);
  top: 30%;
  left: 10%;
  white-space: nowrap;
}

.contract-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #1a3b5d;
  position: relative;
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.decoration-line {
  height: 2px;
  width: 80px;
  background-color: #c9ab62;
  margin: 0 15px;
}

.header-icon {
  font-size: 24px;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #1a3b5d;
  font-weight: 700;
}

.subtitle {
  text-align: center;
  font-style: italic;
  color: #5c6bc0;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.contract-number {
  background-color: #f5f7fb;
  padding: 10px 15px;
  border-radius: 6px;
  display: inline-block;
  margin-top: 15px;
  border: 1px dashed #1a3b5d;
}

.contract-number span {
  font-weight: bold;
  color: #1a3b5d;
}

.section-divider {
  text-align: center;
  margin: 35px 0;
  position: relative;
}

.section-divider span {
  background-color: #fff;
  padding: 0 20px;
  position: relative;
  z-index: 1;
  color: #5c6bc0;
  font-weight: 500;
}

.section-divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e0e0e0;
  z-index: 0;
}

.basmalha {
  text-align: center;
  font-size: 1.3rem;
  margin: 25px 0;
  color: #1a3b5d;
}

.agreement-place {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.party-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 40px;
}

.party-card {
  background-color: #f9fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.party-card h2 {
  color: #1a3b5d;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.contract-articles {
  margin-bottom: 40px;
}

.contract-article {
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.contract-article h2 {
  color: #1a3b5d;
  margin-bottom: 12px;
  font-size: 1.3rem;
  padding-right: 15px;
  border-right: 4px solid #5c6bc0;
}

.contract-article h3 {
  color: #2c3e50;
  margin: 15px 0 10px;
  font-size: 1.15rem;
}

.styled-list {
  padding-right: 25px;
  margin: 15px 0;
  text-align: right;
  list-style-type: none;
}

.styled-list li {
  margin: 10px 0;
  padding-right: 25px;
  position: relative;
}

.styled-list li::before {
  content: "•";
  color: #5c6bc0;
  font-weight: bold;
  position: absolute;
  right: 0;
}

.ordered-list {
  padding-right: 30px;
  margin: 15px 0;
  list-style-type: decimal;
}

.ordered-list li {
  margin: 10px 0;
}

.table-container {
  overflow-x: auto;
  margin: 20px 0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95em;
  direction: rtl;
  text-align: right;
  min-width: 600px;
}

.styled-table th,
.styled-table td {
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: right;
}

.styled-table thead {
  background-color: #1a3b5d;
  color: #ffffff;
  font-weight: bold;
}

.styled-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.styled-table tbody tr:hover {
  background-color: #f0f5ff;
}

.signature-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin: 50px 0 30px;
}

.signature-block {
  text-align: center;
}

.signature-line {
  height: 1px;
  background-color: #333;
  margin-bottom: 10px;
  position: relative;
}

.signature-line::before {
  content: "التوقيع";
  position: absolute;
  top: -10px;
  right: 50%;
  transform: translateX(50%);
  background-color: #fff;
  padding: 0 10px;
  font-size: 0.9rem;
  color: #777;
}

.contract-footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.closing {
  font-style: italic;
  color: #1a3b5d;
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.print-date {
  color: #777;
  font-size: 0.9rem;
}

@media print {
  .contract-container {
    box-shadow: none;
    border: none;
    padding: 0;
  }
  
  .contract-watermark {
    opacity: 0.05;
  }
}

@media (max-width: 768px) {
  .contract-container {
    padding: 20px;
  }
  
  .party-section {
    grid-template-columns: 1fr;
  }
  
  .signature-section {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 1.4rem;
  }
}
</style>