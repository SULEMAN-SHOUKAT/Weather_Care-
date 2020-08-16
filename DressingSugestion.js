import React from 'react';
import Precautions from "./Precautions"
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet,Text, View,TouchableOpacity,PermissionsAndroid,ActivityIndicator,RefreshControl,Image,Button} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from 'react-native-responsive-screen';//this will help the responsive screen 
import { ProgressCircle }  from 'react-native-svg-charts'
import DropdownAlert from 'react-native-dropdownalert';
import Geolocation from 'react-native-geolocation-service';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

class  DressingSugestion extends React.Component{
  constructor(props) {
    super(props)
  
    this.state = {
       render:'Dressing',
       results:'Not updated',
       error:null,
       ShowError:false,
       loaded: false,
       refreshing:false,
       Fetchmessage:''
    }
    this.weather=''
    this.Temperature=0
    this.W_Humidity=0
  }

  //prrecaution and dressing option changing
ShowPrecautions=(weather)=>{
     this.weather=weather
     this.setState({render:"Precautions"})
}
ShowDressing=()=>{
  console.log(this.state.render);
  this.setState({render:"Dressing"})
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
      'message': 'We want to  access to your location '
    }
  )
 
    //To Check, If Permission is granted
    if (granted === PermissionsAndroid.RESULTS.GRANTED){
    Geolocation.getCurrentPosition(
        //Will give you the current location
         (position) => {
            const currentLongitude = JSON.stringify(position.coords.longitude);//getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            console.log('dressing screen location getting lat,long '+currentLatitude,currentLongitude);
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
          this.setState({error:'We are unable to get your Location As you not allowed please allow us please Press Reload button'})
          this.setState({ShowError:true})
        }
  } 







//this method will get the weather data and also the Suggestions
getWeatherData(currentLatitude,currentLongitude){
  this.setState({Fetchmessage:'Getting Weather Data'})
 fetch(`https://api.openweathermap.org/data/2.5/onecall?&lat=${currentLatitude}&lon=${currentLongitude}&exclude=current,minutely,hourly&units=metric&appid=d4a3ad358199cfea3aece95f5afc4d42`)
  .then((response)=>response.json())
  .then((myjson)=>{
      var MaxTemp=Number((myjson.daily[0].temp.max).toFixed())
      var MinTemp=Number((myjson.daily[0].temp.min).toFixed())
      var Temp=parseInt((myjson.daily[0].temp.max + myjson.daily[0].temp.min)/2)
      var Humidity=Number((myjson.daily[0].humidity).toFixed())
         this.Temperature=Temp/100
         this.W_Humidity=Humidity/100
      //calling of the dressing suggestion method
     this.getDressingSuggestion(MinTemp,MaxTemp)
      
 }).catch((err)=>{
  this.dropDownAlertRef.alertWithType('error', 'Error', 'We are sorry there is an error while generating perdictions please follow Instruction below');
  this.setState({ShowError:true})
  this.setState({error:'We are sorry there is an error while getting Weather data of your location.Please check you internet connection and try again by pressing (Reload) button'})});
                   
}


getDressingSuggestion(MinTemp,MaxTemp){
  this.setState({Fetchmessage:'Generating  dresses'})
  if((MinTemp<=12 || MinTemp>=8) && (MaxTemp<=15 || MinTemp>=11)){
     MinTemp=MinTemp-3
     MaxTemp=MaxTemp+3
  }
  fetch(`https://weather-care.herokuapp.com/Dressing?MinTemp=${MinTemp}&MaxTemp=${MaxTemp}`)
  .then(res=>res.json())
  .then((data)=>{
  this.setState({results:data.urls})
  console.log('results from the suggestion',this.state.results);
  this.setState({refreshing: false});
  }).catch((err)=>{
    this.dropDownAlertRef.alertWithType('error', 'Error', 'We are sorry there is an error while generating dresses please follow Instruction below');
    this.setState({ShowError:true})
    this.setState({error:'We are sorry there is an error while generatig dresses.Please check you internet connection and try again by pressing (Reload) button'})});
    
}








componentDidMount(){
  //get user location and then the weather data and the the perdictions
  this.requestLocationPermission()
}


//error messsage handling
ReloadButton=()=>{
  return (
   <View style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:hp('10%')}}>
     <View style={{backgroundColor:'white',paddingBottom:10,width:300,paddingLeft:10,paddingRight:10,alignItems:'center',borderRadius:10,elevation:2}}>
     
     <View style={{alignItems:'center',paddingTop:10}}><Text style={{fontSize:18,fontWeight:'700',borderBottomWidth:1,borderBottomColor:'black',width:'100%',color:'#FF5733'}}>oh! An error has occured </Text></View>
     
     <Text style={{alignSelf:"center",paddingTop:8,fontSize:17}}>{this.state.error}</Text>
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



id=0;
myid=0
setLoad=()=>{
  this.myid++
  console.log(this.myid);
  if(this.myid==6){

    this.setState({loaded:true})
    
  }
}
    fetch_images=()=>{
      
        return   this.state.results.map(data=>{
         return(
         
            <Image key={this.id++} onLoad={() => this.setLoad()} source={{uri:data.url}} style={{height:hp('40%'),width:wp('18%'),alignSelf:"center",marginLeft:8,marginRight:15}}/>
         )
       })  
    }

  render(){
    console.log(this.state.results);
    //color controlling
   //color controlling
   const graphcolor=(data=0.20)=>{
    if (data<=0.10){
      return `rgba(29, 29, 147,1)`
    }
    else if(data<=0.15) {
      return `rgba(37, 167, 246 ,1)`
    }
    else if(data<=0.22) {
      return `rgba(216, 241, 60,1)`
    }
    else if(data<=0.28){
      return `rgba(246, 129, 37 ,1)`
    }
    else if(data<=0.40){
      return `rgba(2241, 87, 60,1)`
    }
    else if(data<=41){
      return `rgba(200, 30, 30,1)`
    }
    else{
      return `rgba(37, 167, 246 ,1)`
    }
};

const humiditycolor=(data=0.20)=>{
  if (data<=0.30){
    return `rgba(29, 29, 147,1)`
  }
  else if(data<=0.40) {
    return `rgba(37, 167, 246 ,1)`
  }
  else if(data<=0.50) {
    return `rgba(216, 241, 60,1)`
  }
  else if(data<=0.60){
    return `rgba(246, 129, 37 ,1)`
  }
  else if(data<=0.70){
    return `rgba(2241, 87, 60,1)`
  }
  else if(data<=80){
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
      <Precautions weather={this.weather} showDisease={this.ShowDressing}/>
      )
}

else if (this.state.render=="Dressing"){
  return (<View style={{flex:1,height:'100%',width:'100%'}}>
           <View style={styles.container_2}>
             <ScrollView style={{borderRadius:25,width:wp('80%')}}showsVerticalScrollIndicator={false} horizontal={false} showsHorizontalScrollIndicator={false}
              refreshControl={
                <RefreshControl  color={["36", "113", "163"]} refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
              }>
 
              <View style={{display:"flex",flexDirection:'column',marginTop:20,justifyContent:'center',width:wp('80%')}}>
              <View style={{backgroundColor:'white',borderRadius:20,marginTop:-18,justifyContent:'center',elevation:8,  width:wp('80%'),display:"flex",flexDirection:"column",height:hp('20%'),justifyContent:"space-around",alignSelf:"center"}}>
              <Text style={{color:'black',fontSize:20,fontWeight:'700',alignSelf:"center"}}>Weather Condition</Text>

              
              <View style={{display:'flex',flexDirection:'row',justifyContent:"space-around",width:wp('80%'),marginTop:hp('1%')}}>


                  <View style={{display:'flex',flexDirection:'column'}}>
                  <Text style={{color:'black'}}>Temperature</Text>
                  <View style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',alignItems:'center'}}>
             <ProgressCircle
                style={ { height:hp('8%'),width:wp('20%')} } progress={this.Temperature} progressColor={graphcolor(this.Temperature)} strokeWidth={9}/>
                <Text style={{color:`${graphcolor(this.Temperature)}`,fontSize:20}}>{Number((this.Temperature*100).toFixed())}°C</Text>
               </View>
               </View>


               <View style={{display:'flex',flexDirection:'column'}}>
                  <Text style={{color:'black'}}>Humidity</Text>
                  <View style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',alignItems:'center'}}>
             <ProgressCircle
                style={ { height:hp('8%'),width:wp('20%')} } progress={this.W_Humidity} progressColor={humiditycolor(this.W_Humidity)} strokeWidth={9}/>
                <Text style={{color:`${humiditycolor(this.W_Humidity)}`,fontSize:20}}>{Number((this.W_Humidity*100).toFixed())}%</Text>
               </View>
               </View>

              </View>
            </View>
        </View>
       
          

       <View style={{backgroundColor:'white',marginTop:10,borderRadius:20,justifyContent:'center',elevation:8,  width:wp('80%'),display:"flex",flexDirection:"column",height:hp('40%'),justifyContent:"space-around",alignSelf:"center",elevation:8}}>
   
            <Text style={{color:'black',fontSize:20,fontWeight:'700',alignSelf:"center"}}>Dressing Suggestions</Text>

            <ScrollView style={{display:"flex",flexDirection:"row",height:hp('40%')}}  showsVerticalScrollIndicator={false} horizontal={true} showsHorizontalScrollIndicator={false} >
            <this.fetch_images/>
            </ScrollView>
            {this.state.loaded? null:
            <View style={{width:wp('80%'),borderRadius:20,backgroundColor:'rgba(0,0,0,.6)',position:'absolute',height:hp('40%'),justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size="large" color="white"  style={{marginTop:8,elevation:8}}/>
            <Text style={{color:'white',fontWeight:'700',fontSize:15}}>Generating Dressing images</Text> 
         </View>
            }
            
       </View>
       

                <View style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',marginBottom:20}}>
                   <TouchableOpacity onPress={()=>this.ShowPrecautions(this.state.results[0].weather)} style={{alignSelf:'center'}}>
                     <View style={{...styles.button,backgroundColor:'#0575E6'}}>
                         <Text style={{fontSize:20,fontWeight:"bold",color:'#ffff'}}>Description</Text>
                       </View>
                   </TouchableOpacity>
                   </View>
                 

                   </ScrollView>
                   </View>  
  </View>
  
  )
  }
  
  
}
else if(this.state.results=='Not updated'){


  if (this.state.ShowError==false){
    return (
    <View style={{width:'70%',height:'100%',marginTop:hp('15%')}}>
        <ActivityIndicator size="large" color="blue"  style={{marginTop:8,elevation:8}}/>
       <Text style={{color:'black',fontWeight:'700',fontSize:18}}>{this.state.Fetchmessage}</Text>
         <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
      </View>)
      
  }
  else if (this.state.ShowError==true){
    return (<this.ReloadButton/>)
  }
  else {
    return <Text>There is an error in  Dressing Suggestions</Text>
  }
}

//show activity 
else{
  return ( <Text>There is an error in  Dressing Suggestions</Text>)
}


    }
    
}
export default DressingSugestion;

const styles = StyleSheet.create({
    
    headinContainer:{
            flex:1,
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-around',
            width:'95%',
            backgroundColor:'red',
            height:'20%'
    },
    button:{
        backgroundColor:'#6E78F7',
        height:hp('6%'),
        width:wp('40%'),
        borderRadius:35,
        alignItems:"center",
        justifyContent:"center",
        marginVertical:hp('1%'),
        elevation:26
 },
 container_2:{
  
   marginTop:0,
   alignSelf:"center",
   
   width:wp('85%'),
   flexDirection:"column",
   borderRadius:wp('10%'),
alignItems:"center",
overflow:"hidden",




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