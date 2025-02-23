import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { customAxios } from '../../Common/CustomAxios';
import { useGraphDataStore } from '../store/graphStore';
import { useState } from "react";

//항목 이름 (한국어 -> 영어)
const engToKor = (name) => {
    const kor = {
        //수질 데이터
        "PTNM": '조사지점명',
        "WMYR": '측정연도',
        "WMOD": '측정월',
        "ITEMTEMP": '수온(°C)',
        "ITEMPH": 'pH',
        "ITEMDOC": 'DO(㎎/L)',
        "ITEMBOD": 'BOD(㎎/L)',
        "ITEMCOD": 'COD(㎎/L)',
        "ITEMTN": '총질소(㎎/L)',
        "ITEMTP": '총인(㎎/L)',
        "ITEMTRANS": '투명도(㎎/L)',
        "ITEMCLOA": '클로로필-a(㎎/L)',
        "ITEMEC": '전기전도도(µS/㎝)',
        "ITEMTOC": 'TOC(㎎/L)',

        //대기질 데이터
        "stationName": '조사지점명',
        "dataTime": "측정일",
        "so2Value": "아황산가스 농도(ppm)",
        "coValue": "일산화탄소 농도(ppm)",
        "o3Value": "오존 농도(ppm)",
        "no2Value": "이산화질소 농도(ppm)",
        "pm10Value": "미세먼지(PM10) 농도(㎍/㎥)",
        "pm25Value": "미세먼지(PM2.5)  농도(㎍/㎥)",
        
        //SEED 데이터
        "measuredDate": "측정 시간",
        "location": "측정 장소",
        "unit" : "소속",
        "period" : "저장 주기",
        "username": "사용자명",
        "hum": "습도",
        "temp": "기온",
        "tur": "탁도",
        "ph": "pH",
        "dust": "미세먼지",
        "dox": "용존산소량",
        "co2": "이산화탄소",
        "lux": "조도",
        "hum_EARTH": "토양 습도",
        "pre": "기압"
    };
    return kor[name] || name;
}

export default function RightSlidePage() {
    const { setData } = useGraphDataStore();

    const getTable = (type, id) => {
        let path = ''
        if (type === "OCEANQUALITY") {
            path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
        } else if (type === "AIRQUALITY") {
            path = `/air-quality/mine/chunk?dataUUID=${id}`;
        } else if (type === "SEED") {
            path = `/seed/mine/chunk?dataUUID=${id}`;
        }
    
        customAxios.get(path)
        .then((res)=>{
            let headers = Object.keys(res.data[0]).filter(
                (key) => key !== "id" && key !== "dataUUID" && key !== "saveDate" && key !== "dateString"
            );
    
            const attributesToCheck = [
                "co2",
                "dox",
                "dust",
                "hum",
                "hum_EARTH",
                "lux",
                "ph",
                "pre",
                "temp",
                "tur"  
            ];
            
            for (const attribute of attributesToCheck) {
                const isAllZero = res.data.every(item => item[attribute] === 0);
                // 해당 속성이 모두 0일 때, headers에서 제거
                if (isAllZero) {
                    headers = headers.filter(
                        (header) => header !== attribute
                    );
                }
            }
    
            headers = headers.map((header) => engToKor(header));
            
            // 각각의 딕셔너리에서 값만 추출하여 리스트로 변환
            const keysToExclude = ["id", "dataUUID", "saveDate", "dateString"];
    
            const values = res.data.map(item => {
                const filteredItem = Object.keys(item)
                    .filter(key => !keysToExclude.includes(key))
                    .reduce((obj, key) => {
                    obj[key] = item[key];
                    return obj;
                    }, {});
                return Object.values(filteredItem);
            });
    
            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...values];
            setData(recombined);
            localStorage.setItem("data", JSON.stringify(recombined));
            window.location.reload();
        })
        .catch((err) => console.log(err));
    };
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500, 
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const [sharedData, setSharedData] = useState([]);
    // 학생이 데이터 값 수정하기
    const [properties, setProperties] = useState(
        sharedData.length > 0 ? sharedData[0].properties.split(', ') : []
    );

    console.log(properties)
    const [cellValues, setCellValues] = useState(
        sharedData.length > 0 ? sharedData.map(row => row.data.split(', ')) : []
    );
    console.log(cellValues)
    const handleHeaderChange = (index, value) => {
        const updatedProperties = [...properties];
        updatedProperties[index] = value;
        setProperties(updatedProperties);
    };
    
    const handleCellChange = (rowIndex, cellIndex, value) => {
        const updatedCellValues = [...cellValues];
        updatedCellValues[rowIndex] = [...(updatedCellValues[rowIndex] || [])];
        updatedCellValues[rowIndex][cellIndex] = value;
        setCellValues(updatedCellValues);
    };

    const handleModify = () => {
        customAxios.put('/dataLiteracy/sequenceData', {
            properties: properties,
            data: cellValues,
            memo: sharedData[0].memo,
            classId: 1,
            chapterId: 1,
            sequenceId: 1
        })
            .then(() => alert("전송되었습니다."))
            .catch((err) => console.log(err));
    };

    const handleGetData = () => {
        customAxios.get('/dataLiteracy/sequenceData/base?classId=1&chapterId=1&sequenceId=1')
            .then((res) => {
                console.log(res.data);
                const properties = res.data[0].properties.split(',').map(item => item.trim());
                const dataRows = res.data.map(item => item.data.split(',').map(dataItem => dataItem.trim()));

                // 최종 결과 생성 (헤더 + 값)
                const recombined = [properties, ...dataRows];
                setData(recombined);
                localStorage.setItem("data", JSON.stringify(recombined));
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return(
        <div>
            <Slider {...settings}>
                <div>
                    <h4 style={{ margin: '1rem 3rem' }}>우리 학교의 공기질 측정하기</h4>
                    <div style={{  margin: '2rem 3rem' }}>
                        <div>
                            <span style={{ background: 'yellow' }}>1차시:  교실의 공기질 측정하기</span><br/>
                            2차시 : 학교의 여러장소 공기질 측정하기<br/>
                            3차시 : 교실과 학교의 장소별 공기질 비교하기
                        </div>
                    </div>

                    <div style={{ margin: '0 3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>학습 목표</div>
                    <div style={{ margin: '0 3rem' }}>
                        <div>
                            교실 공간의 공기질의 구성성분을 이해할 수 있다. <br/>
                            교실 공간의 공기질을 측정할 수 있다. <br/>
                            실내생활에서 공기질의 중요성을 인식한다.
                        </div>
                    </div>

                    <div style={{ margin: '1rem 3rem' }}>
                        <strong>[탐구]</strong> <br />
                        센서를 활용하여 교실의 공기질을 측정해 보자.
                    </div>

                    <div style={{ margin: '1rem 3rem' }}>
                        <strong>[탐구 목적]</strong> <br />
                        센서를 활용하여 교실의 대기 성분 농도를 분석한다.
                    </div>

                    <div style={{ fontWeight: 'bold', margin: '0 3rem' }}>
                        [탐구 방법]
                    </div>

                    <div style={{  margin: '0 3rem' }}>
                        <div>
                            1. 센서를 준비한다. <br/>
                            2. 서버에 연결한다. <br/>
                            3. 측정 및 기록한다.
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ margin: '1rem 3rem' }}>
                        <strong style={{ background: 'yellow' }}>[활동 1]</strong> <br />
                        센서에서 측정된 값을 읽고 현재 데이터 기록하기
                    </div>

                    <div style={{ margin: '1rem 3rem' }}>
                        <strong style={{ background: 'yellow' }}>[활동 2]</strong> <br />
                        측정된 현재 데이터와 대기환경 기준 비교하고 이유 토론하기
                    </div>

                    <div style={{ margin: '1rem 3rem' }}>
                        <strong style={{ background: 'yellow' }}>[활동 3]</strong> <br />
                        센서를 활용하여 30분간 교실 공기질 측정하기 <br /> <br />
                        (1) 15분은 창문을 닫은 상태로 측정하기 
                        <br />
                        (2) 15분은 창문을 연 상태로 측정하기 
                        <br />
                        (3) 측정 결과 예상하기 및 이유 작성하기
                    </div>

                    <div style={{ margin: '1rem 3rem' }}>
                        <strong style={{ background: 'yellow' }}>[활동 4]</strong> <br />
                        센서를 활용하여 30분간 교실의 공기질 측정 후 자료 변환하기
                    </div>
                    <div style={{ margin: '1rem 3rem' }}>
                        <span style={{ color: 'blue' }}>* 측정한 값을 불러온 후 'Graph' 탭에서 해당 활동을 할 수 있습니다.</span>
                    </div>

                    <div style={{margin: '1rem 3rem' }}>
                        <strong style={{ background: 'yellow' }}>[활동 5]</strong> <br />
                        결과 보고서 작성하기
                    </div>
                    <span style={{ margin: '0 3rem', color: 'blue' }}>* 'Assignment' 탭에서 해당 활동을 할 수 있습니다.</span>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <button 
                            className='shareFileBtn' 
                            onClick={handleGetData}
                            style={{background: '#d2d2d2', border: 'none', borderRadius: '0.625rem'}}>공유 데이터 가져오기</button>
                    </div>
                </div>
                
                {/*
                <div>
                    <div className='interaction' style={{ margin: '1rem 3rem'}}>
                        <h4>공유한 데이터 가져오기</h4>

                        <div style={{ marginTop: '1rem' }}>
                            <button 
                                className='shareFileBtn' 
                                onClick={handleGetData}
                                style={{background: '#6CCC81'}}>공유 데이터 가져오기</button>
                        </div>

                        
                        <div>
                            {sharedData && sharedData.length > 0 && (
                                <>
                                    <label className='labelStudent'>저장 일시</label>
                                    <p>{sharedData[0].saveDate}</p>

                                    {sharedData[0].memo &&
                                        <>
                                            <label className='labelStudent'>메모</label>
                                            <p>{sharedData[0].memo}</p>
                                        </>
                                    }
                                </>
                            )}
                        </div>

                        <div>
                            <label className='labelStudent'>데이터 값 수정하기</label>

                            {sharedData && sharedData.length > 0 && (
                                <table border="1" className='sharedData'>
                                    <thead>
                                        <tr>
                                            {sharedData[0].properties.split(', ').map((property, index) => (
                                                <th key={index}>
                                                    <input
                                                        value={properties[index]}
                                                        onChange={(e) => handleHeaderChange(index, e.target.value)}
                                                    />
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {sharedData.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                        {row.data.split(', ').map((cell, cellIndex) => (
                                            <td key={cellIndex}>
                                                <input
                                                    onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        
                    </div>

                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '3rem'}}>
                        <button className='shareFileBtn'  style={{background: '#6CCC81'}} onClick={handleModify}>전송하기</button>
                    </div>
                                    
                    </div>
                </div>
                */}
            </Slider>
        </div>
    )
}