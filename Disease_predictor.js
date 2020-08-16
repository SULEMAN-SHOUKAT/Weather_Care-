import React from 'react';
import Precautions from "./Precautions"
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet,Text,View,TouchableOpacity,AsyncStorage,TouchableHighlight,PermissionsAndroid,ActivityIndicator,RefreshControl,Button} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from 'react-native-responsive-screen';//this will help the responsive screen 
import { ProgressCircle }  from 'react-native-svg-charts'
import DropdownAlert from 'react-native-dropdownalert';
import Geolocation from 'react-native-geolocation-service';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

class  Disease_predictor extends React.Component{
  
  constructor(props) {
    super(props)
  
    this.state = {
      
       flu:1,
       heatstroke:1,
       cold:1,
       dangue:1,
       render:'Disease',
       results:'Not updated',
       error:null,
       ShowError:false,
       modalVisible:true,
       refreshing:false,
       Fetchmessage:''
    }
    this.disease='',
    this.onRefresh=this.onRefresh.bind(this)
  }

  
  

ShowPrecautions=(disease)=>{
     this.disease=disease
     this.setState({render:"Precautions"})
}
ShowDisease=()=>{
  console.log(this.state.render);
  this.setState({render:"Disease"})
}



//this method will get the user current location
async  requestLocationPermission(){
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
              try{
             await  AsyncStorage.setItem('Lat', `${currentLatitude}`)
              await AsyncStorage.setItem('Long', `${currentLongitude}`)
            }
              catch(err){
                        console.log(err);
              }
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
  //this method will get the weather data and also the perdictions
 getWeatherData(currentLatitude,currentLongitude){
  this.setState({Fetchmessage:'Getting Weather Data'})
  fetch(`https://api.openweathermap.org/data/2.5/onecall?&lat=${currentLatitude}&lon=${currentLongitude}&exclude=current,minutely,hourly&units=metric&appid=d4a3ad358199cfea3aece95f5afc4d42`)
   .then((response)=>response.json())
   .then((myjson)=>{
       let MaxTemp=parseInt(myjson.daily[0].temp.max)
       let MinTemp=parseInt(myjson.daily[0].temp.min)
       let Humidity=parseInt(myjson.daily[0].humidity)
       let WindSpeed=parseInt(myjson.daily[0].wind_speed)
       console.log('Weather Data From Disease Predictor Screen'+MinTemp,MaxTemp,Humidity,WindSpeed);
       this.getDiseasePrediction(MinTemp,MaxTemp,Humidity,WindSpeed)
       }).catch((err)=>{
        this.dropDownAlertRef.alertWithType('error', 'Error', 'We are sorry there is an error while generating perdictions please follow Instruction below');
        this.setState({ShowError:true})
        this.setState({error:'We are sorry there is an error while getting Weather data of your location.Please check you internet connection and try again by pressing (Reload) button'})});
                    
 }






//this method will get the Disease Perdiction data 
 async getDiseasePrediction(MinTemp,MaxTemp,Humidity,WindSpeed){
  this.setState({Fetchmessage:'Generating Disease Predictions'})
  if(MinTemp>=30 && MaxTemp >=30 && Humidity<40){
  Humidity=50
  }

  
   
  fetch(`https://weather-care.herokuapp.com/Prediction?MinTemp=${MinTemp}&MaxTemp=${MaxTemp}&WindSpeed=${WindSpeed}&Humidity=${Humidity}`)
      .then((response)=> response.json())
      .then((myjson)=>{
   this.setState({flu:parseInt(myjson.results.FluProbability)/10})
   this.setState({heatstroke:parseInt(myjson.results.HeatStrokeProbability)/10})
   this.setState({cold:parseInt(myjson.results.ColdProbability)/10})
   this.setState({dangue:parseInt(myjson.results.Dangueprobability)/10})
   this.setState({results:myjson.results})
   this.setState({refreshing: false}); 
   
 }).catch((err)=> {
  this.dropDownAlertRef.alertWithType('error', 'Error', 'We are sorry there is an error while generating predictions please follow Instruction below');
  this.setState({ShowError:true})
  this.setState({error:'We are sorry there is an error while generating predictions.Please check you internet connection and try again by pressing (Reload) button'})});
            
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

  render(){
    console.log(this.state.results);

    //color controlling
   const graphcolor=(data=0.6)=>{
        if (data<=0){
          return `rgba(60, 241, 118,1)`
        }
        else if(data<=0.2) {
          return `rgba(37, 167, 246 ,1)`
        }
        else if(data<=0.4) {
          return `rgba(216, 241, 60,1)`
        }
        else if(data<=0.6){
          return `rgba(246, 129, 37 ,1)`
        }
        else if(data<=0.8){
          return `rgba(2241, 87, 60,1)`
        }
        else if(data<=1){
          return `rgba(200, 30, 30,1)`
        }
        else{
          return `rgba(37, 167, 246 ,1)`
        }
    };

    //this if is used for activity indictor
if(this.state.results !='Not updated'){

//this if is for the precautions
if(this.state.render=="Precautions"){
  
  return (
      <Precautions disease={this.disease} showDisease={this.ShowDisease}/>
      )
}




//this is for the disease
else if(this.state.render=='Disease'){

    return(
      <View style={styles.container}>
        
        <View style={{display:"flex",flexDirection:'row',justifyContent:'space-between',width:wp('70%')}}>
          <Text style={{fontSize:21,color:'black',elevation:19}}>Disease</Text>
          <Text style={{fontSize:21,color:'black',elevation:19}}>Probability</Text>
        </View>

        <View style={styles.container_2}>
         <ScrollView style={{alignSelf:"center",width:wp('85%')}}showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: "center" }} 
        refreshControl={
          <RefreshControl  color={["36", "113", "163"]} refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
        }>
         


          
         <TouchableOpacity  onPress={()=>this.ShowPrecautions('flu')}  activeOpacity={.9}>
         
          <View style={styles.current_disease_container}>
          <View style={{display:"flex",flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:wp('80%'),height:hp('15%'),borderRadius:wp('8%')}}>
             <View style={{marginLeft:30}}>
               <Text style={{fontSize:45,color:`${graphcolor(this.state.flu)}`,elevation:19}}>Flu</Text>
             </View>
             <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
             <ProgressCircle
                style={ { height:hp('11%'),width:wp('30%')} } progress={this.state.flu} progressColor={graphcolor(this.state.flu)} strokeWidth={12}/>
             <Text style={{color:`${graphcolor(this.state.flu)}`,fontSize:20}}>{this.state.flu*100}%</Text>
             </View>
        </View>
        </View>
       
        </TouchableOpacity >
        





        
        <TouchableOpacity onPress={()=>this.ShowPrecautions('heatStroke')}   activeOpacity={0.9}>
        
          <View style={styles.current_disease_container}>
          <View style={{display:"flex",flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:wp('80%'),height:hp('15%'),borderRadius:wp('8%')}}>
             <View style={{marginLeft:30}}>
               <Text style={{fontSize:45,color:`${graphcolor(this.state.heatstroke)}`,elevation:19}}>HS</Text>
               <Text style={{fontSize:12,color:`${graphcolor(this.state.heatstroke)}`,elevation:19}}>Heat Stroke</Text>
             </View>
             <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
             <ProgressCircle
                style={ { height:hp('11%'),width:wp('30%')} } progress={this.state.heatstroke} progressColor={graphcolor(this.state.heatstroke)} strokeWidth={12}/>
             <Text style={{color:`${graphcolor(this.state.heatstroke)}`,fontSize:20}}>{this.state.heatstroke*100}%</Text>
             </View>
        </View>
        </View>
        
        </TouchableOpacity>




        <TouchableOpacity onPress={()=>this.ShowPrecautions('dangue')} activeOpacity={.9}>
          <View style={{...styles.current_disease_container}}>
          <View style={{display:"flex",flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:wp('80%'),height:hp('15%'),borderRadius:wp('8%')}}>
             <View style={{marginLeft:30}}>
               <Text style={{fontSize:33,color:`${graphcolor(this.state.dangue)}`,elevation:19}}>Dengue</Text>
             </View>
             <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
             <ProgressCircle
                style={ { height:hp('11%'),width:wp('30%')} } progress={this.state.dangue} progressColor={graphcolor(this.state.dangue)} strokeWidth={12}/>
             <Text style={{color:`${graphcolor(this.state.dangue)}`,fontSize:20}}>{this.state.dangue*100}%</Text>
             </View>
        </View>
        </View>
        </TouchableOpacity>







        <TouchableOpacity onPress={()=>this.ShowPrecautions('cold')} activeOpacity={.9}>
          <View style={{...styles.current_disease_container,marginBottom:70}}>
          <View style={{display:"flex",flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:wp('80%'),height:hp('15%'),borderRadius:wp('8%')}}>
             <View style={{marginLeft:30}}>
               <Text style={{fontSize:45,color:`${graphcolor(this.state.cold)}`,elevation:19}}>Cold</Text>
             </View>
             <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
             <ProgressCircle
                style={ { height:hp('11%'),width:wp('30%')} } progress={this.state.cold} progressColor={graphcolor(this.state.cold)} strokeWidth={12}/>
             <Text style={{color:`${graphcolor(this.state.cold)}`,fontSize:20}}>{this.state.cold*100}%</Text>
             </View>
        </View>
        </View>
        </TouchableOpacity>









     


        </ScrollView>
        
        </View>
      
      </View>
  )}
  else{
    return <Text>There is an error in  Disease Perdictions Prediction</Text>
  }
}

//show activity 
else{
  if(this.state.ShowError==false){
    return (
    <View style={{width:'100%',height:'100%',marginTop:hp('15%')}}>
    <ActivityIndicator size="large" color="blue"  style={{marginTop:8,elevation:8}}/>
  <Text style={{color:'black',fontWeight:'700',fontSize:18}}>{this.state.Fetchmessage}</Text>
    <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
 </View>)
  }
  else if (this.state.ShowError==true){
    return (<this.ReloadButton/>)
  }
  
}


    }
    
}
export default Disease_predictor;

const styles = StyleSheet.create({
    container: {
     // backgroundColor: '#0575E6',
     alignSelf:"center",
      borderRadius:wp('8%'),
      width:wp('92%'),
    
     flexDirection:"column",
  alignItems:"center",
  //overflow:"hidden",
 // elevation:28
    },
    container_2:{
     
      marginTop:0,
      alignSelf:"center",
      
      width:wp('85%'),
      flexDirection:"column",
      borderRadius:wp('9%'),
  alignItems:"center",
  overflow:"hidden",
  
  
 
  
    },
    current_disease_container:{
      marginTop:7,
      height:hp('15%'),
      width:wp('85%'),
      borderRadius:wp('8%'),
      backgroundColor: 'white',
      display:'flex',
      elevation:6,
     alignItems:'center',
     
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
},


    
   
  });