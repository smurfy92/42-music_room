import React, { Component } from 'react';
import './styles.css';
import { message, Button, Divider } from 'antd';
import CardHeader from './Header'
import CreatorProfil from './creatorProfil'
import BodyEvent from './Body'
import SimpleMap from '../simpleMap'
import axios from 'axios'
import geolib from 'geolib'
import { Tab } from 'react-bootstrap';

class cardEvent extends Component {
	constructor(props) {
        super(props);

        this.state = {
            isHidden: false,
            isCreator: false,
            isAdmin: false,
            isMember: false,
            isViewer: true,
        }

        this.saveButton = {
            'position': 'fixed',
            'bottom': '50px',
            'height': '80px',
            'left': '140px',
            'latitude': 0,
            'longitude': 0,
            'displayUser' : false
        }
    }


    isUser = (tab) => 
    {
        for (let i = 0; i < tab.length; i++) {
            if (tab[i].email == this.props.state.user.email)
                return true;
        }
        return false;
    }

    componentWillMount = () => {
        if (this.props.state.data.event.creator.email == this.props.state.user.email)
            this.setState({isCreator:true})
        else  {
            this.setState({isMember:this.isUser(this.props.state.data.event.members)})
            this.setState({isAdmin:this.isUser(this.props.state.data.event.adminMembers)})
        }

        if (this.state.isCreator || this.state.isMember || this.state.isAdmin)
            this.setState({isViewer:false})
    }
    updateMap(val){
        let calc = geolib.getDistanceSimple(
            {latitude: this.props.state.data.userCoord.lat, longitude: this.props.state.data.userCoord.lng},
            {latitude: this.props.state.data.event.location.coord.lat, longitude:this.props.state.data.event.location.coord.lng}
        );
        this.info("Vous êtes a " + calc/1000 + " km de l'event")
        this.props.state.data.mapHeight = '25vh'
        this.props.state.data.mapMargin = '0 0 0 0'
        this.setState({'isHidden': !this.state.isHidden})
    }

    saveEvent = () => { 
        let _id = this.props.state.data.event._id
        delete this.props.state.data.event._id
        axios.put('https://192.168.99.100:4242/event/' + _id,  this.props.state.data.event)
            .then((resp) => { 
                this.info("Event saved !")
                this.props.updateParent({'currentComponent': 'event'})
            })
            .catch((err) => { console.log("Create Event : handleSubmit :/event Error ", err); })  
    }

    info = (text) => {
        message.info(text);
      };
	render() {
        return (
            <div>
                <CardHeader state={this.props.state} updateParent={this.props.updateParent} />
                {this.state.isHidden ? <SimpleMap state={this.props.state} myState={this.state}/> : null}
                <Divider />
                <CreatorProfil right={this.state} state={this.props.state} updateParent={this.props.updateParent} />
                <BodyEvent right={this.state} state={this.props.state} updateParent={this.props.updateParent} updateMap={this.updateMap.bind(this)}/>
                <Button style={this.saveButton} type="primary" onClick={this.saveEvent}> <b> Sauvegarder l'event </b> </Button>
           </div>
        );
  }
}

export default cardEvent;
