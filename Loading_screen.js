import React, { Component,useState, useEffect} from 'react';

import { View, Text, StyleSheet, ActivityIndicator,Image,AsyncStorage} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from 'react-native-responsive-screen';//this will help the responsive screen 
import auth from '@react-native-firebase/auth';



class Loading_Screen extends Component {

    state={
        assets_loaded:false,
        
    }
   

  


  async componentDidMount() {
     


//this will chechk whether the user is logged in or out
    this.unsuscruibeAuth= auth().onAuthStateChanged(
       (user)=>{
        if (user) {
            console.log('going to home screen from Loading screen');
            if(this.props.navigation.getParam('user_status')=='login'){
              console.log('login accour');
              AsyncStorage.setItem('user_status', 'login');
              this.props.navigation.navigate('Home_screen',{user:user});
            }
            else{
              this.props.navigation.navigate('Home_screen',{user:user});
            }
              
            
          
        } else {
            console.log('Going to Login screen From Loading screen');
          this.props.navigation.navigate('Stack_navigator');
        }
      }
    );//user login status check ends here 

  

    


    
  }

 componentWillUnmount(){
  this.unsuscruibeAuth()
}





  render() {



    return (
      <View style={styles.container}>
          <Image source={require('../assets/splash.png')} style={styles.logo}/>
        <ActivityIndicator size="large" color="white"  style={{marginTop:8}}/>
        <Text style={{color:'white',marginTop:8,fontSize:20}}>Loading Data ...</Text>
      </View>
    );
  }
}
export default Loading_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#6E78F7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo:{
    height:hp('60%'),
    width:wp('85%'),
    marginTop:hp('4%')
   
    
}
});