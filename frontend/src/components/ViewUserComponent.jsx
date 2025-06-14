import React, { Component } from 'react'
import UserService from '../services/UserService'

class ViewUserComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            user: {}
        }
    }

    componentDidMount(){
        UserService.getUserById(this.state.id).then( res => {
            this.setState({user: res.data});
        })
    }

    maskPassword(password) {
        console.log("Original Password:", password);
        const maskedPassword = '*'.repeat(password.length);
        console.log("Masked Password:", maskedPassword);
        return maskedPassword;
    }
    

    render() {
        const { user } = this.state;

        return (
            <div>
                 <header className="header">
                <div>WEBTUBE USER MANAGEMENT</div>   
                 </header>
                <br></br>
                <div className = "card col-md-6 offset-md-3" id = "container">
                    <h3 className = "text-center"> View User Details</h3>
                    <div className = "card-body">
                        <div className = "row">
                            <label> User Full Name: </label>
                            <div> { this.state.user.fullName }</div>
                        </div>
                        <div className = "row">
                            <label> User Username: </label>
                            <div> { this.state.user.username }</div>
                        </div>
                        <div className="row">
                        <label> User Password: </label>
                        <div> {user.password ? this.maskPassword(user.password) : ''}</div>
                    </div>

                        <div className = "row">
                            <label> User Role: </label>
                            <div> { this.state.user.role }</div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default ViewUserComponent
