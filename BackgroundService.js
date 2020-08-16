import {Notifications} from 'react-native-notifications';
import Geolocation from 'react-native-geolocation-service';
import {AsyncStorage} from 'react-native'
import React from 'react';
const BackgroundService=async (Lat,Long)=>{
     Geolocation.getCurrentPosition(
        //Will give you the current location
         (position) => {
            const currentLongitude = JSON.stringify(position.coords.longitude);//getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            console.log('Background location '+currentLatitude,currentLongitude);
           if(currentLongitude &&currentLatitude ){
              AsyncStorage.setItem('Lat', `${currentLatitude}`)
              AsyncStorage.setItem('Long', `${currentLongitude}`)
              getWeatherData(currentLatitude,currentLongitude)
            }
         },
          (error) => { Notifications.postLocalNotification({
          body: `We are unable to get to your latest Location.You may receive the Perdictions according to  your previous Location`,
          title: 'Warning',
          sound: 'chime.aiff',
          category: 'Error',
          link: 'localNotificationLink',
          icon:'ic_launcher',
          fireDate: new Date()
        }); 
        getWeatherData(Lat,Long) 
        },
          { enableHighAccuracy: true, timeout: 25000, maximumAge: 10000 }
      );
   


   

}






function getWeatherData(currentLatitude,currentLongitude){
  
  fetch(`https://api.openweathermap.org/data/2.5/onecall?&lat=${currentLatitude}&lon=${currentLongitude}&exclude=current,minutely,hourly&units=metric&appid=d4a3ad358199cfea3aece95f5afc4d42`)
   .then((response)=>response.json())
   .then((myjson)=>{
       let MaxTemp=parseInt(myjson.daily[0].temp.max)
       let MinTemp=parseInt(myjson.daily[0].temp.min)
       let Humidity=parseInt(myjson.daily[0].humidity)
       let WindSpeed=parseInt(myjson.daily[0].wind_speed)
      getDiseasePrediction(MinTemp,MaxTemp,Humidity,WindSpeed)
      }).catch((err)=>{
        console.log('error in weather');
              
             })
}





  //this method will get the Disease Perdiction data 
  function  getDiseasePrediction(MinTemp,MaxTemp,Humidity,WindSpeed){
    console.log('Background service Disease perdictions');
    if(MinTemp>=30 && MaxTemp >=30 && Humidity<40){
    Humidity=50
    }
    fetch(`https://weather-care.herokuapp.com/Prediction?MinTemp=${MinTemp}&MaxTemp=${MaxTemp}&WindSpeed=${WindSpeed}&Humidity=${Humidity}`)
        .then((response)=> response.json())
        .then((myjson)=>{
          
            Notifications.postLocalNotification({
                      body: `Flu : ${parseInt(myjson.results.FluProbability)*10}% || Heat Stroke : ${parseInt(myjson.results.HeatStrokeProbability)*10}% || Dengue : ${parseInt(myjson.results.Dangueprobability)*10}% || Cold : ${parseInt(myjson.results.ColdProbability)*10}%`,
                      title: "Today's Predictions",
                      sound: 'chime.aiff',
                      category: 'SOME_CATEGORY',
                      link: 'localNotificationLink',
                      fireDate: new Date()
                    });
    
   }).catch((err)=> {
    console.log('error in disease perdiction');
    
  })
  
}
export default BackgroundService;