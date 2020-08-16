import React from 'react';
import LinearGradient from 'react-native-linear-gradient';//color shades 
import { StyleSheet,Modal,TouchableHighlight, Text, View,Alert,TouchableOpacity,KeyboardAvoidingView,ActivityIndicator} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from 'react-native-responsive-screen';//this will help the responsive screen 
import {  Item, Input, Label} from 'native-base';
import auth from '@react-native-firebase/auth';

//class component for the screen that user see for the login purpose
export default class Password_reset_screen extends React.Component{
    state={
        email:"",
        showLoader:false,
        modalVisible:false,
        error:'',
        navigation:false,
        title:''
        
      }

    
      showLoader = async() => { this.setState({ showLoader:true }); };
      hideLoader = async() => { this.setState({ showLoader:false }); };

      validate = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    
        return expression.test(String(email).toLowerCase())
    }
      //this method will reset the user password
      user_password_reset(email){
        if(email==""){
          this.setState({error:'Please input your email and then try again'})
          this.setState({title:'oh! An error has occured'})
          this.setState({modalVisible:true})
          this.setState({navigation:false})
          
        }
        else{

           this.showLoader();
           if( this.validate(email)==true){
        auth().sendPasswordResetEmail(email)
        
        .then(()=>{
          
          this.hideLoader();
          this.setState({navigation:true})
          this.setState({error:'Please check your email ('+this.state.email+') to reset your password'})
          this.setState({title:' Passsword Reset Link Sent'})
          this.setState({modalVisible:true})
          
          

        }).catch((error)=>{
          this.hideLoader();
          this.setState({navigation:false})
          this.setState({error:error.message})
          this.setState({title:'oh! An error has occured'})
          this.setState({modalVisible:true})
          
        });
      }
      else{
        this.setState({navigation:false})
        this.setState({error:"Please check your email address and correct it. If it is badly formated it should be like (xyz@xyz.com) and do not copy paste it try to type it"})
        this.setState({title:'oh! An error has occured'})
        this.setState({modalVisible:true})
        
         this.hideLoader()
      }
    }
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
       
//password reset interface 
        return (
                <KeyboardAvoidingView behavior='position'style={styles.container}>
                     <LinearGradient style={{ ...StyleSheet.absoluteFill}} colors={["#D3CCE3","#E9E4F0"]}>
                       <View style={styles.login_header}>
                            <View style={{marginLeft:4,marginTop:wp("8%")}}>
                               <TouchableOpacity onPress={() => this.props.navigation.goBack()}>   
                               <Text style={{fontSize:20,color:"#ffff",fontWeight:"bold"}}>Back</Text>
                                 </TouchableOpacity>  
                                 
                             </View> 
                             
                         </View>
                        <View style={styles.login_main}>
                               <View style={{marginTop:wp("-15.9%")}}>
                                    
                               </View>
                               <View style={{alignItems:"center"}}>
                                    <Text style={{fontSize:35,color:"#ffff",fontWeight:"bold"}}>RESET PASSWORD</Text> 
                                    <Text style={{fontSize:16,color:"#000",marginTop:40}}>Please enter email to reset password</Text>
                               </View>  
                               <View style={{alignItems:"center",marginTop:hp('10%')}}>
                                     <Item floatingLabel  style={{borderBottomColor:"#0575E6",backgroundColor:'white',width:wp('80%'),borderRadius:20}}>
                                           <Label><Text style={{fontSize:18,letterSpacing:2,fontWeight:'700'}}>Email</Text><Text style={{fontSize:12}}>(xyz@xyz.com)</Text></Label>
                                                 <Input  value={this.state.email} onChangeText={(text)=>this.setState({email:text})}/>
                                      </Item>
                                      <TouchableOpacity onPress={()=>this.user_password_reset(this.state.email)} activeOpacity={.9}>
                                     <View style={{...styles.button,backgroundColor:"#0575E6"}}>
                                            <Text style={{fontSize:20,fontWeight:"bold",color:'white'}}>RESET PASSWORD</Text>
                                            <Loader/>
                                     </View>
                                     </TouchableOpacity>
                               </View> 
                               
                        </View>
                    
                    </LinearGradient>


                    <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
         
          
        }}
      >

      <View style={styles.centeredView}>
          <View style={styles.modalView}>
          
     <Text style={{fontSize:16,fontWeight:'700',borderBottomWidth:1,borderBottomColor:'black',width:'100%',color:`${this.state.navigation?'#2196F3':'#FF5733'}`}}>{this.state.title} </Text>
     <Text style={{alignSelf:"center",paddingTop:8,fontSize:17}}>{this.state.error}</Text>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                this.setState({modalVisible:false})
                if(this.state.navigation==true){
                this.props.navigation.navigate("Login_screen")
              }
              }}
            >
              <Text style={styles.textStyle}>OK got it</Text>
            </TouchableHighlight>
          </View>
        </View>
 


      </Modal>
                 </KeyboardAvoidingView>
          );
        
 

    }
  
}


      //styles of the password  reset
      const styles = StyleSheet.create({
        container: {
            flex: 1
            
          },
        login_header:{
            backgroundColor:'#0575E6',
            height:hp('30%'),
            width:wp('100%'),
            borderBottomEndRadius:70,
            borderBottomStartRadius:70,
            elevation:20
          
     },
     login_main:{
         backgroundColor:'white',
         height:hp("40%"),
         width:wp('90%'),
         marginHorizontal:wp("3.5%"),
         borderRadius:30,
         marginTop:-hp('5%'),
         elevation:25,
         alignItems:"center"

     }, 
     button:{
        backgroundColor:'#ffff',
        height:hp('9%'),
        width:wp('80%'),
        borderRadius:35,
        alignItems:"center",
        justifyContent:"center",
        marginVertical:hp('1%'),
        elevation:10,
        marginTop:15
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