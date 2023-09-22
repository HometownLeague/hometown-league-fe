/* global kakao */
import React, { useState,useEffect,useRef } from 'react';
import axios from 'axios';
function KakaoMap({searchplace,setLocation}) {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]); // 마커 배열 추가
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택한 마커 상태 추가

  const onClickMarker=(place)=>{ 
   
    const lat = place.y; // 위도
    const lng = place.x; // 경도
    const address = place.address_name; // 도로명 주소
    const roadAddress = place.road_address_name; // 지번 주소
    let legalDongCode =''
    const content=place.place_name;
    //FIXME -  legalcode 네트워크 없음
    axios.get(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`, {
      headers: { Authorization:  "KakaoAK "+process.env.REACT_APP_KAKAO_REST_API_KEY },
  })
    .then(response => {
      const data = response.data;
      console.log(data)
      if (data.documents && data.documents.length > 0) {
        const region = data.documents[0];
        legalDongCode = region.region_3depth_code;
        console.log('법정동 코드:', legalDongCode);
      } else {
        console.error('법정동 정보를 찾을 수 없습니다.');
      }
    })
    .catch((error) => {
      console.error('API 호출 중 오류 발생:', error);
    });
    setLocation({
    name:content,
    latitude:lat,
    longitude:lng,
    legalCode:legalDongCode,
    jibunAddress:roadAddress,
    roadAddress:address
    })
  }
  // 선택한 마커 색상 변경을 위한 함수
  const getDefaultMarkerImage = () =>
  new window.kakao.maps.MarkerImage(
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
    new window.kakao.maps.Size(32, 32),
    { offset: new window.kakao.maps.Point(16, 32) }
  );

  const getSelectedMarkerImage = () =>
  new window.kakao.maps.MarkerImage(
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_yellow.png",
    new window.kakao.maps.Size(32, 32),
    { offset: new window.kakao.maps.Point(16, 32) }
  );

  useEffect(() => {
    // Kakao Map 초기화
    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 초기 지도 중심 좌표 (예시: 서울)
      level: 5, // 지도 확대 레벨
    };
    const map = new window.kakao.maps.Map(container, options);
 // 선택한 마커의 아이콘 생성 함수
    const getMarkerImage = (selected) => {
      const imageUrl = selected
        ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png"
        : "http://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png ";
      return new window.kakao.maps.MarkerImage(imageUrl, new window.kakao.maps.Size(32, 32), {
        offset: new window.kakao.maps.Point(16, 32),
      });
    };
    // 장소 검색
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchplace, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds();
        // 검색 결과를 지도에 표시
        for (let i = 0; i < data.length; i++) {
          const place = data[i];
          const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: getMarkerImage(false), // 초기 아이콘 설정 
          });

           // InfoWindow 내용 설정
           const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div>${place.place_name}</div>`, // 마커 위에 표시될 내용
          });
           // 마커에 마우스 오버 시 InfoWindow 표시
           window.kakao.maps.event.addListener(marker, "mouseover", function () {
            infowindow.open(map, marker);
          });

          // 마커에 마우스 아웃 시 InfoWindow 닫기
          window.kakao.maps.event.addListener(marker, "mouseout", function () {
            infowindow.close();
          });
          
          // 마커 클릭 시 위치 설정
          window.kakao.maps.event.addListener(marker, "click", function () {
            map.setLevel(4, {anchor: this.getPosition()});

            // 이전에 선택한 마커의 아이콘을 원래대로 변경
            if (selectedMarker) {
              selectedMarker.setImage(getMarkerImage(false));
            }
            
            // 현재 선택한 마커의 아이콘을 변경
            marker.setImage(getMarkerImage(true));
            setSelectedMarker(marker);
            onClickMarker(place)
          });
          marker.setMap(map);
          bounds.extend(markerPosition);
        }

        // 검색된 장소들이 모두 표시되도록 지도의 범위 설정
        map.setBounds(bounds);
      }
    });
  }, [searchplace, setLocation]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default KakaoMap;