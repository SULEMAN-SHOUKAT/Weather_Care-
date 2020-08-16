import React from 'react';

import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet,Image, Text, View,Alert,TouchableOpacity,PermissionsAndroid,ActivityIndicator,RefreshControl,KeyboardAvoidingView,Card} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from 'react-native-responsive-screen';//this will help the responsive screen 

import DropdownAlert from 'react-native-dropdownalert';
import Geolocation from 'react-native-geolocation-service';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

class  Medicen_trend extends React.Component{
   constructor(props) {
     super(props)
   
     this.state = {
        results:'Not updated',
        current_results:'Not updated',
        Future_results:'Not updated',
        error:null,
        ShowError:false,
        Fetchmessage:'',
        loaded: false
     }
     this.onRefresh=this.onRefresh.bind(this)
   }
   






//this method will get the user current location
async  requestLocationPermission(){
  //setting the states lo initial conditions of them
  this.setState({ShowError:false})
  this.setState({Fetchmessage:'Getting your current Location'})
  this.setState({results:'Not updated'})
  
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      'title': 'Weather Care',
      'message': 'Please allow access to Location to continue '
    }
  )
    //To Check, If Permission is granted
    if (granted === PermissionsAndroid.RESULTS.GRANTED){
    Geolocation.getCurrentPosition(
        //Will give you the current location
        async  (position) => {
            const currentLongitude = JSON.stringify(position.coords.longitude);//getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            console.log('home screen location getting lat,long '+currentLatitude,currentLongitude);
            
            if(currentLongitude && currentLatitude){
            
              this.getWeatherData(currentLatitude,currentLongitude)
            } 
         },
         (error) => { this.dropDownAlertRef.alertWithType('error', 'Error', 'We are unable to get  to your Location');
                       this.setState({error:'We are unable to get  to your Location please make sure you have location services enabled and also check your internet connection'})
                     this.setState({ShowError:true})
        },
          { enableHighAccuracy: true, timeout: 25000, maximumAge: 10000 }
      );
        }
        else{
          this.dropDownAlertRef.alertWithType('error', 'Error', 'We are sorry there is an error while generating perdictions please follow Instruction below');
          this.setState({error:'We are unable to get your Location As you not allowed please allow us to continue.Press Reload button. Note (if you permanently stop the access for this ap you need to allow it from settings or try reinstalling the app)'})
          this.setState({ShowError:true})
        }
  } 



  //for weather data
 



  //for weather data
  //this method will get the  future weather data and also the futue medicine trendings
  getWeatherData(currentLatitude,currentLongitude){
    this.setState({Fetchmessage:'Getting Weather Data '})
    fetch(`https://api.openweathermap.org/data/2.5/onecall?&lat=${currentLatitude}&lon=${currentLongitude}&exclude=current,minutely,hourly&units=metric&appid=d4a3ad358199cfea3aece95f5afc4d42`)
     .then((response)=>response.json())
     .then((myjson)=>{
       //7 days weather implementation.................
        var Sum_Week_MinTemp=0;
        var Sum_Week_MaxTemp=0;
        var Sum_Week_Humidity=0;
        var Sum_Week_WindSpeed=0;
        var day_MinTemp=parseInt(myjson.daily[0].temp.min);
        var day_MaxTemp=parseInt(myjson.daily[0].temp.max);
        var day_Humidity=parseInt(myjson.daily[0].humidity);
        var day_WindSpeed=parseInt(myjson.daily[0].wind_speed);
        for(var i=0;i<8;i++){
          Sum_Week_MinTemp=Sum_Week_MinTemp+parseInt(myjson.daily[i].temp.min)
          Sum_Week_MaxTemp=Sum_Week_MaxTemp+parseInt(myjson.daily[i].temp.max)
          Sum_Week_Humidity=Sum_Week_Humidity+parseInt(myjson.daily[i].humidity)
          Sum_Week_WindSpeed=Sum_Week_WindSpeed+parseInt(myjson.daily[i].wind_speed)
        }
         let MaxTemp=parseInt(Sum_Week_MaxTemp)/8
         let MinTemp=parseInt(Sum_Week_MaxTemp)/8
         let Humidity=parseInt(Sum_Week_Humidity)/8
         let WindSpeed=parseInt(Sum_Week_WindSpeed)/8
         console.log("current data of medi",day_MinTemp,day_MaxTemp,day_Humidity,day_WindSpeed,MinTemp,MaxTemp,Humidity,WindSpeed);
         //calling to the future medicine trending method 
         this.getCurrentMedicines(day_MinTemp,day_MaxTemp,day_Humidity,day_WindSpeed,MinTemp,MaxTemp,Humidity,WindSpeed)
         
         }).catch((err)=>{
          this.dropDownAlertRef.alertWithType('error', 'Error', 'We are sorry there is an error while generating perdictions please follow Instruction below');
          this.setState({ShowError:true})
          this.setState({error:'We are sorry there is an error while getting Weather data of your location.Please check you internet connection and try again by pressing (Reload) button'})});
                      
   }


   //this method will get the current medicine  data 
 async getCurrentMedicines(day_MinTemp,day_MaxTemp,day_Humidity,day_WindSpeed,MinTemp,MaxTemp,Humidity,WindSpeed){
  this.setState({Fetchmessage:'Generating current Medicines'})
  if(MinTemp>=30 && MaxTemp >=30 && Humidity<40){
  Humidity=50
  }
  fetch(`https://weather-care.herokuapp.com/Medicine?MinTemp=${day_MinTemp}&MaxTemp=${day_MaxTemp}&WindSpeed=${day_WindSpeed}&Humidity=${day_Humidity}`)
      .then((response)=> response.json())
      .then((myjson)=>{
        
      this.setState({current_results:myjson.results})
      //calling to future Medicine Trends
      this.getFutureMedicines(MinTemp,MaxTemp,Humidity,WindSpeed)
 }).catch((err)=> {
  this.dropDownAlertRef.alertWithType('error', 'Error', 'We are sorry there is an error while generating predictions please follow Instruction below');
  this.setState({ShowError:true})
  this.setState({error:'We are sorry there is an error while generating Current Medicines prediction.Please check you internet connection and try again by pressing (Reload) button'})});
            
}


//this method will get the Future medicine trending  data 
async getFutureMedicines(MinTemp,MaxTemp,Humidity,WindSpeed){
  this.setState({Fetchmessage:'Generating Future Medicines'})
  if(MinTemp>=30 && MaxTemp >=30 && Humidity<40){
  Humidity=50
  }
  fetch(`https://weather-care.herokuapp.com/Medicine?MinTemp=${MinTemp}&MaxTemp=${MaxTemp}&WindSpeed=${WindSpeed}&Humidity=${Humidity}`)
      .then((response)=> response.json())
      .then((myjson)=>{
      this.setState({Future_results:myjson.results})
      this.setState({results:myjson.results})
       this.setState({refreshing: false}); 
   
 }).catch((err)=> {
  this.dropDownAlertRef.alertWithType('error', 'Error', 'We are sorry there is an error while generating predictions please follow Instruction below');
  this.setState({ShowError:true})
  this.setState({error:'We are sorry there is an error while generating Future Medicines prediction.Please check you internet connection and try again by pressing (Reload) button'})});
            
}




componentDidMount(){
  //get user location and then the weather data and the the perdictions
   this.requestLocationPermission()
    
  }




//error messsage handling
ReloadButton=()=>{
  return (
   <View style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:hp('10%')}}>
     <View style={{marginBottom:5,backgroundColor:'white',paddingBottom:15,width:300,paddingLeft:10,paddingRight:10,alignItems:'center',justifyContent:'center',borderRadius:10,elevation:2}}>
     <View style={{alignItems:'center',justifyContent:'center',paddingTop:10}}><Text style={{alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:'700',borderBottomWidth:1,borderBottomColor:'black',width:'100%',color:'#FF5733'}}>oh! An error has occured </Text></View>
     
     <Text style={{alignItems:"center",justifyContent:'center',paddingTop:8,fontSize:17}}>{this.state.error}</Text>
     </View>
   <TouchableOpacity onPress={()=>this.requestLocationPermission()} style={{alignSelf:'center'}}>
     <View style={{...styles.Reloadbutton,backgroundColor:'#0575E6'}}>
         <Text style={{fontSize:20,fontWeight:"bold",color:'#ffff'}}>Reload</Text>
       </View>
   </TouchableOpacity>
  
   </View>
  )
}


//Refresh controll
onRefresh = () => {
  this.setState({refreshing: true});
  console.log('refresshing Disease Perdiction');
  wait(2000).then(() =>{
    this.setState({results:'Not updated'})
    this.requestLocationPermission()
  } )
}


//just  ahelp to show medcien images this must be at backend.
 FluNames=['Theraflu for (Flu)','NeoCitran for (Flu)','Panadol for (Flu)','Infuza for (Flu)','Daytime for (Flu)','equate for (Flu)']

 ColdNames=['Umcka for (Cold)','ActionCold for (Cold)','Coldrex for (Cold)','Codral for (Cold)','EaseACold for (Cold)','Mucinex for (Cold)']

 DengueNames=['Paplate for (Dengue)','Caricam for (Dengue)','Den-Go for (Dengue)','Dengue Mar for (Dengue)','WL58 drops for (Dengue)','Paplate syrup for (Dengue)']

 HSNames=['INTACAL-D for (Heat stroke)','Medroxyprogesterone for (Heat stroke)','Clonazepam for (Heat stroke)','Clonazepam0.25 for (Heat stroke)','Rivotril for (Heat stroke)','Clorest0.25 for (Heat stroke)']



// tshow loader until the images of current loaded
id=-1;
myid=0
setLoad=()=>{
  this.myid++
  console.log(this.myid);
  if(this.myid==this.state.current_results.length){
    this.setState({loaded:true})
    
  }
}

// this will get us the Current trending medicen images
Current_medicen_image=()=>{
      var myid1=-1;

      if(this.state.current_results==null){
       
        return (
          <View  style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
         
            <Text style={{color:'black',alignSelf:'center',borderBottomColor:'rgba(0,0,0,1)',borderBottomWidth:2,fontSize:20}}>
                No medicine is required currently
            
            </Text>
            </View>
        )
    }
    else{
        return   this.state.current_results.map(data=>{
          if(myid1==5){
            myid1=-1
          }
         myid1=myid1+1
         console.log(this.DengueNames);
         
         return(
            <View key={this.id++} style={{flexDirection:'column',display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center',marginLeft:17}}>
              
              <Image key={this.id++} onLoad={() => this.setLoad()} source={{uri:data.mediUrl}} style={{height:hp('41%'),marginBottom:hp('0%'),width:wp('70%'),alignSelf:"center"}}/>
              <Text>{data.disease=='Flu'?this.FluNames[myid1]: data.disease=='Cold'?this.ColdNames[myid1] : data.disease=='H-S'?this.HSNames[myid1] :data.disease=='Dengue'?this.DengueNames[myid1]: 'no name'}
              </Text>
            
            </View>
         )
       }) } 
    }

    // show loader until images are loaded
    myid2=0
    setLoadFuture=()=>{
      this.myid2++
      console.log(this.myid2);
      if(this.myid2==this.state.Future_results.length){
        this.setState({loaded:true})
        
      }
    }
    // this will get us the future medicen images 
    Future_mdicen_image=()=>{
      var myid1=-1;
      if(this.state.Future_results==null){
        
        return (
          <View  style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
         
            <Text style={{color:'black',alignSelf:'center',borderBottomColor:'rgba(0,0,0,1)',borderBottomWidth:2,fontSize:20}}>
            
           No Medicine is  Required for future
            
           </Text>
           </View>
        )
    }
    else{
      return   this.state.Future_results.map(data=>{
        if(myid1==5){
          myid1=-1
        }
       myid1=myid1+1
       return(
          <View key={this.id++} style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center',marginLeft:17}}>
          <Image key={this.id++} onLoad={() => this.setLoadFuture()} source={{uri:data.mediUrl}} style={{height:hp('41%'),marginBottom:hp('0%'),width:wp('70%'),alignSelf:"center"}}/>
          <Text>{data.disease=='Flu'?this.FluNames[myid1]: data.disease=='Cold'?this.ColdNames[myid1] : data.disease=='H-S'?this.HSNames[myid1] :data.disease=='Dengue'?this.DengueNames[myid1]: 'no name'}
              </Text>
            
          </View>
       )
     })
    }  
  }









    
  render(){

     
   

//if data is  updted then show the Data

    if(this.state.results !='Not updated'){
//return the actual component
    return(
      <View style={styles.container}>
        <View style={styles.container_2}>
<ScrollView style={{borderRadius:25,width:wp('90%')}}showsVerticalScrollIndicator={false} horizontal={false} showsHorizontalScrollIndicator={false}
              refreshControl={
                <RefreshControl  color={["36", "113", "163"]} refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
              }>
       <View style={styles.current_trending}>
       <Text style={{fontSize:20,color:'black',fontWeight:'700',alignSelf:"center"}}>Current Trending Medicine</Text>
            <View style={{width:wp('86%'),display:"flex",flexDirection:"row",height:hp('49%'),marginTop:-hp('8%'),justifyContent:"space-around",alignSelf:"center"}}>
          
            <ScrollView style={{display:"flex",flexDirection:"row",height:hp('60%')}}  showsVerticalScrollIndicator={false} horizontal={true} showsHorizontalScrollIndicator={false} >
            <this.Current_medicen_image/>
            </ScrollView>
            </View>
            {this.state.loaded? null:
            <View style={{width:wp('90%'),borderRadius:20,backgroundColor:'rgba(0,0,0,.6)',position:'absolute',height:hp('52%'),justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size="large" color="white"  style={{marginTop:8,elevation:8}}/>
            <Text style={{color:'white',fontWeight:'700',fontSize:15}}>Generating Medicine images</Text> 
         </View>
            }
       </View>
    


       <View style={styles.future_trending}>
       <Text style={{fontSize:20,color:'black',fontWeight:'700',alignSelf:"center"}}>Future Trending Medicine</Text>
            <View style={{width:wp('86%'),display:"flex",flexDirection:"row",height:hp('49%'),marginTop:-hp('8%'),justifyContent:"space-around",alignSelf:"center"}}>
          
            <ScrollView style={{display:"flex",flexDirection:"row",height:hp('60%')}}  showsVerticalScrollIndicator={false} horizontal={true} showsHorizontalScrollIndicator={false} >
            <this.Future_mdicen_image/>
            </ScrollView>
            </View>
            {this.state.loaded? null:
            <View style={{width:wp('90%'),borderRadius:20,backgroundColor:'rgba(0,0,0,.6)',position:'absolute',height:hp('55%'),justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size="large" color="white"  style={{marginTop:8,elevation:8}}/>
            <Text style={{color:'white',fontWeight:'700',fontSize:15}}>Generating Medicine images</Text> 
         </View>
            }
       </View>
       </ScrollView>
       </View>
      </View>
  )

    }
    else if(this.state.results=='Not updated'){

        //in case of any error
      if (this.state.ShowError==false){
        return (
        <View style={{width:'70%',height:'100%',marginTop:hp('15%')}}>
            <ActivityIndicator size="large" color="blue"  style={{marginTop:8,elevation:8}}/>
           <Text style={{color:'black',fontWeight:'700',fontSize:18,justifyContent:'center',alignItems:'center'}}>{this.state.Fetchmessage}</Text>
             <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
          </View>)
          
      }
      else if (this.state.ShowError==true){
        //show reload buton if error accour
        return (<this.ReloadButton/>)
      }
      else {
        return <Text>There is an error in   Medicine Trend</Text>
      }
    }
    //show activity 
else{
  return ( <Text>There is an error in  Dressing Suggestions</Text>)
}

    }
    
}
export default Medicen_trend;
//styles
const styles = StyleSheet.create({
    container: {
            width:wp('90%'),
            flexDirection:"column",
           alignItems:"center",
           borderRadius:wp('20%'),
           
            
 
    },
    container_2:{
     
      marginTop:0,
      alignSelf:"center",
      
      width:wp('90%'),
      flexDirection:"column",
      borderRadius:wp('9%'),
  alignItems:"center",
  overflow:"hidden",
  
  
 
  
    },
    current_trending:{
        width:wp('90%'),
        marginBottom:hp('1%'),
               backgroundColor:'white',
                height:hp('52%'),
                borderRadius:wp('8%'),
                overflow:"hidden",
                elevation:4,
                justifyContent:'center',
                alignItems:'center',
                display:'flex',
                flexDirection:'column'

    },
    future_trending:{
    
        width:wp('90%'),
        backgroundColor:'white',
        height:hp('55%'),
        borderRadius:wp('8%'),
        overflow:"hidden",
        elevation:4,
        marginBottom:hp('2%'),
       marginTop:hp('2%'),
        justifyContent:'center',
                alignItems:'center',
                display:'flex',
                flexDirection:'column'


    },
 
    
    Reloadbutton:{
     backgroundColor:'#6E78F7',
     height:hp('6%'),
     width:wp('40%'),
     borderRadius:35,
     alignItems:"center",
     justifyContent:"center",
     marginVertical:hp('1%'),
     elevation:5
   }

    
   
  });