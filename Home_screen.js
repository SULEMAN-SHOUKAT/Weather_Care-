import React from 'react';
import LinearGradient from 'react-native-linear-gradient';//color shades 
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet,Image, Text, View,Alert,TouchableOpacity,AsyncStorage,PermissionsAndroid,ActivityIndicator, Button} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from 'react-native-responsive-screen';//this will help the responsive screen 
import Disease_predictor from './Home_screen_components/Disease_predictor.js';
import auth from '@react-native-firebase/auth';
import DressingSugestion from "./Home_screen_components/DressingSugestion.js";
import Medicen_trend from "./Home_screen_components/Medicen_trend"
import DropdownAlert from 'react-native-dropdownalert';
import BackgroundJob from 'react-native-background-actions';
import BackgroundService from './BackgroundService.js'
import { Icon } from 'react-native-elements';
import User_info from './Home_screen_components/User_info.js';
import { log } from 'react-native-reanimated';


const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));


const BackgroundPerdictions = async taskData => {
  const {delay} = taskData;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      var newdate=new Date().getDate().toString();
      var previousDate=await AsyncStorage.getItem('date')
      console.log('Prvioue stored date '+previousDate,typeof(previousDate)+ " || New date "+newdate,typeof(newdate));
      if(newdate==previousDate){
        console.log("dates are same so we are not runing any task")
      }
      else{
        await AsyncStorage.setItem('date',newdate)
       var Lat=await AsyncStorage.getItem('Lat')
      var Long=await AsyncStorage.getItem('Long')
      if(Lat==null||Long==null){
        console.log("Task is runing but there no Location Access")
      }
      else{
        BackgroundService(Lat,Long)
        console.log("Task is runing and fully working",i,Lat,Long)
      }
      }
      
     
      await sleep(delay);
    }
  });
};


const options = {
  taskName: 'Weather Care+',
  taskTitle: 'Lite Background Service',
  taskDesc: 'Watching over diseases to notify you after every 24 hours',
  taskIcon: {
    name: `${require('../assets/disease_prediction.png')}`,
    type: 'mipmap',
  },
  color: '#337DFF',
  parameters: {
    delay:60000,
  },
};






//class component for the screen that user see on home screen
export default class Home_screen extends React.Component{
  state={
    assets_loaded:false,
    selected_option:"disease_predictor",
       error:null,
       ShowError:false,
       
}

user;



async componentDidMount(){
  
             await BackgroundJob.stop();
            if(await AsyncStorage.getItem('user_status')=='login'){
              this.dropDownAlertRef.alertWithType('success', 'Welcome', 'You are successfully logged in ');
              await AsyncStorage.setItem('user_status', 'already logged in')
              await AsyncStorage.setItem('date',"123")
            }
            //this will chechk the user login status
            this.unsuscruibeAuth=auth().onAuthStateChanged((user)=>{
                if (user) {
                  console.log("user info ",user);
                  this.user=user
                  
                
                } else {
                    console.log('we are going to Login screen From Home screen');
                  this.props.navigation.navigate('Stack_navigator');
                }
              }
            );//end of checking user login status
        }



       async  componentWillUnmount(){
        this.unsuscruibeAuth()
        var Lat=await AsyncStorage.getItem('Lat')
        var Long=await AsyncStorage.getItem('Long')
        if(Lat==null||Long==null){
          console.log("Did not schedual Background task")
        }
        else{
          console.log('schedual Background task');
          await BackgroundJob.start(BackgroundPerdictions, options);
        }
         
          
        }
       
       




    render(){

     


      
      ////handllng the options here 
      const Information_view=()=>{
        if(this.state.selected_option=="disease_predictor"){
          return <Disease_predictor />
        }
        else if(this.state.selected_option=="dressing_suggestions"){
          return <DressingSugestion />
        }
        else if(this.state.selected_option=="medicen_trend"){
          return <Medicen_trend />
        }
        else if(this.state.selected_option=="User_info"){
          console.log("user is ",this.user);
          return <User_info user={this.user}/>
        }
        
        else{
          return <View style={{width:'100%',height:'100%',marginTop:hp('15%')}}>
                   <ActivityIndicator size="large" color="blue"  style={{marginTop:8,elevation:8}}/>
                   <Text style={{color:'black',fontWeight:'700',fontSize:18}}>Please select an option</Text>
                   
                    </View>
        }
      }

        







    return(
      
        <View style={styles.container}>
         
          <LinearGradient style={{ ...StyleSheet.absoluteFill}} colors={["#D3CCE3","#E9E4F0"]}>
          <View style={styles.home_header}>
            {/* <TouchableOpacity  onPress={()=>this. usersignout()}> */}
            <View  style={{alignSelf:"flex-end",marginTop:hp("3%"),marginRight:hp("1%")}}>
            <Icon
                  size={35}
                  name='user'
                  type='font-awesome'
                  color='white'
                  onPress={()=>this.setState({selected_option:"User_info"}) } />
                  </View>
            {/* <Text style={{fontSize:16,color:'white',alignSelf:"flex-end",marginTop:hp("3%"),elevation:23}}>Sign Out</Text>
            </TouchableOpacity> */}
            <Text style={{fontSize:31,color:"white",elevation:20,alignSelf:"center",letterSpacing:3,marginTop:hp("1%")}}>WEATHER CARE</Text>
             <Text style={{fontSize:90,color:"#FF0000",elevation:20,alignSelf:"center",letterSpacing:3,marginTop:hp("-5%")}}>+</Text>
               



           </View>
            <View style={{display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
            <View style={styles.medicine_trend_container}>
              <TouchableOpacity onPress={()=>this.setState({selected_option:"medicen_trend"}) } >
              <View style={styles._button}>
              <Image source={require('../assets/medicen_trend.png')} style={styles.button_logo}/>
              </View>
              <Text style={{fontSize:14,alignSelf:"center"}}>Medicine</Text>
              <Text style={{fontSize:16,color:'black',fontWeight:"bold",alignSelf:"center"}}>Trend</Text>
              </TouchableOpacity>
            </View>




             <View style={styles.disease_predictor_container}>
              <TouchableOpacity onPress={()=>this.setState({selected_option:"disease_predictor"}) } >
              <View style={styles._button}>
              <Image source={require('../assets/disease_prediction.png')} style={styles.button_logo}/>
              </View>
              <Text style={{fontSize:14,alignSelf:"center"}}>Disease</Text>
              <Text style={{fontSize:16,color:'black',fontWeight:"bold",alignSelf:"center"}}>Predictor</Text>
              </TouchableOpacity>
            </View> 




            <View style={styles.dressing_suggestions_container}>
              <TouchableOpacity onPress={()=> this.setState({selected_option:"dressing_suggestions"})}>
              <View style={styles._button}>
              <Image source={require('../assets/dressing_suggestions.png')} style={styles.button_logo}/>
              </View>
              <Text style={{fontSize:14,alignSelf:"center"}}>Dressing</Text>
              <Text style={{fontSize:16,color:'black',fontWeight:"bold",alignSelf:"center"}}>Options</Text>
              </TouchableOpacity>
            </View>



           
            </View>
           
            <View style={styles.Information_view}>
           
          
              <Information_view />
           
              
            </View>
            
           




         </LinearGradient>
         
         <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
   </View>
   
       )
     }
   }
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: '#f4f4f4',
      flexDirection:"column",
    justifyContent:"center"
     },
    home_header:{
      backgroundColor:'#0575E6',
      height:hp('30%'),
      width:wp('100%'),
      borderBottomEndRadius:wp('27%'),
      borderBottomStartRadius:wp('29%'),
      elevation:20
          
     },
     disease_predictor_container:{
      
       width:wp('20%'),
       alignItems:'center',
      marginTop:hp('-6%'),
      //marginLeft:wp('16%'),
      elevation:23
     },
     dressing_suggestions_container:{
      width:wp('20%'),
      alignItems:'center',
     marginTop:hp('-9%'),
    // marginLeft:wp('15%'),
    
     elevation:23
     },
     medicine_trend_container:{
      width:wp('20%'),
      alignItems:'center',
       marginTop:hp('-9%'),
     //marginLeft:wp('5%'),
     elevation:23
     },
     _button:{
      backgroundColor: '#D3CCE3',
       height:80,
       width:80,
       borderRadius:100,
      
     },
     button_logo:{
       height:79,
       width:79,
     
     },
     Information_view:{
      flex:1,
       marginTop:hp('4%'),
      alignSelf:"center",
       alignItems:"center",
      
     },
     Reloadbutton:{
      backgroundColor:'#6E78F7',
      height:hp('6%'),
      width:wp('40%'),
      borderRadius:35,
      alignItems:"center",
      justifyContent:"center",
      marginVertical:hp('1%'),
      elevation:26
},

    
   });