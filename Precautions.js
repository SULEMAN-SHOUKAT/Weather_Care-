

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Button,

  
} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import Timeline from 'react-native-timeline-flatlist'
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from 'react-native-responsive-screen';//this will help the responsive screen 
export default class Precautions extends Component {
  constructor(){
    super()
   
    this.renderDetail = this.renderDetail.bind(this)
   this.state={
     data:[],
     results:'Not updated',
     error:null,
     ShowError:false
   }
    
   
  } 

 

 

  renderDetail(rowData, sectionID, rowID) {
    let title = <Text style={[styles.title]}>{rowData.title}</Text>
    var desc = null
    if(rowData.description)
      desc = (
        <View style={styles.descriptionContainer}>
          <Text style={[styles.textDescription]}>{rowData.description}</Text>
        </View>
      )
    
     
    return (
      <View style={{flex:1}}>
         
        {title}
        {desc}
      </View>
    )
  }


  fetchPrecautions(){
    this.setState({results:'Not updated'})
    this.setState({ShowError:false})
    this.setState({error:null})
    if(this.props.disease){
      fetch(`https://weather-care.herokuapp.com/Precaution?Disease=${this.props.disease}`)
      .then(response=>response.json())
      .then((data)=>{
        this.setState({data:data.Precautions})
        this.setState({results:data.Precautions})
      }).catch(error=>{
                       this.dropDownAlertRef.alertWithType('error', 'Error', `There is an error while getting the Precautions for ${this.props.disease}`);
                       this.setState({error:`we are sorry there is an error while getting the Precautions for ${this.props.disease}. Please check your internet connection and press (Reload) button`})
                       this.setState({ShowError:true})
                      })
      }
      else if(this.props.weather){
        fetch(`https://weather-care.herokuapp.com/dressingDiscription?Weather=${this.props.weather}`)
        .then(response=>response.json())
        .then((data)=>{
          this.setState({data:data.Precautions})
          this.setState({results:data.Precautions})
        }).catch(error=>{
                        this.dropDownAlertRef.alertWithType('error', 'Error', `we are sorry there is an error while getting the Precautions for ${this.props.weather} weather`);
                        this.setState({error:`we are sorry there is an error while getting the Precautions for ${this.props.weather} weather. Please check your internet connection and press (Reload) button`})
                        this.setState({ShowError:true})
                        })
       
    
    
      }
      else{
  }
}

componentDidMount(){
 this.fetchPrecautions();
  
}


//error messsage handling
ReloadButton=()=>{
  return (
   <View style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:hp('10%')}}>
     <View style={{marginBottom:5,backgroundColor:'white',paddingBottom:15,width:300,paddingLeft:10,paddingRight:10,alignItems:'center',borderRadius:10,elevation:2}}>
     <View style={{alignItems:'center',paddingTop:10}}><Text style={{fontSize:18,fontWeight:'700',borderBottomWidth:1,borderBottomColor:'black',width:'100%',color:'#FF5733'}}>oh! An error has occured </Text></View>
     
     <Text style={{alignSelf:"center",paddingTop:8,fontSize:17}}>{this.state.error}</Text>
     </View>
   <TouchableOpacity onPress={()=>this.fetchPrecautions()} style={{alignSelf:'center'}}>
     <View style={{...styles.Reloadbutton,backgroundColor:'#0575E6'}}>
         <Text style={{fontSize:20,fontWeight:"bold",color:'#ffff'}}>Reload</Text>
       </View>
   </TouchableOpacity>
  
   </View>
  )
}





  render() {
    console.log(this.state.results);
    if(this.state.results != 'Not updated'){
    return (
      <View style={styles.container}>
       <View style={{display:'flex',flexDirection:'row',width:wp('79%'),justifyContent:'space-between'}}>
        <TouchableOpacity onPress={()=>this.props.showDisease()}>
        <View style={{backgroundColor:'#0575E6',height:hp('4%'),width:wp('15%'),elevation:5,marginTop:4,justifyContent:'center',alignItems:'center',borderRadius:18}}>
    <Text style={{fontSize:16,color:'white',fontWeight:'700'}}>Back</Text>
            </View>
        </TouchableOpacity>
       <Text style={{fontSize:22,color:'black',fontWeight:'700'}}> { this.props.disease? `Precautions for ${this.props.disease=='heatStroke'? 'H-S':this.props.disease=='dangue'? 'dengue':this.props.disease}`: this.props.weather? 'Dressing Suggestion':null}</Text> 
       </View>
       
        <Timeline 
          style={styles.list}
          data={this.state.data}
          circleSize={20}
          circleColor='rgb(45,156,219)'
          lineColor='rgb(45,156,219)'
          timeContainerStyle={{minWidth:52, marginTop:.5}}
          timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13}}
          descriptionStyle={{color:'grey'}}
          options={{
            style:{paddingTop:10}
          }}
          innerCircle={'dot'}
          
          renderDetail={this.renderDetail}          
          separator={false}
          detailContainerStyle={{marginBottom: 20,marginRight:10, paddingLeft: 5, paddingRight: 5, backgroundColor: "#BBDAFF", elevation:10,borderRadius: 10}}
          columnFormat='single-column-left'
        />
      </View>
    );}
    else if(this.state.ShowError== true){
      return (<this.ReloadButton/>)
    }
    else{
      return (<View style={{width:'100%',height:'100%',marginTop:hp('15%')}}>
      <ActivityIndicator size="large" color="blue"  style={{marginTop:8}}/>
    <Text style={{color:'black',fontWeight:'700',fontSize:18}}>Generating Precautions for {this.props.disease? this.props.disease=='dangue'?'Dengue':this.props.disease:this.props.weather?`${this.props.weather} weather`:null}</Text>
    <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
   </View>)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    
    flex:1,
    width:wp('85%')
  },
  
  list: {
    
    flex: 1,
    marginTop:20,
  },
  title:{
    fontSize:16,
    fontWeight: 'bold'
  },
  descriptionContainer:{
    flexDirection: 'row',
    paddingRight: 50
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray',
    width:210
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