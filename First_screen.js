import React from 'react';

import LinearGradient from 'react-native-linear-gradient';//color shades 
import { StyleSheet, Text, Modal,TouchableHighlight,View,Image,Dimensions,TouchableOpacity,Alert,ActivityIndicator} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from 'react-native-responsive-screen';//this will help the responsive screen 
import { GoogleSignin } from '@react-native-community/google-signin';
import { firebase } from '@react-native-firebase/auth';




const {width,height}=Dimensions.get('window');//getting the screen height width



//class component for the screen that user see for the first time
export default class First_screen extends React.Component{
state={
    assets_loaded:false,
    showLoader:false,
    modalVisible:false,
    error:'',
    
}

     showLoader = async() => { this.setState({ showLoader:true }); };
      hideLoader = async() => { this.setState({ showLoader:false }); };

bootstrap=async()=>{
  
  await GoogleSignin.configure({
    scopes: ['profile', 'email'],
    webClientId: '419439016543-cmusi3bklg8l16vb9ekn7b45n385mt6m.apps.googleusercontent.com', // required
  });
}
google=async()=>{
 this.showLoader();
this.bootstrap();
 const { accessToken, idToken } = await GoogleSignin.signIn();
 credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
 
 
 await firebase.auth().signInWithCredential(credential).then(()=>{
this.hideLoader();
  this.props.navigation.navigate("Loading_screen",{user_status:'login'})
  console.log('user is sucessfuly signed in with google login and it is going to Loading screen from Login screen');

}

).catch((error)=>{
  this.setState({error:'We are sorry there is some thing wrong while logging you in with google. please make sure your internet connection is available and try again'})
  this.setState({modalVisible:true})
  this.hideLoader();
});
}




  

    render(){
       

          const Loader=()=>{
            if(this.state.showLoader==true){
              return(<ActivityIndicator animating={true} size="large" color="white" style={{position:'absolute',alignSelf:"flex-end"}}/>)
            }
            else{
              return null;
            }
          }

//login screen interface elements befor sign in clicked
        return (
          <View style={styles.container}>
            <Image source={ require('../../assets/login_background.jpg')} style={{...StyleSheet.absoluteFill,height:null,width:null}} />
             <LinearGradient colors={["#26a0daD9","#314755D9"]} style={{ ...StyleSheet.absoluteFill}} >
                  <View style={{ ...StyleSheet.absoluteFill}}>
                      <Image source={require('../../assets/splash.png')} style={styles.logo}/>
                   </View>
               </LinearGradient>
              
              <View style={{height:height/3,alignItems:"center"}}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Login_screen')} activeOpacity={.9}> 
                     <View style={styles.button}>
                         <Text style={{fontSize:20,fontWeight:"bold"}}>SIGN IN</Text>
                     </View>
                   </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.google()} activeOpacity={.9}>
                     <View style={{...styles.button,backgroundColor:'#D44638'}}>
                         <Text style={{fontSize:20,fontWeight:"bold",color:'#ffff'}}>SIGN IN WITH GOOGLE</Text>
                         <Loader/>
                       </View>
                   </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate('Signup_screen')} activeOpacity={.2}> 
                     <View style={{marginTop:8}}>
                         <Text style={{fontSize:14,color:'white'}}>Do not have an account ?</Text>
                     </View>
                   </TouchableOpacity>
               </View>
               <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          
          
        }}
      >

      <View style={styles.centeredView}>
          <View style={styles.modalView}>
          
     <Text style={{fontSize:16,fontWeight:'700',borderBottomWidth:1,borderBottomColor:'black',width:'100%',color:'#FF5733'}}>oh! An error has occured </Text>
     <Text style={{alignSelf:"center",paddingTop:8,fontSize:17}}>{this.state.error}</Text>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                this.setState({modalVisible:false})
              }}
            >
              <Text style={styles.textStyle}>OK got it</Text>
            </TouchableHighlight>
          </View>
        </View>
 


      </Modal>
           </View>
          );
        
 

    }
  
}


      //styles of the login screen 
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#6E78F7',
          justifyContent:"flex-end"
        
        },
      
        logo:{
            height:hp('60%'),
            width:wp('100%'),
            marginTop:hp('3%')
           
            
        },
        button:{
               backgroundColor:'#ffff',
               height:hp('9%'),
               width:wp('80%'),
               borderRadius:35,
               alignItems:"center",
               justifyContent:"center",
               marginVertical:hp('1%'),
               elevation:26
        },
        centeredView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          
          backgroundColor:'rgba(0,0,0,0.4)'
        },
        modalView: {
          margin: 20,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 35,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5
        },
        openButton: {
          backgroundColor: "#F194FF",
          borderRadius: 20,
          padding: 15,
          elevation: 2,
          marginTop:10
        },
        textStyle: {
          color: "white",
          fontWeight: "bold",
          textAlign: "center"
        },
        modalText: {
          marginBottom: 15,
          textAlign: "center"
        }
        
      });//end of style for login screen

