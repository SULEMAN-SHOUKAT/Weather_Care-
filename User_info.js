import React, { Component } from 'react'
import { StyleSheet,Text, View,Alert,TouchableOpacity,Modal,TouchableHighlight,ActivityIndicator, TouchableHighlightBase} from 'react-native'
import { Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import DropdownAlert from 'react-native-dropdownalert';
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from 'react-native-responsive-screen';
export default class User_info extends Component {

constructor(props) {
    super(props)

    this.state = {
         email:"",
         modalVisible:false,
        error:'',
        title:'',
        showLoader:false,
        showSignout_Loader:false,
        signout:false
         
    }
    this.ChangePassword=this.ChangePassword.bind(this);
    this.usersignout=this.usersignout.bind(this);
    this.signout=this.signout.bind(this);
}


showSignout_Loader = async() => { this.setState({ showSignout_Loader:true }); };
hideSignout_Loader = async() => { this.setState({ showSignout_Loader:false }); };
    
   showLoader = async() => { this.setState({ showLoader:true }); };
      hideLoader = async() => { this.setState({ showLoader:false }); };
    //handel the user signout of app
    usersignout(){
        this.showSignout_Loader();
        this.signout()
      }//end of signout 

ChangePassword(){
    this.showLoader();
    
    auth().sendPasswordResetEmail(this.props.user.email)
    .then(()=>{
        this.hideLoader();
      this.setState({error:'Please check your email ('+this.props.user.email+') to reset your password and then login again'})
      this.setState({title:' Passsword Reset Link Sent'})
      this.setState({modalVisible:true})
      this.setState({signout:true})
      

    }).catch((error)=>{
        this.hideLoader();
      this.setState({error:error.message})
      this.setState({title:'oh! An error has occured'})
      this.setState({modalVisible:true})
      this.setState({signout:false})
      
    });
}


 signout(){
    auth().signOut( this.hideSignout_Loader())
    .catch(error=>{
        this.hideSignout_Loader();
        this.setState({error:'There is an error while signing out try again'})
        this.setState({title:'oh! An error has occured'})
        this.setState({modalVisible:true})
        this.setState({signout:false})
         
 
    })
 }



    render() {
        const Loader=()=>{
            if(this.state.showLoader==true){
              return(<ActivityIndicator animating={true} size="small" color="white" style={{position:'absolute',alignSelf:"flex-end"}}/>)
            }
            else{
              return null;
            }
          }

          const Signout_Loader=()=>{
            if(this.state.showSignout_Loader==true){
              return(<ActivityIndicator animating={true} size="small" color="white" style={{position:'absolute',alignSelf:"flex-end"}}/>)
            }
            else{
              return null;
            }
          }
        
        

       
        return (
            <View style={{marginTop:hp('2%')}}>
                  <View style={styles.container}>
                <Icon
                        
                        name='user'
                        type='font-awesome'
                        color='#0575E6'
                        size={50}
                        />
                       
        <View style={{marginTop:hp('5%'),display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
        <Text style={{fontSize:25,fontWeight:'700'}}>Email</Text>
        <Text style={{fontSize:20}}>{this.props.user.email}</Text>
        
        <TouchableOpacity onPress={()=>this.usersignout()} activeOpacity={.9}> 
     <View style={styles.button}>
         <Text style={{fontSize:20,fontWeight:"bold",color:'white'}}>Sign Out</Text>
         <Signout_Loader/>
     </View>
   </TouchableOpacity>
   {this.props.user.photoURL!=null? null:
   <TouchableOpacity onPress={()=>this.ChangePassword()} activeOpacity={.9}> 
     <View style={styles.button2}>
         <Text style={{fontSize:20,fontWeight:"bold",color:'white'}}>Change Password</Text>
         <Loader/>
     </View>
   </TouchableOpacity>}
   </View>
                       
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
          
     <Text style={{fontSize:16,fontWeight:'700',borderBottomWidth:1,borderBottomColor:'black',width:'100%',color:`${this.state.navigation?'#2196F3':'#FF5733'}`}}>{this.state.title} </Text>
     <Text style={{alignSelf:"center",paddingTop:8,fontSize:17}}>{this.state.error}</Text>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                this.setState({modalVisible:false})
               if(this.state.signout==true){
                this.signout()
               }
                
              }}
            >
              <Text style={styles.textStyle}>OK got it</Text>
            </TouchableHighlight>
          </View>
        </View>
 


      </Modal>
               
            </View>
        )
    
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        padding:hp('4%'),
        backgroundColor:'white',
        elevation:8,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column',
        borderRadius:10
        


    },
    
        button:{
               backgroundColor:'#0575E6',
               height:hp('6%'),
               width:wp('60%'),
               borderRadius:25,
               alignItems:"center",
               justifyContent:"center",
               marginVertical:hp('3%'),
               elevation:5
        },
        button2:{
            backgroundColor:'#0575E6',
            height:hp('6%'),
            width:wp('60%'),
            borderRadius:25,
            alignItems:"center",
            justifyContent:"center",
            marginVertical:hp('0%'),
            elevation:5
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
});