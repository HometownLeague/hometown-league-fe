import React, { useState,useEffect,useRef } from 'react';
import { Map,MapMarker } from "react-kakao-maps-sdk"
import axios from 'axios';
function KaKaoMap({searchplace,setLocation}) {
  const { kakao } = window;
  const [info, setInfo] = useState()
  const [markers, setMarkers] = useState([])
  const [map, setMap] = useState()
  const [coordinates, setCoordinates] = useState(null); // 현재 위치의 좌표값을 저장할 상태
	const mapRef = useRef();

  const getCoordinates = () => {
		const map = mapRef.current;

		setCoordinates({
			center: {
				lat: map.getCenter().getLat(),
				lng: map.getCenter().getLng(),
			},
		});
	};
  const onClickMarker=(marker)=>{
    setInfo(marker);
    console.log(marker)
    axios.get(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${marker.position.lat}&y=${marker.position.lng}`, {
      headers: { Authorization: process.env.REACT_APP_KAKAO_REST_API_KEY },
  })
    .then(res => {
      const location =res.data.documents[0];
      setLocation({
      jibunAddress:location.adress.address_name,
      roadAddress:location.road_adress.address_name
      })
    })
    axios.get(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${marker.position.lat}&y=${marker.position.lng}`, {
      headers: { Authorization: process.env.REACT_APP_KAKAO_REST_API_KEY },
  })
    .then(res => {
      const location =res.data.documents[0];
      setLocation({
      name:marker.content,
      latitude:location.x,
      longitude:location.y,
      legalCode:location.code,
      })
      console.log(location);
    })
    
  }
  useEffect(() => {
    if (!map) return
    const ps = new kakao.maps.services.Places()

    ps.keywordSearch(searchplace, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds()
        let markers = []

        for (var i = 0; i < data.length; i++) {
          // @ts-ignore
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          })
          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
        }
        setMarkers(markers)

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds)
      }
    })
  }, [searchplace,map])

  return (
    <Map // 로드뷰를 표시할 Container
      center={{
        lat: 37.566826,
        lng: 126.9786567,
      }}
      style={{
        width: "100%",
        height: "350px",
      }}
      level={3}
      onCreate={setMap}
    >
      {markers.map((marker) => (
        <MapMarker
          key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
          position={marker.position}
          //onClick={onClickMarker(marker)}
        >
          {info &&info.content === marker.content && (
            <div style={{color:"#000"}}>{marker.content}</div>
          )}
        </MapMarker>
      ))}
    </Map>
  )
}

export default KaKaoMap