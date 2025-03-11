<!-- frontend/src/components/newEstimateRequestModal.vue -->
<template>
    <teleport to="body">
        <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">

            <!-- 회사명 입력 모달 -->
            <div v-if="showCompanyModal" class="modal">
                <div class="modal-content">
                    <h3>회사명을 입력하세요</h3>
                    <input type="text" v-model="companyName" placeholder="회사명을 입력하세요">
                    <button @click="saveCompanyName">확인</button>
                </div>
            </div>

            <!-- 견적서 모달 -->
            <div v-else ref="quotationModal" class="quotation-page">

                <div class="quotation-container">

                    <!-- 견적서 제목 -->
                    <h1>見積書</h1> 
        
                    <!-- 견적 정보 입력 -->
                    <div class="quotation-header">
                        <div class="left">
                            <p><strong>문서번호 : </strong> {{ documentNumber }}</p>
                            <p><strong>날짜 : </strong> {{ currentDate }}</p>
                        </div>
                        <div class="right">
                            <p><strong>공급자 : </strong> 주식회사 이필</p>
                            <p><strong>대표이사 : </strong> 황 인 규</p>
                            <p><strong>주소 : </strong> 서울특별시 송파구 충민로 167 문정역 테라타워 B동 1210호</p>
                            <p><strong>연락처 : </strong> TEL: 02-2054-8273 / FAX: 02-2054-8275</p>
                        </div>
                    </div>

                    <hr />

                    <!-- 수신 정보 -->
                    <div class="buyer-info">
                        <p  class="buyer"><strong>수신 : </strong> {{ companyName }}</p>
                        <p>하기와 같이 견적합니다.</p>
                    </div>  

                    <hr />

                    <!-- 견적 테이블 -->
                    <table class="quotation-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>강종</th>
                                <th>구분</th>
                                <th>중량</th>
                                <th>금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in quotationItems" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.steelType }}</td>
                                <td>{{ item.category }}</td>
                                <td>{{ formatNumber(item.weight) }} kg</td>
                                <td>{{ item.price }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <hr />

                    <!-- 총 금액 -->
                    <div class="total-sum-container">
                        <p><strong>합계 금액 : </strong> {{ totalAmount }} 원 (부과세 별도)</p>
                    </div>
                    
                    <!-- 버튼 -->
                    <div class="result-container">
                        <button class="btn btn-print" @click="printQuotation">견적서 출력</button>
                        <button class="btn btn-close" @click="closeModal">닫기</button>
                    </div>
                    
                    <!-- 특이사항 -->
                    <table class="special-notes">
                        <thead>
                            <tr>
                                <th>특 이 사 항</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1. 운송비 별도</td>
                            </tr>
                        </tbody>
                    </table>

                </div>

            </div>
        </div>
    </teleport>
</template>
  
<script>
    import html2canvas from "html2canvas";
    import jsPDF from "jspdf";
    
    export default {
        name: "newEstimateRequestModal",
        props: {
            isOpen: Boolean,        // 모달 창 상태
            userData: Object,       // 사용자 정보
            quotationItems: Array   // 견적 데이터 (강종, 구분, 중량, 금액)
        },
        data() {
            return {
                showCompanyModal: true,
                companyName: ""
            };
        },
        emits: ["close"], // 부모 컴포넌트에 모달 닫기 이벤트 전달
        computed: {
            currentDate() {
                let today = new Date();
                let year = today.getFullYear();
                let month = String(today.getMonth() + 1).padStart(2, "0");
                let day = String(today.getDate()).padStart(2, "0");
                return `${year}년 ${month}월 ${day}일`;
            },
            documentNumber() {
                let today = new Date();
                let year = today.getFullYear();
                let month = String(today.getMonth() + 1).padStart(2, "0");
                let day = String(today.getDate()).padStart(2, "0");
                return `IP-${year}${month}${day}-`;
            },
            totalAmount() {
                return this.quotationItems.reduce((sum, item) => sum + parseInt(item.price.replace(/[^0-9]/g, ""), 10), 0).toLocaleString();
            }
        },
        methods: {
            closeModal() {
                this.$emit("close");
            },
            async printQuotation() {
                const modalElement = this.$refs.quotationModal; // 모달창을 참조

                if (!modalElement) {
                    console.error("모달 요소를 찾을 수 없습니다.");
                    return;
                }

                // ✅ 버튼 숨기기
                const buttons = modalElement.querySelectorAll(".result-container");
                buttons.forEach(button => button.style.display = "none");   //  PDF 변환 시 버튼 숨기기
                const TotalCost = modalElement.querySelector(".total-sum-container");
                // const originalMargin = TotalCost.style.marginBottom;
                // TotalCost.style.marginBottom = "600px";                      //  PDF 변환 시 여백 추가

                let dummySpacer = document.createElement("div");

                if (TotalCost) {
                    dummySpacer.style.height = "50px"; // ✅ PDF 변환 시 여백 추가
                    TotalCost.parentNode.insertBefore(dummySpacer, TotalCost.nextSibling);
                }
                
                try {
                    // ✅ html2canvas로 캡처하기 전에 **잠시 기다려서 마진 적용** (DOM 반영 시간 확보)
                    await new Promise(resolve => setTimeout(resolve, 100));

                    const canvas = await html2canvas(modalElement, {
                        scale: 2,            // 고해상도 캡처
                        useCORS: true,       // CORS 문제 해결
                        allowTaint: true,    // 외부 이미지 허용
                        logging: false,
                        backgroundColor: null // ✅ 배경색 제거 (투명)
                    });

                    const imgData = canvas.toDataURL("image/jpeg", 0.8); // 캡처한 내용을 JPEG로 변환
                    const pdf = new jsPDF({
                        orientation: "portrait", // 세로 방향
                        unit: "mm",
                        format: "a4",
                    });

                    // ✅ PDF 페이지 크기(A4 기준)
                    const pageWidth = 210; // A4 가로 길이(mm)
                    const pageHeight = 297; // A4 세로 길이(mm)

                    // ✅ 캔버스 이미지 크기 조정
                    const imgWidth = pageWidth;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    let yPosition = 0; // 페이지 상단 기준 위치

                    while (yPosition < imgHeight) {
                        pdf.addImage(imgData, "JPEG", 0, -yPosition, imgWidth, imgHeight);
                        yPosition += pageHeight; // 다음 페이지로 이동

                        if (yPosition < imgHeight) {
                            pdf.addPage(); // 새 페이지 추가
                        }
                    }

                    pdf.save("견적서.pdf"); // PDF 파일 저장
                } catch (error) {
                    console.error("PDF 생성 중 오류 발생:", error);
                } finally {
                    // 버튼 다시 보이기
                    buttons.forEach(button => button.style.display = "flex");
                    // ✅ 가짜 마진 요소 제거
                    if (dummySpacer) {
                        dummySpacer.remove();
                    }
                }
            },
            formatNumber(value) {
                return value ? value.toLocaleString() : "0";
            },
            saveCompanyName() {
                if (!this.companyName) {
                    alert("회사명을 입력해주세요!");
                    return;
                }
                this.showCompanyModal = false;
            },
        }
    };
</script>
  
<style scoped>
    /* 모달 스타일 */
    .modal-overlay {
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* 회사명 입력 필드 */
    .modal {
        max-width: 90%;
        background: white;
        border-radius: 10px;
        text-align: center;
    }
    .modal-content {
        width: 300px;
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    }
    .modal-content input {
        width: 90%;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid black;
        margin: 10px 0;
    }
    .modal-content button {
        width: 50%;
        background-color: #007bff;
        color: white;
        padding: 10px 15px;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        font-size: 14px;
    }
    .modal-content button:hover {
        background-color: #0056b3;
    }

    /* 견적서 입력 필드 */
    .quotation-page {
        background-color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
    }
    .quotation-container {
        width: 80%;
        margin: 0 auto;
        padding: 20px;
        border: 2px solid black;
        text-align: center;
    }

    /* 공급자 입력 필드 */
    .quotation-header {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
    }
    .left, .right {
        text-align: left;
    }

    /* 수신자 입력 필드 */
    .buyer-info .buyer {
        text-align: left;
    }

    /* 견적 내용 입력 필드 */
    .quotation-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    .quotation-table th, .quotation-table td {
        border: 1px solid black;
        padding: 10px;
        text-align: center;
    }

    /* 합계 금액 입력 필드 */
    .total-sum-container {
        text-align: right;
        margin-top: 20px;
        font-size: 18px;
    }

    /* 결과 버튼 필드 */
    .result-container {
        margin-top: 20px;
        display: flex;
        text-align: center;
        justify-content: center;
        gap: 10px;
    }
    .result-container .btn-print {
        padding: 10px 15px;
        background-color: blue;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
    }
    .result-container .btn-print:hover {
        background-color: darkblue;
    }
    .result-container .btn-close {
        padding: 10px 15px;
        background-color: blue;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
    }
    .result-container .btn-close:hover {
        background-color: darkblue;
    }

    /* 특이 사항 */
    .special-notes {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        font-size: 14px;
    }
    .special-notes th {
        background-color: #ddd;
        padding: 10px;
        text-align: center;
        border: 1px solid #ccc;
    }
    .special-notes td {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: left;
    }

    /* 기본사항 */
    h2 {
        text-align: center;
        margin-bottom: 20px;
    }
    input {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: center;
    }
    th {
        background-color: #f4f4f4;
    }
    .btn {
        padding: 10px 15px;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        font-size: 14px;
    }
</style>
  