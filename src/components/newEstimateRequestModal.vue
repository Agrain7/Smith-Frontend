<!-- frontend/src/components/newEstimateRequestModal.vue -->
<template>
    <teleport to="body">
        <div v-show="isOpen" class="modal-overlay" @click.self="closeModal">

            <!-- 회사명 입력 모달 -->
            <div v-if="showCompanyModal" class="modal">
                <div class="modal-content">
                    <h3>회사명을 입력하세요</h3>
                    <input type="text" v-model="companyName" placeholder="회사명을 입력하세요">
                    <p v-if="companyNameError" style="color: red; font-size: 12px;">회사명을 입력하세요.</p>
                    <button @click="saveCompanyName">확인</button>
                </div>
            </div>

            <!-- 견적서 모달 -->
            <div v-if="showEstimateModal" ref="quotationContents" id="contents1" class="quotation-contents">
                
                <div ref="quotationModal" id="contents2" class="quotation-page">

                    <div id="contents3" class="quotation-container">


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
                                        <td>{{ companyName }}</td>
                                        </tr>
                                        <tr>
                                        <th>프로젝트명</th>
                                        <td></td>
                                        </tr>
                                        <tr>
                                        <th>담당자</th>
                                        <td>{{ this.userData.name }}</td>
                                        </tr>
                                        <tr>
                                        <th>견적일</th>
                                        <td></td>
                                        </tr>
                                        <tr>
                                        <th>출고일</th>
                                        <td></td>
                                        </tr>
                                        <tr>
                                        <th>배송방법</th>
                                        <td></td>
                                        </tr>
                                        <tr>
                                        <th>결제방법</th>
                                        <td></td>
                                        </tr>
                                        <tr>
                                        <th>견적기한</th>
                                        <td></td>
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
                                        <th>담당자</th>
                                        <td></td>
                                        </tr>
                                        <tr>
                                        <th>전화</th>
                                        <td>02-2054-8273</td>
                                        </tr>
                                        <tr>
                                        <th>mobile</th>
                                        <td></td>
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
                                        <td></td>
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
                        <span>견적금액 : ₩ &nbsp;</span><span id="total-amount">{{ totalAmount.toLocaleString() }}</span> (VAT 별도)
                        </div>

                        <!-- 참고사항 및 특이사항 -->
                        <div class="notes-section">
                            <div class="notes">
                                <h3>참고사항</h3>
                                <div class="Divideline"></div>
                                <ul>
                                <li> 25t 이하는 운송비가 발생할수 있습니다.</li>
                                <li>세부 도면 확인 후 견적금액이 다를 수 있습니다.</li>
                                <li>기타 요청 사항은 별도의 협의가 필요합니다.</li>
                                </ul>
                            </div>
                            <div class="special-notes">
                                <h3>특이사항</h3>
                                <div class="Divideline"></div>
                                <p>입금계좌 - 기업은행 : 000-0000-0000-000 (주)이필</p>
                            </div>
                        </div>

                        <div class="Divideline"></div>

                        <!-- 부품 표 섹션 -->
                        <div class="parts">
                            <table>
                                <thead>
                                <tr>
                                    <th>순번</th>
                                    <th>강종</th>
                                    <th>구분</th>
                                    <th>중량</th>
                                    <th>금액(원)</th>
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
                                <!-- 빈 행 -->
                                <tr class="empty-row">
                                    <td colspan="5">&nbsp;</td>
                                </tr>
                                <!-- 요약 행 -->
                                <tr class="summary-row">
                                    <td colspan="4" style="text-align:right;">공급가액 :</td>
                                    <td>{{ totalAmount.toLocaleString() }} 원</td>
                                    
                                </tr>
                                <tr class="summary-row">
                                    <td colspan="4" style="text-align:right;">부가세 (10%) :</td>
                                    <td>{{ vatAmount.toLocaleString() }} 원</td>
                                    
                                </tr>
                                <tr class="summary-row">
                                    <td colspan="4" style="text-align:right;">합계금액 :</td>
                                    <td>{{ finalAmount.toLocaleString() }} 원</td>
                                    
                                </tr>
                                </tbody>
                            </table>
                        </div>


        


                    </div>

                    <!-- 버튼 -->
                    <div class="result-container">
                        <button class="btn btn-print" @click="printQuotation">견적서 출력</button>
                        <button class="btn btn-close" @click="closeModal">닫기</button>
                    </div>

                </div>
                
            </div>            
            
        </div>
        
    </teleport>
</template>
  
<script>
    import axios from 'axios';
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
                docNumber: '',
                showCompanyModal: true,
                showEstimateModal: false,
                companyName: "",
                companyNameError: false,
            };
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
            
            this.disableScroll;
        },
        emits: ["close"], // 부모 컴포넌트에 모달 닫기 이벤트 전달
        computed: {
            disableScroll() {
                if (this.isOpen) {
                    document.documentElement.style.overflow = 'hidden'; // 스크롤 막기
                    
                } else {
                    document.documentElement.style.overflow = 'auto'; // 스크롤 복원
                }
                return this.isOpen; // 값 반환 (실제 사용은 안 하지만 computed 요구사항)
            },
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
                return this.quotationItems.reduce((sum, item) => sum + parseInt(item.price.replace(/[^0-9]/g, ""), 10), 0);
            },
            vatAmount() {
                return Math.round(this.totalAmount * 0.1);
            },
            finalAmount() {
                return this.totalAmount + this.vatAmount;
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
                
                try {
                    // ✅ html2canvas로 캡처하기 전에 **잠시 기다려서 마진 적용** (DOM 반영 시간 확보)
                    await this.$nextTick(); // 비동기적으로 PDF 변환을 처리하기 위해 DOM 반영 시간을 확보

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

                    // PDF 파일 사용자 다운로드
                    pdf.save("견적서.pdf");
                    // pdf.save(`견적서_${this.docNumber}.pdf`);   // 문서번호를 파일명으로 지정


                    // PDF를 Blob 데이터로 변환
                    const pdfBlob = pdf.output("blob");
                    const pdfFile = new File([pdfBlob], "견적서.pdf", { type: "application/pdf" });

                    // 서버로 전송하는 함수 호출
                    await this.submitEstimate(pdfFile);


                } catch (error) {
                    console.error("PDF 생성 중 오류 발생:", error);
                } finally {
                    // 버튼 다시 보이기
                    buttons.forEach(button => button.style.display = "flex");
                }
            },
            async submitEstimate(pdfFile) {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const formData = new FormData();
                formData.append('estimateFile', pdfFile);
                formData.append('projectName', this.userData.email || "Unknown");
                formData.append('productType', this.companyName);

                try {
                    const uploadResponse = await axios.post(`${apiUrl}/api/upload-estimate`, formData, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            this.uploadProgress = percentCompleted;
                        }
                    });
                    
                    const uploadData = uploadResponse.data;
                    if (!uploadData.success) {
                        // alert(uploadData.message || "파일 업로드에 실패했습니다.");
                        return;
                    }

                    // ✅ 견적 요청 데이터 전송
                    const estimatePayload = {
                        username: this.userData.username,
                        name: this.userData.name,
                        phone: this.userData.phone,
                        projectName: this.userData.email || "Unknown",
                        productType: this.companyName,
                        fileUrl: uploadData.fileUrl,
                        fileName: uploadData.fileName
                    };

                    const estimateRes = await axios.post(`${apiUrl}/api/estimate-request`, estimatePayload, {
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (!estimateRes.data.success) {
                        // alert(estimateRes.data.message || "견적 요청 제출에 실패했습니다.");
                        return;
                    }

                    // alert("견적 요청이 제출되었습니다.");
                    // this.close();

                } catch (err) {
                    console.error("파일 업로드 또는 요청 전송 오류:", err);
                    // alert("전송 중 오류 발생");
                }
            },
            formatNumber(value) {
                return value ? value.toLocaleString() : "0";
            },
            saveCompanyName() {
                if (!this.companyName.trim()) {
                    this.companyNameError = true;
                    return;
                }
                this.companyNameError = false;
                this.showCompanyModal = false;
                this.showEstimateModal = true;
            },
        },
        beforeUnmount() {
            // ✅ 컴포넌트가 제거될 때 스크롤 복원
            document.documentElement.style.overflow = 'auto';
        }

    };
</script>
  
<style scoped>
/* 모달 스타일 */
body {
    width: 100%;
    overflow-x: auto; /* ✅ 가로 스크롤 가능하도록 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-overlay {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center; 
    align-items: center; /* 🔹 상단 정렬로 변경 */
    padding-top: 0;
    overflow-x: auto;
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
.quotation-contents {
    width: 98%;
    height: calc(100vh - 50px); /* 🔹 화면 전체 높이에서 padding 값을 제외한 높이 */
    display: flex;
    overflow: auto;  /* 🔹 스크롤은 여기에서만 활성화 */
    padding: 20px 0;  /* 🔹 스크롤 끝에 여백 추가 */
    position: absolute;
}
.quotation-contents::-webkit-scrollbar {
    width: 10px; /* 가로 스크롤바 */
    height: 10px; /* 세로 스크롤바 */
}
.quotation-contents::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* 스크롤바 색상 */
    border-radius: 5px;
}
.quotation-contents::-webkit-scrollbar-track {
    background: transparent; /* 트랙 배경 투명 처리 */
}
.quotation-page {
    width: 794px;
    min-height: 1120px; /* 🔹 최소 A4 크기 유지 */
    min-height: 1120px;
    max-height: 100vh; /* ✅ 모바일에서 화면 크기를 벗어나지 않도록 설정 */
    background: white;
    display: flex;
    flex-direction: column;
    position: relative;
    transform-origin: center center;
    transform: scale(1);
    flex-shrink: 0;
    padding: 20px;
    margin: auto;
}

.quotation-container {
    width: 90%;
    max-width: 100%; /* ✅ 화면 크기보다 커지지 않도록 설정 */
    border: 2px solid black;
    margin: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex-grow: 1;
}
 
/* 문서번호 표시 스타일 */
.header-info {
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;
}
  
.document-number {
    font-size: 0.85em;
    font-weight: bold;
}

.title {
    text-align: center;
    align-items: center;
    font-size: 1.6em;
    font-weight: bold;
    margin: 5px 0;
    margin-top: 50px;
    margin-bottom: 20px;
}

.info-section {
    width: 100%;
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
    width: 100%;
    margin-bottom: 15px;
    justify-content: space-between;
}

.parts h3 {
    margin-bottom: 3px;
    font-size: 0.95em;
    padding-bottom: 2px;
}

.parts table {
    width: 100%;
    text-align: center;
    align-items: center;
    margin: 0 auto;
    border-collapse: collapse;
}

.parts th,
.parts td {
    border: 1px solid #ddd;
    padding: 6px;
    vertical-align: middle;
}

.parts th {
    background-color: #f2f2f2;
}

/* 금액 열 오른쪽 정렬 */
.parts td:nth-child(4), .parts td:nth-child(5) {
    text-align: right;
    padding-right: 20px;
}


/* 합계, 부가세, 총합 */
.parts .summary-row td {
    font-weight: bold;
    text-align: right;
    padding-right: 20px;
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


.btn {
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 14px;
}
.Divideline {
    width: 100%;
    height: 2px;
    background-color: #ddd;
    margin-top: 5px;
    margin-bottom: 10px;
}

@media (max-width: 786px) {
    .quotation-page {
        transform: scale(0.6); /* ✅ 작은 화면에서 자동 축소 */
    }
}

</style>
  