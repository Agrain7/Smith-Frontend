<!-- frontend/src/components/Estimate.vue -->

<template>
    <div>
      <!-- 액션 버튼 -->
      <div class="action-buttons">
        <button @click="downloadPDF">PDF 출력</button>
        <button @click="downloadExcel">Excel 다운로드</button>
      </div>
      <!-- 견적서 컨테이너 -->
      <div class="container">
        <!-- 헤더: 문서번호 -->
        <div class="header-info">
          <div class="document-number" id="document-number">{{ docNumber }}</div>
        </div>
        <!-- 제목 -->
        <div class="title">견 적 서</div>
        <!-- 정보 섹션 -->
        <div class="info-section">
          <!-- 왼쪽 표 -->
          <div class="info-tables-left">
            <table>
              <tbody>
                <tr>
                  <th>회사명</th>
                  <td>회사명</td>
                </tr>
                <tr>
                  <th>프로젝트명</th>
                  <td>프로젝트명</td>
                </tr>
                <tr>
                  <th>담당자</th>
                  <td>홍길동 귀하</td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <th>견적일</th>
                  <td>견적일</td>
                </tr>
                <tr>
                  <th>출고일</th>
                  <td>수주완료 + 6일</td>
                </tr>
                <tr>
                  <th>배송방법</th>
                  <td>용차</td>
                </tr>
                <tr>
                  <th>결제방법</th>
                  <td>현금</td>
                </tr>
                <tr>
                  <th>견적기한</th>
                  <td>견적일로부터 5일 이내</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 오른쪽 표 -->
          <div class="info-tables-right">
            <table class="info-table">
              <tbody>
                <tr>
                  <th>회사명</th>
                  <td>(주)이필</td>
                </tr>
                <tr>
                  <th>영업담당</th>
                  <td>맹찬규 드림</td>
                </tr>
                <tr>
                  <th>전화</th>
                  <td>02-2054-8274</td>
                </tr>
                <tr>
                  <th>mobile</th>
                  <td>010-1234-5678</td>
                </tr>
                <tr>
                  <th>팩스</th>
                  <td>02-2054-8275</td>
                </tr>
                <tr>
                  <th>이메일</th>
                  <td>ipil@ipil.co.kr</td>
                </tr>
                <tr>
                  <th>유효기간</th>
                  <td>제출일로부터 30일</td>
                </tr>
                <tr>
                  <td colspan="2">서울시 송파구 송파대로 167, B동 1210호</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 견적금액 -->
        <div class="total-amount">
          견적금액 : ₩ <span id="total-amount">{{ totalAmount }}</span> (VAT 별도)
        </div>
        <!-- 참고사항 및 특이사항 -->
        <div class="notes-section">
          <div class="notes">
            <h3>참고사항</h3>
            <ul>
              <li>출고일자는 영업일(토, 일, 공휴일 제외)을 계산하여 표기됩니다.</li>
              <li>견적조건(납기, 수량, 도면 등) 변경 시 견적 내용이 변경될 수 있습니다.</li>
              <li>기타 요청 사항은 별도의 협의가 필요합니다.</li>
            </ul>
          </div>
          <div class="special-notes">
            <h3>특이사항</h3>
            <p>입금계좌 - 기업은행 : 000-0000-0000-000 (주)이필</p>
          </div>
        </div>
        <!-- 부품 표 섹션 -->
        <div class="parts">
          <h3>부품 표</h3>
          <table>
            <thead>
              <tr>
                <th>순번</th>
                <th>부품명</th>
                <th>강종</th>
                <th>규격</th>
                <th>수량</th>
                <th>단위</th>
                <th>단가(원)</th>
                <th>금액(원)</th>
                <th>제품</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>부품-1010</td>
                <td>열연철판</td>
                <td>4.5T 36.00x56.00</td>
                <td>40</td>
                <td>EA</td>
                <td>25,000</td>
                <td>1,000,000</td>
                <td>제품A</td>
              </tr>
              <tr>
                <td>2</td>
                <td>부품-2020</td>
                <td>열연철판 체크</td>
                <td>3.2T 1115x1130</td>
                <td>1</td>
                <td>EA</td>
                <td>1,200,000</td>
                <td>1,200,000</td>
                <td>제품B</td>
              </tr>
              <!-- 빈 행 -->
              <tr class="empty-row">
                <td colspan="9">&nbsp;</td>
              </tr>
              <!-- 요약 행 -->
              <tr class="summary-row">
                <td colspan="7" style="text-align:right;">공급가액 :</td>
                <td>2,200,000</td>
                <td></td>
              </tr>
              <tr class="summary-row">
                <td colspan="7" style="text-align:right;">부가세 (10%) :</td>
                <td>220,000</td>
                <td></td>
              </tr>
              <tr class="summary-row">
                <td colspan="7" style="text-align:right;">합계금액 :</td>
                <td>2,420,000</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FieldEstimate',
    data() {
      return {
        docNumber: '',
        totalAmount: '2,420,000'
      }
    },
    mounted() {
      // 날짜 포맷: YYYYMMDD
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}${month}${day}`;
  
      // 문서번호 생성 및 localStorage 업데이트
      let docCounter = localStorage.getItem('documentCounter');
      if (!docCounter) {
        docCounter = 1;
      } else {
        docCounter = parseInt(docCounter) + 1;
      }
      localStorage.setItem('documentCounter', docCounter);
      this.docNumber = `NO : ${formattedDate}-IE-${String(docCounter).padStart(4, '0')}`;
    },
    methods: {
      downloadPDF() {
        try {
          const element = this.$el.querySelector(".container");
          // PDF 생성 전 스케일 적용
          element.style.transform = "scale(0.95)";
          element.style.transformOrigin = "top left";
  
          const opt = {
            margin: [5, 5, 5, 5],
            filename: '견적서.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 1.5 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'avoid-all'] }
          };
  
          html2pdf().set(opt).from(element).save().then(() => {
            // PDF 생성 후 원래 크기로 복원
            element.style.transform = "scale(1)";
            element.style.transformOrigin = "unset";
          });
        } catch (error) {
          alert("PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
          console.error(error);
        }
      },
      downloadExcel() {
        try {
          const wb = XLSX.utils.book_new();
          const tables = this.$el.querySelectorAll(".container table");
          tables.forEach((table, index) => {
            let sheetName = `Sheet${index + 1}`;
            const precedingElement = table.previousElementSibling;
            if (precedingElement && precedingElement.tagName.toLowerCase() === 'h3') {
              sheetName = precedingElement.textContent.trim().substring(0, 31);
            }
            const ws = XLSX.utils.table_to_sheet(table);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
          });
          XLSX.writeFile(wb, "견적서.xlsx");
        } catch (error) {
          alert("Excel 파일 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
          console.error(error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  /* 기본 스타일 */
  body {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 0.75em;
    margin: 0;
    padding: 3mm;
    background-color: #ffffff;
    color: #333333;
  }
  
  .container {
    width: 210mm;
    min-height: 287mm;
    padding: 3mm;
    margin: auto;
    box-sizing: border-box;
    border: 1px solid #ddd;
    position: relative;
  }
  
  /* 문서번호 표시 스타일 */
  .header-info {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 5px;
  }
  
  .document-number {
    font-size: 0.85em;
    font-weight: bold;
  }
  
  .title {
    text-align: center;
    font-size: 1.6em;
    font-weight: bold;
    margin: 5px 0;
  }
  
  .info-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  
  .info-tables-left,
  .info-tables-right {
    width: 48%;
  }
  
  /* 왼쪽 표 스타일 */
  .info-tables-left table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 3px;
  }
  
  .info-tables-left th,
  .info-tables-left td {
    border: 1px solid #ddd;
    padding: 3px;
    text-align: left;
    vertical-align: middle;
  }
  
  .info-tables-left th {
    background-color: #f2f2f2;
    width: 30%;
  }
  
  /* 오른쪽 표 스타일 */
  .info-tables-right table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .info-tables-right th,
  .info-tables-right td {
    border: 1px solid #ddd;
    padding: 3px;
    text-align: left;
    vertical-align: middle;
  }
  
  .info-tables-right th {
    background-color: #f2f2f2;
    width: 30%;
  }
  
  /* 견적금액 스타일 */
  .total-amount {
    margin-bottom: 5px;
    font-size: 0.95em;
    font-weight: bold;
  }
  
  /* 참고사항 및 특이사항 섹션 */
  .notes-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  
  .notes,
  .special-notes {
    width: 48%;
  }
  
  .notes h3,
  .special-notes h3 {
    margin-bottom: 3px;
    font-size: 0.95em;
    border-bottom: 1px solid #ddd;
    padding-bottom: 2px;
  }
  
  .notes ul {
    list-style: decimal;
    padding-left: 15px;
    margin: 0;
  }
  
  .notes ul li {
    margin-bottom: 2px;
  }
  
  .special-notes p {
    margin: 0;
  }
  
  /* 부품 표 섹션 */
  .parts {
    margin-bottom: 5px;
  }
  
  .parts h3 {
    margin-bottom: 3px;
    font-size: 0.95em;
    border-bottom: 1px solid #ddd;
    padding-bottom: 2px;
  }
  
  .parts table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .parts th,
  .parts td {
    border: 1px solid #ddd;
    padding: 6px;
    text-align: left;
    vertical-align: middle;
  }
  
  .parts th {
    background-color: #f2f2f2;
  }
  
  /* 합계, 부가세, 총합 */
  .parts .summary-row td {
    font-weight: bold;
    text-align: right;
  }
  
  /* 금액 열 오른쪽 정렬 */
  .parts td:nth-child(8) {
    text-align: right;
  }
  
  /* 빈 행 스타일 */
  .parts .empty-row td {
    border: none;
    padding: 2px;
    height: 5px;
  }
  
  /* 액션 버튼 스타일 */
  .action-buttons {
    text-align: center;
    margin: 10px 0;
  }
  
  .action-buttons button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    margin: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
  }
  
  .action-buttons button:hover {
    background-color: #45a049;
  }
  
  /* 인쇄용 스타일 */
  @media print {
    .container {
      width: 210mm;
      height: auto;
      margin: 0;
      padding: 5mm;
      box-sizing: border-box;
      border: none;
      font-size: 0.7em;
      transform: scale(0.95);
      transform-origin: top left;
    }
    .header-info {
      margin-bottom: 1px;
    }
    .document-number {
      font-size: 0.75em;
    }
    .title {
      font-size: 1.4em;
      margin: 2px 0;
    }
    .info-section {
      margin-bottom: 1px;
    }
    .info-tables-left th,
    .info-tables-left td,
    .info-tables-right th,
    .info-tables-right td {
      padding: 2px;
      font-size: 0.7em;
    }
    .total-amount {
      font-size: 0.8em;
    }
    .notes-section {
      margin-bottom: 1px;
    }
    .notes h3,
    .special-notes h3 {
      font-size: 0.8em;
      margin-bottom: 1px;
    }
    .notes ul li {
      margin-bottom: 1px;
      font-size: 0.7em;
    }
    .special-notes p {
      font-size: 0.7em;
    }
    .parts h3 {
      font-size: 0.8em;
      margin-bottom: 1px;
    }
    .parts table th,
    .parts table td {
      padding: 4px;
      font-size: 0.7em;
    }
  }
  </style>
  